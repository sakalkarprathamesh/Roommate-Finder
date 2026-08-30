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

export default function InboxPage() {
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Contact Requests & Connections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review incoming requests for your listings, chat privately, and confirm space occupancy.
          </p>
        </div>

        <Link
          href="/find"
          className="px-4 py-2.5 bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto hover:bg-brand-800 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Find Accommodations
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'received'
              ? 'bg-brand-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <InboxIcon className="w-4 h-4" />
          Received Requests ({received.filter((r: any) => r.status === 'PENDING').length} Pending)
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'sent'
              ? 'bg-brand-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          Sent Requests ({sent.length})
        </button>

        <button
          onClick={() => setActiveTab('connected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'connected'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Connected & Unlocked ({connected.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Loading contact requests...
        </div>
      ) : activeTab === 'received' ? (
        received.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <InboxIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No contact requests yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When students view your listings and click &quot;Request Contact&quot;, their requests will appear here for your review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {received.map((r: any) => (
              <ContactRequestCard
                key={r.id}
                id={r.id}
                type="received"
                listingId={r.listingId}
                listingTitle={r.listingTitle}
                listingLocation={r.listingLocation}
                listingRent={r.listingRent}
                listingStatus={r.listingStatus}
                status={r.status}
                message={r.message}
                createdAt={r.createdAt}
                currentUserId={currentUser?.id}
                occupancyStatus={r.occupancyStatus}
                occupancyInitiatorId={r.occupancyInitiatorId}
                sender={r.sender}
                onActionComplete={fetchInbox}
              />
            ))}
          </div>
        )
      ) : activeTab === 'sent' ? (
        sent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Send className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No sent requests.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse listings on the Find page and send contact requests to connect with roommates!
            </p>
            <Link
              href="/find"
              className="inline-block px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl"
            >
              Explore Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sent.map((r: any) => (
              <ContactRequestCard
                key={r.id}
                id={r.id}
                type="sent"
                listingId={r.listingId}
                listingTitle={r.listingTitle}
                listingLocation={r.listingLocation}
                listingRent={r.listingRent}
                listingStatus={r.listingStatus}
                status={r.status}
                message={r.message}
                createdAt={r.createdAt}
                currentUserId={currentUser?.id}
                occupancyStatus={r.occupancyStatus}
                occupancyInitiatorId={r.occupancyInitiatorId}
                receiver={r.receiver}
                onActionComplete={fetchInbox}
              />
            ))}
          </div>
        )
      ) : connected.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No accepted connections yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once a contact request is approved, private chat and verified contacts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {connected.map((c: any) => (
            <ContactRequestCard
              key={c.id}
              id={c.id}
              type="connected"
              listingId={c.listingId}
              listingTitle={c.listingTitle}
              listingLocation={c.listingLocation}
              listingRent={c.listingRent}
              listingStatus={c.listingStatus}
              listingOwnerId={c.listingOwnerId}
              status="ACCEPTED"
              connectedAt={c.connectedAt}
              currentUserId={currentUser?.id}
              occupancyStatus={c.occupancyStatus}
              occupancyInitiatorId={c.occupancyInitiatorId}
              occupiedConfirmedAt={c.occupiedConfirmedAt}
              occupiedUndoUntil={c.occupiedUndoUntil}
              contact={c.contact}
              role={c.role}
              onActionComplete={fetchInbox}
            />
          ))}
        </div>
      )}
    </div>
  );
}
