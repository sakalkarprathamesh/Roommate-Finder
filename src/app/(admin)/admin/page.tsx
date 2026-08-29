'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Check,
  X,
  Mail,
  Phone,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'users'>('listings');
  const [listings, setListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllAdminData = async () => {
    try {
      const [sRes, lRes, rRes, uRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/listings'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/users'),
      ]);

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
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, { method: 'DELETE' });
      if (res.ok) fetchAllAdminData();
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
      if (res.ok) fetchAllAdminData();
    } catch {
      // handle error
    }
  };

  const handleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (res.ok) fetchAllAdminData();
    } catch {
      // handle error
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
            <Shield className="w-4 h-4" />
            University Housing Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Administrator Portal</h1>
          <p className="text-xs text-slate-400">
            Manage student accommodation listings, resolve reports, and oversee platform activity.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{stats?.activeListings || 0}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Connections</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-900">
            {stats?.acceptedRequests || 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-red-600">{stats?.pendingReports || 0}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'listings' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Listings Moderation ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'reports' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Reports Queue ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'users' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Students Directory ({usersList.length})
        </button>
      </div>

      {/* Tab 1: Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-700">
            All Accommodation Listings
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
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{l.title}</td>
                    <td className="p-4">{l.listingType}</td>
                    <td className="p-4 font-black">₹{l.rent.toLocaleString('en-IN')}/mo</td>
                    <td className="p-4">{l.location}</td>
                    <td className="p-4">{l.owner?.profile?.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 font-bold text-[10px] rounded">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRemoveListing(l.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove Listing"
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

      {/* Tab 2: Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Safety & Violation Reports
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No reports filed.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[11px]">
                      {r.reason}
                    </span>
                    <span className="text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-slate-700">{r.description || 'No description provided.'}</p>
                  <div className="text-[11px] text-slate-500">
                    Reporter: {r.reporter?.profile?.name || 'Student'} • Status: {r.status}
                  </div>

                  {r.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleReportAction(r.id, 'DISMISSED')}
                        className="px-3 py-1 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleReportAction(r.id, 'RESOLVED')}
                        className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-xs"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Students Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-700">
            Registered Student Accounts
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Gmail / Contact</th>
                  <th className="p-4">Department & School</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{u.profile?.name || 'Student'}</td>
                    <td className="p-4 text-slate-600">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.profile?.phone}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div>{u.profile?.department}</div>
                      <div className="text-[11px] text-slate-400">{u.profile?.school}</div>
                    </td>
                    <td className="p-4">
                      {u.isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-50 text-red-800 text-[10px] font-bold rounded">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.isActive ? (
                        <button
                          onClick={() => handleUserStatus(u.id, false)}
                          className="px-3 py-1 bg-red-50 text-red-700 font-bold text-[11px] rounded-lg border border-red-200 hover:bg-red-100"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatus(u.id, true)}
                          className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200 hover:bg-emerald-100"
                        >
                          Reactivate
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
