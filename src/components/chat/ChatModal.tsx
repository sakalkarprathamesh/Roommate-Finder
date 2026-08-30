'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  AlertCircle,
  Building,
  Loader2,
  Flag,
  CheckCircle2,
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

  // Report Modal States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Harassment');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');

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

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSending(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          description: `Chat Report on connection ${connectionId} (${partnerName}): ${reportDescription.trim()}`,
        }),
      });

      if (res.ok) {
        setReportSuccess('Thanks. Your report has been submitted to admin confidentially.');
        setTimeout(() => {
          setShowReportModal(false);
          setReportSuccess('');
          setReportDescription('');
        }, 1800);
      }
    } catch {
      // handle error
    } finally {
      setReportSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 relative">
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

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Report User for harassment or scam"
            >
              <Flag className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

        {/* In-Chat Report Form Modal */}
        {showReportModal && (
          <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <Flag className="w-4 h-4" />
                  <span>Report User ({partnerName})</span>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reportSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {reportSuccess}
                </div>
              ) : (
                <form onSubmit={handleSendReport} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Reason *
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
                    >
                      <option value="Harassment">Harassment / Abusive behavior</option>
                      <option value="Scam">Scam / Financial fraud</option>
                      <option value="Inappropriate content">Inappropriate messages</option>
                      <option value="Fake listing">Fake accommodation details</option>
                      <option value="Other">Other reason</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Provide additional context for administration..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reportSending}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      {reportSending ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
