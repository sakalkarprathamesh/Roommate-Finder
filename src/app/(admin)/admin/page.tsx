'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  Building,
  CheckCircle2,
  Trash2,
  Check,
  X,
  Mail,
  Phone,
  Ban,
  Flag,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Clock,
  AlertTriangle,
  FileCheck,
  MapPin,
  IndianRupee,
  Home,
  MessageSquare,
} from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function AdminDashboardPage() {
  usePageMeta({
    title: 'Admin Dashboard | Roomie',
    description: 'Platform administration and listing verification portal.',
    noindex: true,
  });

  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'listings' | 'users'>('verifications');
  const [listings, setListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  // Rejection Modal State
  const [rejectionModalListing, setRejectionModalListing] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAllAdminData = async () => {
    try {
      const [sRes, lRes, rRes, uRes, vRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/listings'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/users'),
        fetch('/api/admin/verifications'),
      ]);

      if (sRes.status === 401 || sRes.status === 403) {
        router.push('/login?redirect=/admin');
        return;
      }

      if (sRes.ok) setStats((await sRes.json()).stats);
      if (lRes.ok) setListings((await lRes.json()).listings || []);
      if (rRes.ok) setReports((await rRes.json()).reports || []);
      if (uRes.ok) setUsersList((await uRes.json()).users || []);
      if (vRes.ok) setVerifications((await vRes.json()).verifications || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const handleApproveListing = async (listingId: string) => {
    setProcessingId(listingId);
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, action: 'APPROVE' }),
      });
      if (res.ok) {
        setActionNotice('Listing verified and published live.');
        setTimeout(() => setActionNotice(''), 4000);
        fetchAllAdminData();
      }
    } catch {
      // handle error
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenRejectModal = (listing: any) => {
    setRejectionModalListing(listing);
    setRejectionReason('');
  };

  const handleConfirmRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalListing || !rejectionReason.trim()) return;

    setProcessingId(rejectionModalListing.id);
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: rejectionModalListing.id,
          action: 'REJECT',
          rejectionReason: rejectionReason.trim(),
        }),
      });
      if (res.ok) {
        setActionNotice('Listing rejected and owner notified with reason.');
        setTimeout(() => setActionNotice(''), 4000);
        setRejectionModalListing(null);
        setRejectionReason('');
        fetchAllAdminData();
      }
    } catch {
      // handle error
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to permanently remove this listing?')) return;
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionNotice('Listing removed successfully.');
        setTimeout(() => setActionNotice(''), 4000);
        fetchAllAdminData();
      }
    } catch {
      // handle error
    }
  };

  const handleReportAction = async (reportId: string, status: 'RESOLVED' | 'DISMISSED') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setActionNotice(`Report marked as ${status.toLowerCase()}.`);
        setTimeout(() => setActionNotice(''), 4000);
        fetchAllAdminData();
      }
    } catch {
      // handle error
    }
  };

  const handleUserStatus = async (userId: string, isActive: boolean) => {
    const actionText = isActive ? 'unban' : 'ban and deactivate';
    if (!confirm(`Are you sure you want to ${actionText} this user account?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (res.ok) {
        setActionNotice(`User account ${isActive ? 'reactivated' : 'banned and deactivated'}.`);
        setTimeout(() => setActionNotice(''), 4000);
        fetchAllAdminData();
      }
    } catch {
      // handle error
    }
  };

  const pendingCount = verifications.filter(
    (v) => (v.status || '').toUpperCase() === 'PENDING_VERIFICATION' || (v.status || '').toUpperCase() === 'PENDING'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Administrator Management Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 tracking-tight">
            Platform Moderation & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Review PG & Flat owner submissions, verify student listings, and manage community safety reports.
          </p>
        </div>

        {actionNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {actionNotice}
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Verification</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">{stats?.activeListings || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">{stats?.pendingReports || 0}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'verifications'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Listing Verifications ({pendingCount} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Reports Queue ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>All Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Directory ({usersList.length})</span>
        </button>
      </div>

      {/* TAB 1: Listing Verifications Queue */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              PG & Flat Verification Queue ({verifications.length} submissions)
            </h3>
            <span className="text-[11px] text-slate-400">
              Approved properties immediately appear in public search
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading verifications...</div>
          ) : verifications.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center text-xs text-slate-500">
              No pending PG or Flat verifications. All submissions are up to date!
            </div>
          ) : (
            <div className="space-y-6">
              {verifications.map((item) => {
                const status = (item.status || 'ACTIVE').toUpperCase();
                const isPending = status === 'PENDING_VERIFICATION' || status === 'PENDING';
                const isVerified = status === 'VERIFIED';
                const isRejected = status === 'REJECTED';
                const photos = item.photos ? JSON.parse(item.photos) : [];
                const amenities = item.amenities ? JSON.parse(item.amenities) : [];

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border p-6 space-y-5 transition-all ${
                      isPending
                        ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                        : isVerified
                        ? 'border-emerald-200 bg-emerald-50/20 opacity-90'
                        : 'border-rose-200 bg-rose-50/20 opacity-80'
                    }`}
                  >
                    {/* Top Row: Title, Type & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                            {item.accommodationType === 'PG' ? '🏢 PG Accommodation' : '🏡 Residential Flat'}
                          </span>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isPending
                                ? 'bg-amber-100 text-amber-800'
                                : isVerified
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            <span>{isPending ? '🟡' : isVerified ? '🟢' : '🔴'}</span>
                            <span>{status}</span>
                          </span>
                        </div>
                        <h2 className="text-lg font-black text-slate-900 mt-1">{item.title}</h2>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.address || 'Address not provided'}, {item.location}</span>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div className="text-right sm:text-right">
                        <div className="text-base font-black text-blue-700">
                          ₹{item.rent?.toLocaleString('en-IN')}/mo
                        </div>
                        {item.singleRent && (
                          <div className="text-[11px] text-slate-500">
                            Single: ₹{item.singleRent} | Double: ₹{item.doubleRent || '-'} | Triple: ₹{item.tripleRent || '-'}
                          </div>
                        )}
                        {item.deposit > 0 && (
                          <div className="text-[11px] text-slate-500">
                            Deposit: ₹{item.deposit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Owner Contact Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block font-semibold">Owner Name</span>
                        <span className="font-bold text-slate-900">{item.owner?.profile?.name || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block font-semibold">Mobile Number</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-600" />
                          {item.owner?.profile?.phone || 'No phone'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block font-semibold">Owner Email</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {item.owner?.email}
                        </span>
                      </div>
                    </div>

                    {/* Photo Gallery Preview */}
                    {photos.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Uploaded Photos ({photos.length})
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {photos.map((url: string, pIdx: number) => (
                            <div key={pIdx} className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                              <img src={url} alt={`Listing photo ${pIdx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description & Amenities */}
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 leading-relaxed">
                        &ldquo;{item.description}&rdquo;
                      </p>

                      {amenities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Amenities:</span>
                          {amenities.map((aId: string) => (
                            <span key={aId} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {aId.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* If rejected, show previous reason */}
                    {isRejected && item.rejectionReason && (
                      <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-2xl text-xs text-rose-900 font-semibold">
                        Rejection reason recorded: {item.rejectionReason}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Submitted on {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recently'}
                      </span>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(item)}
                              disabled={processingId === item.id}
                              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject with Reason</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleApproveListing(item.id)}
                              disabled={processingId === item.id}
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Approve & Publish</span>
                            </button>
                          </>
                        )}

                        {isVerified && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified by Admin
                          </span>
                        )}

                        {isRejected && (
                          <button
                            type="button"
                            onClick={() => handleApproveListing(item.id)}
                            className="px-4 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                          >
                            Re-Approve Listing
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Community Safety & Violation Reports ({reports.length})
            </h3>
            <span className="text-[11px] text-slate-400">Reporter identity is protected and confidential</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center text-xs text-slate-500">
              No violation reports filed. Everything is running smoothly.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-2xl border p-5 space-y-3.5 text-xs transition-colors ${
                    r.status === 'PENDING'
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                        {r.reason}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        r.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    &ldquo;{r.description || 'No additional details provided.'}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                    <div className="space-x-2 text-slate-500 text-[11px]">
                      {r.listing && (
                        <span>Target Listing: <strong className="text-slate-900">{r.listing.title}</strong></span>
                      )}
                    </div>

                    {r.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReportAction(r.id, 'RESOLVED')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleReportAction(r.id, 'DISMISSED')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: All Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Live Accommodations ({listings.length})
            </h3>
            <span className="text-[11px] text-slate-400">Manage all student and owner listings</span>
          </div>

          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{l.title}</div>
                  <div className="text-slate-500 text-xs">
                    {l.accommodationType} • {l.location} • ₹{l.rent}/mo • Status: {l.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveListing(l.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
                    title="Remove Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Registered Users Directory ({usersList.length})
            </h3>
          </div>

          <div className="space-y-3">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {u.profile?.name || u.email}
                    {u.role === 'admin' && <span className="ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Admin</span>}
                  </div>
                  <div className="text-slate-500 text-xs">{u.email} • {u.profile?.phone || 'No phone'} • Role: {u.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUserStatus(u.id, !u.isActive)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      u.isActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {u.isActive ? 'Ban User' : 'Unban'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalListing && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Reject Listing Verification
              </h2>
              <p className="text-xs text-slate-500">
                Specify why this listing was rejected. The owner will see this reason on their Manage page to correct and resubmit.
              </p>
            </div>

            <form onSubmit={handleConfirmRejection} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please upload clearer photos of the bedrooms and specify notice period."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalListing(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!rejectionReason.trim()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
