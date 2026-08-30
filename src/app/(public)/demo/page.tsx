'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import {
  LISTING_TYPES,
  ACCOMMODATION_TYPES,
  ROOM_TYPES,
  PUNE_AREAS,
} from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function DemoListingsPage() {
  usePageMeta({
    title: 'Demo Listings | MIT-ADT Roommate Finder',
    description: 'Sample demo accommodation listings.',
    noindex: true,
  });

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [q, setQ] = useState('');
  const [listingType, setListingType] = useState('');
  const [accommodationType, setAccommodationType] = useState('');
  const [roomType, setRoomType] = useState('');
  const [location, setLocation] = useState('');
  const [maxRent, setMaxRent] = useState('');

  const fetchDemoListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('demoOnly', 'true');
      params.set('status', 'ACTIVE');
      if (q) params.set('q', q);
      if (listingType) params.set('listingType', listingType);
      if (accommodationType) params.set('accommodationType', accommodationType);
      if (roomType) params.set('roomType', roomType);
      if (location) params.set('location', location);
      if (maxRent) params.set('maxRent', maxRent);

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoListings();
  }, [listingType, accommodationType, roomType, location, maxRent]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDemoListings();
  };

  const handleReset = () => {
    setQ('');
    setListingType('');
    setAccommodationType('');
    setRoomType('');
    setLocation('');
    setMaxRent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Demo Section Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Private Demo & Test Section
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Demo Accommodation Listings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              These sample listings are isolated from the real user experience. You can browse, inspect, and test interactions here safely without mixing into live student searches.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/internal-review"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Manage Isolated Data</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search demo listings by title, description, or student name..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Search Demo
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
          >
            <option value="">All Listing Types</option>
            {Object.entries(LISTING_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={accommodationType}
            onChange={(e) => setAccommodationType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
          >
            <option value="">All Housing Types</option>
            {ACCOMMODATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
          >
            <option value="">All Room Types</option>
            {ROOM_TYPES.map((r) => (
              <option key={r} value={r}>
                {r} Room
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
          >
            <option value="">All Locations</option>
            {PUNE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Demo Listings Result Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {listings.length} Isolated Demo Listing{listings.length === 1 ? '' : 's'}
          </span>
          <Link
            href="/find"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
          >
            Go to Live Real Search <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Loading demo listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No demo listings match your filters</h3>
            <p className="text-xs text-slate-500">
              You can create new demo listings or re-tag test data anytime in the internal portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                listingType={listing.listingType}
                accommodationType={listing.accommodationType}
                roomType={listing.roomType}
                location={listing.location}
                rent={listing.rent}
                deposit={listing.deposit}
                currentOccupants={listing.currentOccupants}
                vacancies={listing.vacancies}
                totalCapacity={listing.totalCapacity}
                moveInDate={listing.moveInDate}
                owner={listing.owner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
