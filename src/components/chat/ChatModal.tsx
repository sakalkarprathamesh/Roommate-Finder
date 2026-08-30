'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  AlertCircle,
  Building,
  Loader2,
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  partnerName: string;
  listingTitle: string;
}

interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string | null;
  content: string;
  createdAt: string;
  isSelf: boolean;
}

export default function ChatModal({
  isOpen,
  onClose,
  connectionId,
  partnerName,
  listingTitle,
}: ChatModalProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate live word count
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = content.trim() ? words.length : 0;
  const isOverLimit = wordCount > 500;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!connectionId) return;
    try {
      const res = await fetch(`/api/contact-requests/${connectionId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to load messages');
      }
    } catch {
      // ignore network blips
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && connectionId) {
      setLoading(true);
      setError('');
      fetchMessages();

      // Poll every 3.5 seconds while open
      const interval = setInterval(fetchMessages, 3500);
      return () => clearInterval(interval);
    }
  }, [isOpen, connectionId]);

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    if (isOverLimit) {
      setError('Message exceeds 500 word limit — please shorten it');
      return;
    }

    setSending(true);
    setError('');

    try {
      const res = await fetch(`/api/contact-requests/${connectionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (res.ok) {
        setContent('');
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch {
      setError('Failed to send message. Please check your connection.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                Chat with {partnerName}
              </h3>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                {listingTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-700" />
              Loading chat...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">No messages yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Start the conversation with {partnerName} regarding accommodations or flat details.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 text-xs leading-relaxed ${
                    m.isSelf
                      ? 'bg-brand-900 text-white rounded-2xl rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-2xl rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input & Live Word Counter */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 space-y-2">
          <div className="relative">
            <textarea
              rows={2}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type a private message... (Press Enter to send)"
              className={`w-full text-xs p-3 pr-12 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none resize-none transition-all ${
                isOverLimit
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/20'
                  : 'border-slate-200 focus:border-brand-700'
              }`}
            />

            <button
              type="submit"
              disabled={sending || !content.trim() || isOverLimit}
              className={`absolute right-2.5 bottom-3.5 p-2 rounded-xl text-white font-bold transition-all shadow-xs ${
                !content.trim() || isOverLimit || sending
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-brand-900 hover:bg-brand-800'
              }`}
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Live Word Count Indicator */}
          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="text-slate-400">Press Shift + Enter for new line</span>
            <span
              className={`font-semibold ${
                isOverLimit
                  ? 'text-red-600 font-bold'
                  : wordCount > 450
                  ? 'text-amber-600'
                  : 'text-slate-500'
              }`}
            >
              {wordCount}/500 words
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
