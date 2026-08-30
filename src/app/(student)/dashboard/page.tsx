'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Building,
  CheckCircle2,
  Clock,
  RotateCcw,
  Edit,
  Trash2,
  Inbox,
  UserCheck,
  ArrowRight,
  MapPin,
  Calendar,
  Home,
  MessageSquare,
  History,
  Sparkles,
} from 'lucide-react';
import { LISTING_TYPES } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function StudentDashboard() {
  usePageMeta({
    title: 'Dashboard | MIT-ADT Roommate Finder',
    description:
      'Manage your student accommodation listings, connection requests, and occupied room history.',
    noindex: true,
  });

  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any>({ received: [], sent: [], connected: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'occupied_past'>('active');

  const fetchDashboardData = async () => {
    try {
      const [profRes, reqRes, listRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/contact-requests'),
        fetch('/api/listings?status=ALL'),
      ]);

      if (profRes.status === 401 || reqRes.status === 401) {
        router.push('/login?redirect=/dashboard');
        return;
      }

      if (profRes.ok) {
        const pData = await profRes.json();
        setProfile(pData.profile);
      }

      if (reqRes.ok) {
        const rData = await reqRes.json();
        setRequests(rData);
      }

      if (listRes.ok) {
        const lData = await listRes.json();
        const allListings = lData.listings || [];
        setListings(allListings);
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusAction = async (listingId: string, action: string) => {
    try {
      const res = await fetch(`/api/listings/${listingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch {
      // handle error
    }
  };

  const handleOccupyAction = async (listingId: string, action: string) => {
    try {
      const res = await fetch(`/api/listings/${listingId}/occupy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch {
      // handle error
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch {
      // handle error
    }
  };

  const currentUserId = profile?.userId || profile?.id;
  const connectedListingIds = new Set((requests.connected || []).map((c: any) => c.listingId));

  // Filter listings where current user is:
  // 1. The listing OWNER
  // 2. The explicit OCCUPIED PARTNER
  // 3. An ACCEPTED connected roommate on this listing (covers listings marked occupied prior to recent updates)
  const userListings = listings.filter((l) => {
    if (!currentUserId) return true;
    const isOwner = l.ownerId === currentUserId || l.owner?.id === currentUserId;
    const isOccupiedPartner =
      l.occupiedPartnerId === currentUserId ||
      l.occupiedInitiatorId === currentUserId;
    const isConnectedPartner = connectedListingIds.has(l.id);
    return isOwner || isOccupiedPartner || isConnectedPartner;
  });

  // Tab 1: ONLY Active Listings (default view)
  const activeListings = userListings.filter((l) => {
    const statusUpper = l.status?.toUpperCase();
    return (
      statusUpper === 'ACTIVE' &&
      new Date(l.expiresAt) >= new Date() &&
      !l.occupiedConfirmedAt
    );
  });

  // Tab 2: Occupied & Past Listings (both new and legacy occupied data)
  const occupiedListings = userListings.filter((l) => {
    const statusUpper = l.status?.toUpperCase();
    return (
      statusUpper === 'OCCUPIED' ||
      Boolean(l.occupiedConfirmedAt) ||
      (statusUpper === 'FILLED' && connectedListingIds.has(l.id))
    );
  });

  const pastOtherListings = userListings.filter((l) => {
    const statusUpper = l.status?.toUpperCase();
    return (
      statusUpper === 'EXPIRED' ||
      (statusUpper === 'ACTIVE' && new Date(l.expiresAt) < new Date()) ||
      (statusUpper === 'FILLED' && !connectedListingIds.has(l.id))
    );
  });

  const occupiedAndPastListings = [...occupiedListings, ...pastOtherListings];

  const pendingReceived = (requests.received || []).filter((r: any) => r.status === 'PENDING');
  const connectedList = requests.connected || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome, {profile?.name || 'MIT-ADT Student'} 👋
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Email Verified Account
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {profile?.department} • {profile?.year} • {profile?.school}
          </p>
        </div>

        <Link
          href="/listings/new"
          className="px-5 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Listing</span>
        </Link>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeListings.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Available Now
            </span>
          </div>
        </div>

        <Link
          href="/inbox"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1 hover:border-brand-300 transition-colors block"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Contact Requests
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-brand-900">
              {pendingReceived.length}
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Pending Review
            </span>
          </div>
        </Link>

        <Link
          href="/inbox"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1 hover:border-emerald-300 transition-colors block"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Accepted Connections
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {connectedList.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Chat & Contacts
            </span>
          </div>
        </Link>
      </div>

      {/* Separated Dashboard Sections (Active Listings vs Occupied / Past Listings) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">My Accommodation Listings</h2>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-brand-700" />
              Active Listings ({activeListings.length})
            </button>
            <button
              onClick={() => setActiveTab('occupied_past')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'occupied_past'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              Occupied / Past Listings ({occupiedAndPastListings.length})
            </button>
          </div>
        </div>

        {/* SECTION 1: Active Listings (Default View) */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Loading your listings...
          </div>
        ) : activeTab === 'active' ? (
          activeListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <Building className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-800">No active listings currently.</p>
              <p className="text-xs text-slate-500">Post a new accommodation listing to find flatmates or fill vacancies!</p>
              <Link
                href="/listings/new"
                className="inline-block px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-brand-800"
              >
                + Create a Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeListings.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                        Active • Expires {new Date(l.expiresAt).toLocaleDateString()}
                      </span>
                      <Link href={`/listings/${l.id}`} className="block font-bold text-slate-900 text-sm mt-1 hover:text-brand-700">
                        {l.title}
                      </Link>
                    </div>
                    <span className="font-black text-slate-900 text-base">₹{l.rent.toLocaleString('en-IN')}/mo</span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {l.location}
                    </span>
                    <span>•</span>
                    <span>{l.accommodationType} ({l.roomType})</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listings/${l.id}/edit`}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleStatusAction(l.id, 'mark_filled')}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Mark Filled
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* SECTION 2: Occupied / Past Listings Tab */
          occupiedAndPastListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              No occupied or past listings found. Once listings reach occupied status with a roommate, they will be archived here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {occupiedAndPastListings.map((l) => {
                const isOccupied =
                  l.status?.toUpperCase() === 'OCCUPIED' ||
                  Boolean(l.occupiedConfirmedAt) ||
                  (l.status?.toUpperCase() === 'FILLED' && connectedListingIds.has(l.id));

                const isExpired =
                  l.status?.toUpperCase() === 'EXPIRED' ||
                  (l.status?.toUpperCase() === 'ACTIVE' && new Date(l.expiresAt) < new Date());

                const isFilled = l.status?.toUpperCase() === 'FILLED' && !isOccupied;
                const isOwner = l.ownerId === currentUserId || l.owner?.id === currentUserId;

                return (
                  <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isOccupied ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-900 text-white rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Occupied Space
                            </span>
                          ) : isFilled ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                              Filled
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                              Expired
                            </span>
                          )}

                          {isOccupied && l.occupiedConfirmedAt && (
                            <span className="text-[11px] text-slate-400">
                              Confirmed {new Date(l.occupiedConfirmedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-1">{l.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {l.location} • ₹{l.rent.toLocaleString('en-IN')}/mo
                          {!isOwner && (
                            <span className="ml-1 text-emerald-700 font-semibold">• Matched Roommate</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isOccupied ? (
                        isOwner ? (
                          /* Owner Reopen for Occupied Listings */
                          <button
                            onClick={() => handleOccupyAction(l.id, 'reopen')}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-blue-700" />
                            Reopen this listing
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Connected & Confirmed
                          </span>
                        )
                      ) : isExpired ? (
                        <button
                          onClick={() => handleStatusAction(l.id, 'renew')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Renew for 30 Days
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusAction(l.id, 'mark_active')}
                          className="px-3 py-1.5 bg-brand-50 text-brand-900 text-xs font-bold rounded-lg"
                        >
                          Re-open as Active
                        </button>
                      )}

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Inbox className="w-4 h-4 text-brand-700" />
              Recent Received Requests
            </h3>
            <Link href="/inbox" className="text-xs font-bold text-brand-700 hover:underline">
              View All
            </Link>
          </div>

          {pendingReceived.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No pending contact requests.</p>
          ) : (
            <div className="space-y-2">
              {pendingReceived.slice(0, 3).map((r: any) => (
                <div key={r.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{r.sender.profile.name}</span>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{r.listingTitle}</p>
                  </div>
                  <Link
                    href="/inbox"
                    className="px-3 py-1 bg-brand-900 text-white font-bold text-[11px] rounded-lg"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Connected Roommates & Chat
            </h3>
            <Link href="/inbox" className="text-xs font-bold text-brand-700 hover:underline">
              View All
            </Link>
          </div>

          {connectedList.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No approved connections yet.</p>
          ) : (
            <div className="space-y-2">
              {connectedList.slice(0, 3).map((c: any) => (
                <div key={c.id} className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{c.contact.profile.name}</span>
                    <p className="text-[11px] text-slate-500">{c.contact.profile.department}</p>
                  </div>
                  <Link
                    href="/inbox"
                    className="font-bold text-brand-900 bg-white px-2.5 py-1 rounded-lg border border-brand-200 text-xs flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-brand-700" />
                    Chat
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
