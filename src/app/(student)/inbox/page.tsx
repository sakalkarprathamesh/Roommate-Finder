'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Inbox as InboxIcon,
  Send,
  UserCheck,
  Building2,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Compass,
} from 'lucide-react';
import ContactRequestCard from '@/components/inbox/ContactRequestCard';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function InboxPage() {
  usePageMeta({
    title: 'Inbox & Requests | Roomie',
    description: 'View student contact requests and private messages on Roomie.',
    noindex: true,
  });

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'connected'>('received');
  const [data, setData] = useState<any>({ received: [], sent: [], connected: [] });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      const [inboxRes, meRes] = await Promise.all([
        fetch('/api/contact-requests'),
        fetch('/api/auth/me'),
      ]);

      if (inboxRes.status === 401 || meRes.status === 401) {
        router.push('/login?redirect=/inbox');
        return;
      }

      if (inboxRes.ok) {
        const json = await inboxRes.json();
        setData(json);
      }

      if (meRes.ok) {
        const meJson = await meRes.json();
        setCurrentUser(meJson.user);
      }
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const received = data.received || [];
  const sent = data.sent || [];
  const connected = data.connected || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
            Contact Requests & Connections
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Review incoming requests for your listings, chat privately, and confirm space occupancy.
          </p>
        </div>

        <Link
          href="/find"
          className="px-4 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Find Accommodations</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DADCE0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'received'
              ? 'bg-[#1A73E8] text-white shadow-xs'
              : 'text-[#5F6368] hover:bg-slate-100'
          }`}
        >
          <InboxIcon className="w-4 h-4" />
          <span>Received Requests ({received.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('connected')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'connected'
              ? 'bg-[#1A73E8] text-white shadow-xs'
              : 'text-[#5F6368] hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Connected Students ({connected.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-[#1A73E8] text-white shadow-xs'
              : 'text-[#5F6368] hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({sent.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center text-[#5F6368] text-xs font-semibold">
          Loading contact requests...
        </div>
      ) : (
        <div>
          {activeTab === 'received' && (
            <div className="space-y-4">
              {received.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center space-y-2 shadow-2xs">
                  <InboxIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-[#202124] text-sm">No incoming requests yet</h3>
                  <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
                    When other students request your contact information for your listings, they will appear here.
                  </p>
                </div>
              ) : (
                received.map((req: any) => (
                  <ContactRequestCard
                    key={req.id}
                    {...req}
                    type="received"
                    currentUserId={currentUser?.id}
                    onActionComplete={fetchInbox}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'connected' && (
            <div className="space-y-4">
              {connected.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center space-y-2 shadow-2xs">
                  <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-[#202124] text-sm">No active connections yet</h3>
                  <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
                    Approved contact requests unlock mutual private numbers and chat history here.
                  </p>
                </div>
              ) : (
                connected.map((req: any) => (
                  <ContactRequestCard
                    key={req.id}
                    {...req}
                    type="connected"
                    currentUserId={currentUser?.id}
                    onActionComplete={fetchInbox}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-4">
              {sent.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center space-y-2 shadow-2xs">
                  <Send className="w-8 h-8 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-[#202124] text-sm">No sent requests</h3>
                  <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
                    Browse accommodation listings and click &ldquo;Request Contact&rdquo; to reach out to owners safely.
                  </p>
                </div>
              ) : (
                sent.map((req: any) => (
                  <ContactRequestCard
                    key={req.id}
                    {...req}
                    type="sent"
                    currentUserId={currentUser?.id}
                    onActionComplete={fetchInbox}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
