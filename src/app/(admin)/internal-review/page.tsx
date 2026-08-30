'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function InternalReviewPage() {
  const [data, setData] = useState<{
    realUsers: any[];
    demoUsers: any[];
    realListings: any[];
    demoListings: any[];
  }>({
    realUsers: [],
    demoUsers: [],
    realListings: [],
    demoListings: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'demo' | 'real'>('demo');
  const [actionMsg, setActionMsg] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/internal-review');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleDemo = async (targetId: string, targetType: 'user' | 'listing', currentIsDemo: boolean) => {
    try {
      const res = await fetch('/api/admin/internal-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_demo',
          targetId,
          targetType,
          isDemo: !currentIsDemo,
        }),
      });
      if (res.ok) {
        setActionMsg(`Successfully moved ${targetType} to ${!currentIsDemo ? 'Demo/Testing' : 'Live Real Data'}`);
        setTimeout(() => setActionMsg(''), 4000);
        fetchData();
      }
    } catch {
      // handle error
    }
  };

  const handleTagAllDemoSeeds = async () => {
    try {
      const res = await fetch('/api/admin/internal-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tag_all_demo_seeds' }),
      });
      if (res.ok) {
        setActionMsg('Tagged all initial demo accounts and test listings as isDemo = true!');
        setTimeout(() => setActionMsg(''), 4000);
        fetchData();
      }
    } catch {
      // handle error
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Private Internal Portal (Hidden from Public & Students)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Data Isolation & Test Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage the separation between real live users and internal test/demo data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <Link
              href="/demo"
              className="px-4 py-2.5 bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Building className="w-4 h-4" />
              <span>Browse Demo Section</span>
            </Link>

            <button
              onClick={handleTagAllDemoSeeds}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-Flag Demo Seeds</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {actionMsg}
          </div>
        )}
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Real Live Users</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{data.realUsers.length}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Real Live Listings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{data.realListings.length}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">Searchable</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demo / Test Users</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-700">{data.demoUsers.length}</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Isolated</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demo / Test Listings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-700">{data.demoListings.length}</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Demo Section</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'demo'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo & Test Data ({data.demoUsers.length} users, {data.demoListings.length} listings)
            </button>
            <button
              onClick={() => setActiveTab('real')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'real'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Real Live Data ({data.realUsers.length} users, {data.realListings.length} listings)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading internal review data...</div>
        ) : activeTab === 'demo' ? (
          <div className="space-y-6">
            {/* Demo Listings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  Isolated Demo / Test Listings ({data.demoListings.length})
                </h3>
                <Link
                  href="/demo"
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                >
                  Open in Demo Section UI <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {data.demoListings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                  No demo listings currently in the database.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.demoListings.map((l) => (
                    <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {l.status} • Demo
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs mt-1">{l.title}</h4>
                          <p className="text-[11px] text-slate-500">{l.location} • ₹{l.rent}/mo</p>
                          <p className="text-[11px] text-slate-400">Owner: {l.owner?.profile?.name || l.owner?.email}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">ID: {l.id}</span>
                        <button
                          onClick={() => handleToggleDemo(l.id, 'listing', true)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-emerald-600" />
                          Make Real / Public
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Demo Users */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Isolated Demo / Test Accounts ({data.demoUsers.length})
              </h3>

              {data.demoUsers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                  No demo accounts found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.demoUsers.map((u) => (
                    <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between text-xs shadow-2xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{u.profile?.name || 'Unnamed User'}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                      </div>

                      <button
                        onClick={() => handleToggleDemo(u.id, 'user', true)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold"
                      >
                        Set as Real User
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Real Data Tab */
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                Real Live Listings (Visible to Students) ({data.realListings.length})
              </h3>

              {data.realListings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                  No real listings created by students yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.realListings.map((l) => (
                    <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                            {l.status} • Live Public
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs mt-1">{l.title}</h4>
                          <p className="text-[11px] text-slate-500">{l.location} • ₹{l.rent}/mo</p>
                          <p className="text-[11px] text-slate-400">Owner: {l.owner?.profile?.name || l.owner?.email}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">ID: {l.id}</span>
                        <button
                          onClick={() => handleToggleDemo(l.id, 'listing', false)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1"
                        >
                          <EyeOff className="w-3 h-3 text-slate-500" />
                          Move to Demo (Hide)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Real Live Accounts ({data.realUsers.length})
              </h3>

              {data.realUsers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                  No real registered students yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.realUsers.map((u) => (
                    <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between text-xs shadow-2xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{u.profile?.name || 'Unnamed User'}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                      </div>

                      <button
                        onClick={() => handleToggleDemo(u.id, 'user', false)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                      >
                        Mark as Demo
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
