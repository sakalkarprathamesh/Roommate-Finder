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
} from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function AdminDashboardPage() {
  usePageMeta({
    title: 'Admin Dashboard | MIT-ADT Roommate Finder',
    description: 'Platform administration and moderation portal.',
    noindex: true,
  });

  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'listings' | 'users'>('reports');
  const [listings, setListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  const fetchAllAdminData = async () => {
    try {
      const [sRes, lRes, rRes, uRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/listings'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/users'),
      ]);

      if (sRes.status === 401 || sRes.status === 403) {
        router.push('/login?redirect=/admin');
        return;
      }

      if (sRes.ok) setStats((await sRes.json()).stats);
      if (lRes.ok) setListings((await lRes.json()).listings || []);
      if (rRes.ok) setReports((await rRes.json()).reports || []);
      if (uRes.ok) setUsersList((await uRes.json()).users || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner - Clean Design System (Matching Post Listing & Dashboard) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-brand-700" />
            Administrator Management Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Platform Moderation & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Review student accounts, manage safety reports, and oversee accommodation listings across MIT-ADT University.
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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-900">{stats?.activeListings || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Occupied</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{stats?.totalOccupied || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-700">{stats?.pendingReports || 0}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'reports'
              ? 'bg-brand-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Reports Queue ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'listings'
              ? 'bg-brand-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>All Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'users'
              ? 'bg-brand-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Directory ({usersList.length})</span>
        </button>
      </div>

      {/* TAB 1: Reports Queue */}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold uppercase text-[10px] mb-0.5">
                        Reporter (Admin Confidential)
                      </span>
                      <span className="font-bold text-slate-900">{r.reporter?.profile?.name || 'Student'}</span>
                      <span className="text-slate-500 block font-mono text-[10px]">{r.reporter?.email}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold uppercase text-[10px] mb-0.5">
                        Reported Target
                      </span>
                      {r.reportedUser ? (
                        <div>
                          <span className="font-bold text-slate-900">{r.reportedUser?.profile?.name || 'User'}</span>
                          <span className="text-slate-500 block font-mono text-[10px]">{r.reportedUser?.email}</span>
                        </div>
                      ) : r.listing ? (
                        <div>
                          <span className="font-bold text-slate-900 truncate block">{r.listing?.title}</span>
                          <span className="text-slate-400 text-[10px]">ID: {r.listing?.id}</span>
                        </div>
                      ) : (
                        <span>General inquiry</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {r.reportedUser && (
                        <button
                          onClick={() => handleUserStatus(r.reportedUser.id, false)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Ban User</span>
                        </button>
                      )}

                      {r.listing && (
                        <button
                          onClick={() => handleRemoveListing(r.listing.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Listing</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {r.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleReportAction(r.id, 'DISMISSED')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleReportAction(r.id, 'RESOLVED')}
                            className="px-4 py-1.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-700">
            All Accommodation Listings ({listings.length})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Listing Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Rent</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{l.title}</td>
                    <td className="p-4 text-slate-600">{l.listingType}</td>
                    <td className="p-4 font-black text-slate-900">₹{l.rent.toLocaleString('en-IN')}/mo</td>
                    <td className="p-4 text-slate-600">{l.location}</td>
                    <td className="p-4 text-slate-700">{l.owner?.profile?.name || l.owner?.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 font-bold text-[10px] rounded-lg">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRemoveListing(l.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Permanently Remove Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Users Directory & Ban Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-700">
            Registered Users Directory ({usersList.length})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department / School</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{u.profile?.name || 'Unnamed'}</td>
                    <td className="p-4 font-mono text-slate-600">{u.email}</td>
                    <td className="p-4 text-slate-500">{u.profile?.department || '—'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded-lg border ${
                        u.role === 'admin'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isActive ? (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] rounded-lg">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[10px] rounded-lg">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.isActive ? (
                        <button
                          onClick={() => handleUserStatus(u.id, false)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition-colors"
                        >
                          Ban User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatus(u.id, true)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors"
                        >
                          Unban User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
