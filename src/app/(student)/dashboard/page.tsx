'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { LISTING_TYPES } from '@/lib/constants';

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any>({ received: [], sent: [], connected: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'expired' | 'filled'>('active');

  const fetchDashboardData = async () => {
    try {
      const [profRes, reqRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/contact-requests'),
      ]);

      if (profRes.ok) {
        const pData = await profRes.json();
        setProfile(pData.profile);
      }

      if (reqRes.ok) {
        const rData = await reqRes.json();
        setRequests(rData);
      }

      const listRes = await fetch('/api/listings?status=');
      if (listRes.ok) {
        const lData = await listRes.json();
        if (profile?.userId) {
          setListings(lData.listings?.filter((l: any) => l.owner.id === profile.userId) || []);
        } else {
          setListings(lData.listings || []);
        }
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

  const userListings = listings.filter((l) => profile?.userId ? l.ownerId === profile.userId || l.owner?.id === profile.userId : true);
  const activeListings = userListings.filter((l) => l.status === 'ACTIVE' && new Date(l.expiresAt) >= new Date());
  const expiredListings = userListings.filter((l) => l.status === 'EXPIRED' || (l.status === 'ACTIVE' && new Date(l.expiresAt) < new Date()));
  const filledListings = userListings.filter((l) => l.status === 'FILLED');

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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Listings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeListings.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Active
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
              Unlocked Contacts
            </span>
          </div>
        </Link>
      </div>

      {/* Listings Management Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">My Listings</h2>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Active ({activeListings.length})
            </button>
            <button
              onClick={() => setActiveTab('filled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'filled' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Filled ({filledListings.length})
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'expired' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Expired ({expiredListings.length})
            </button>
          </div>
        </div>

        {/* Current Tab Listings List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Loading your listings...
          </div>
        ) : activeTab === 'active' ? (
          activeListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <Building className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-800">No active listings.</p>
              <p className="text-xs text-slate-500">Create a listing to find roommates or flat vacancies!</p>
              <Link
                href="/listings/new"
                className="inline-block px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs"
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
        ) : activeTab === 'filled' ? (
          filledListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              No filled listings.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filledListings.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 opacity-80">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                        Filled
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{l.title}</h4>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleStatusAction(l.id, 'mark_active')}
                      className="px-3 py-1.5 bg-brand-50 text-brand-900 text-xs font-bold rounded-lg"
                    >
                      Re-open as Active
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : expiredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No expired listings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expiredListings.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                      Expired
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{l.title}</h4>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleStatusAction(l.id, 'renew')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Renew for 30 Days
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              Connected Roommates & Contacts
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
                  <a
                    href={`tel:${c.contact.profile.phone}`}
                    className="font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-xs"
                  >
                    {c.contact.profile.phone}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
