'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Users,
  Search,
  Building2,
  FileCheck,
  Heart,
} from 'lucide-react';
import { LISTING_TYPES } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

function DashboardContent() {
  usePageMeta({
    title: 'Dashboard | Roomie',
    description: 'Explore accommodations, manage your listings, and connect with flatmates.',
    noindex: true,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any>({ received: [], sent: [], connected: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'saved' | 'occupied_past'>('active');

  // Sync tab with URL search parameter
  useEffect(() => {
    if (tabParam === 'saved') {
      setActiveTab('saved');
    } else if (tabParam === 'occupied' || tabParam === 'history') {
      setActiveTab('occupied_past');
    }
  }, [tabParam]);

  const fetchDashboardData = async () => {
    try {
      const [profRes, reqRes, listRes, meRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/contact-requests'),
        fetch('/api/listings?status=ALL'),
        fetch('/api/auth/me'),
      ]);

      if (profRes.status === 401 || reqRes.status === 401) {
        router.push('/login?redirect=/dashboard');
        return;
      }

      if (profRes.ok) {
        const pData = await profRes.json();
        setProfile(pData.profile);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
      }

      if (reqRes.ok) {
        const rData = await reqRes.json();
        setRequests(rData);
      }

      if (listRes.ok) {
        const lData = await listRes.json();
        const allListings = lData.listings || [];
        setListings(allListings);

        // Load saved listings from localStorage if any
        try {
          const savedIds = JSON.parse(localStorage.getItem('roomie_saved_listing_ids') || '[]');
          if (Array.isArray(savedIds) && savedIds.length > 0) {
            const matchedSaved = allListings.filter((l: any) => savedIds.includes(l.id));
            setSavedListings(matchedSaved);
          } else {
            setSavedListings([]);
          }
        } catch {
          setSavedListings([]);
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

  const currentUserId = user?.id || profile?.userId || profile?.id;
  const connectedListingIds = new Set((requests.connected || []).map((c: any) => c.listingId));

  const userListings = listings.filter((l) => {
    if (!currentUserId) return true;
    const isOwner = l.ownerId === currentUserId || l.owner?.id === currentUserId;
    const isOccupiedPartner =
      l.occupiedPartnerId === currentUserId ||
      l.occupiedInitiatorId === currentUserId;
    const isConnectedPartner = connectedListingIds.has(l.id);
    return isOwner || isOccupiedPartner || isConnectedPartner;
  });

  const activeListings = userListings.filter((l) => {
    const statusUpper = l.status?.toUpperCase();
    return (
      (statusUpper === 'ACTIVE' || statusUpper === 'VERIFIED') &&
      new Date(l.expiresAt) >= new Date() &&
      !l.occupiedConfirmedAt
    );
  });

  const occupiedListings = userListings.filter((l) => {
    const statusUpper = l.status?.toUpperCase();
    return (
      statusUpper === 'OCCUPIED' ||
      Boolean(l.occupiedConfirmedAt) ||
      (statusUpper === 'FILLED' && connectedListingIds.has(l.id))
    );
  });

  const isPGOwner = user?.role === 'PG_OWNER';
  const isFlatOwner = user?.role === 'FLAT_OWNER';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight">
              Welcome, {profile?.name || 'Roomie Student'} 👋
            </h1>
            <span className="px-2.5 py-0.5 bg-[#E6F4EA] dark:bg-[#133E26] border border-[#CEEAD6] dark:border-[#1E5E3A] text-[#137333] dark:text-[#81C995] text-xs font-bold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853] dark:text-[#81C995]" />
              {isPGOwner ? 'PG Owner Account' : isFlatOwner ? 'Flat Owner Account' : 'Verified Student'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#BDC1C6]">
            {profile?.department ? `${profile.department} • ` : ''}{profile?.year ? `${profile.year} • ` : ''}{profile?.school || 'MIT-ADT University'}
          </p>
        </div>

        {/* Primary Role Action */}
        {isPGOwner ? (
          <Link
            href="/manage/pg"
            className="px-5 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Building className="w-4 h-4" />
            <span>Manage Your PG</span>
          </Link>
        ) : isFlatOwner ? (
          <Link
            href="/manage/flat"
            className="px-5 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Manage Your Flat</span>
          </Link>
        ) : (
          <Link
            href="/listings/new"
            className="px-5 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Vacancy</span>
          </Link>
        )}
      </div>

      {/* 🌟 PROMINENT SEEKER DISCOVERY SECTION: STANDALONE 3 CARDS */}
      {!isPGOwner && !isFlatOwner && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
              <span>Explore Accommodations & Roommates</span>
            </h2>
            <span className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">Instant 1-Click Discovery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Find a Flat */}
            <Link
              href="/find?accommodationType=Flat"
              className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🏠
                </div>
                <h3 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF] group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                  FIND A FLAT
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Find available flats based on location, budget and preferences.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] gap-1 pt-2">
                <span>Browse Flats</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Find a PG */}
            <Link
              href="/find?accommodationType=PG"
              className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🏢
                </div>
                <h3 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF] group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                  FIND A PG
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Discover verified PGs near your preferred location.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] gap-1 pt-2">
                <span>Discover PGs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Find Flatmates */}
            <Link
              href="/find?listingType=NEED_ROOMMATE"
              className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  👥
                </div>
                <h3 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF] group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                  FIND FLATMATES
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Find compatible roommates based on lifestyle preferences.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] gap-1 pt-2">
                <span>Match Flatmates</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6] uppercase tracking-wider">Active Listings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-[#FFFFFF]">
              {activeListings.length}
            </span>
            <span className="text-xs font-semibold text-[#137333] dark:text-[#81C995] bg-[#E6F4EA] dark:bg-[#133E26] px-2.5 py-0.5 rounded-full">
              Available Now
            </span>
          </div>
        </div>

        <Link
          href="/inbox"
          className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-5 shadow-2xs space-y-1 hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-colors block"
        >
          <span className="text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6] uppercase tracking-wider">
            Connected Students
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#1A73E8] dark:text-[#8AB4F8]">
              {requests.connected?.length || 0}
            </span>
            <span className="text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#1E3A5F] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              Chat Unlocked
            </span>
          </div>
        </Link>

        <Link
          href="/inbox"
          className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-5 shadow-2xs space-y-1 hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-colors block"
        >
          <span className="text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6] uppercase tracking-wider">
            Pending Inquiries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-[#FDD663]">
              {(requests.received || []).filter((r: any) => r.status === 'PENDING').length}
            </span>
            <span className="text-xs font-semibold text-amber-800 dark:text-[#FDD663] bg-amber-50 dark:bg-[#3B3116] px-2.5 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
        </Link>
      </div>

      {/* Listings Management Tabs */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-[#DADCE0] dark:border-[#3C4043] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF]">My Accommodations & History</h2>
            <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">Manage your vacancies, active postings, and connection status.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] shadow-xs'
                  : 'text-[#5F6368] dark:text-[#BDC1C6] hover:bg-slate-100 dark:hover:bg-[#3C4043]'
              }`}
            >
              Active ({activeListings.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] shadow-xs'
                  : 'text-[#5F6368] dark:text-[#BDC1C6] hover:bg-slate-100 dark:hover:bg-[#3C4043]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Saved Listings ({savedListings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('occupied_past')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'occupied_past'
                  ? 'bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] shadow-xs'
                  : 'text-[#5F6368] dark:text-[#BDC1C6] hover:bg-slate-100 dark:hover:bg-[#3C4043]'
              }`}
            >
              Occupied & History ({occupiedListings.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* TAB 1: ACTIVE LISTINGS */}
          {activeTab === 'active' && (
            <div>
              {activeListings.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Building2 className="w-12 h-12 text-slate-300 dark:text-[#5F6368] mx-auto" />
                  <h3 className="font-bold text-[#202124] dark:text-[#FFFFFF] text-sm">No active listings</h3>
                  <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] max-w-sm mx-auto">
                    {isPGOwner
                      ? 'You have not added any PG accommodations yet.'
                      : isFlatOwner
                      ? 'You have not added any flat listings yet.'
                      : 'You have not posted any room or flatmate vacancies yet.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={isPGOwner ? '/pg/new' : isFlatOwner ? '/flat/new' : '/listings/new'}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] text-white font-bold text-xs rounded-2xl shadow-xs hover:bg-[#1557B0] transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isPGOwner ? 'Add PG' : isFlatOwner ? 'Add Flat' : 'Post Vacancy'}</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeListings.map((l) => (
                    <div
                      key={l.id}
                      className="p-5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-white dark:hover:bg-[#303134] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#202124] dark:text-[#FFFFFF] text-sm">{l.title}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] dark:bg-[#133E26] text-[#137333] dark:text-[#81C995] font-bold text-[10px]">
                            {l.status}
                          </span>
                        </div>
                        <div className="text-[#5F6368] dark:text-[#BDC1C6] flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{l.location} • ₹{l.rent?.toLocaleString('en-IN')}/mo</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/listings/${l.id}`}
                          className="px-3.5 py-1.5 bg-white dark:bg-[#3C4043] border border-[#DADCE0] dark:border-[#5F6368] text-[#202124] dark:text-[#FFFFFF] font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="p-2 text-[#EA4335] dark:text-[#F28B82] hover:bg-rose-50 dark:hover:bg-[#3C1E1E] rounded-xl transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 🌟 TAB 2: SAVED LISTINGS (EMPTY STATE: "No shared listings") */}
          {activeTab === 'saved' && (
            <div>
              {savedListings.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Building2 className="w-12 h-12 text-slate-300 dark:text-[#5F6368] mx-auto" />
                  <h3 className="font-bold text-[#202124] dark:text-[#FFFFFF] text-sm">
                    No shared listings
                  </h3>
                  <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] max-w-sm mx-auto">
                    You haven&apos;t saved or shared any accommodation listings yet.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/find"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A73E8] text-white font-bold text-xs rounded-2xl shadow-xs hover:bg-[#1557B0] transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Explore Accommodations</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedListings.map((l) => (
                    <div
                      key={l.id}
                      className="p-5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-white dark:hover:bg-[#303134] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#202124] dark:text-[#FFFFFF] text-sm">{l.title}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] font-bold text-[10px]">
                            Saved
                          </span>
                        </div>
                        <div className="text-[#5F6368] dark:text-[#BDC1C6] flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{l.location} • ₹{l.rent?.toLocaleString('en-IN')}/mo</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/listings/${l.id}`}
                          className="px-3.5 py-1.5 bg-white dark:bg-[#3C4043] border border-[#DADCE0] dark:border-[#5F6368] text-[#202124] dark:text-[#FFFFFF] font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OCCUPIED & HISTORY */}
          {activeTab === 'occupied_past' && (
            <div>
              {occupiedListings.length === 0 ? (
                <div className="py-12 text-center text-[#5F6368] dark:text-[#BDC1C6] text-xs">
                  No occupied accommodation history recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {occupiedListings.map((l) => (
                    <div
                      key={l.id}
                      className="p-5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs opacity-90"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#202124] dark:text-[#FFFFFF] text-sm">{l.title}</div>
                        <div className="text-[#5F6368] dark:text-[#BDC1C6]">
                          {l.location} • ₹{l.rent?.toLocaleString('en-IN')}/mo • <span className="font-bold text-[#137333] dark:text-[#81C995]">Occupied & Filled</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6]">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
