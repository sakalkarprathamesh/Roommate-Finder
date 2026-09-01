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
  Sparkles,
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
      <div className="bg-[#202124] dark:bg-[#303134] text-white rounded-3xl p-6 sm:p-8 border border-transparent dark:border-[#3C4043] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBBC04]/20 border border-[#FBBC04]/30 text-[#FDD663] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
              Example Demo Content
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sample Accommodation Listings
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-[#BDC1C6] max-w-2xl leading-relaxed">
              These sample listings demonstrate how rooms, flats, and PGs appear on Roomie. They are completely isolated from live student searches and are non-interactive previews.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/find"
              className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#202124] text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Explore Real Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-5 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368] dark:text-[#BDC1C6]" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sample listings by title, location, or amenities..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl text-[#202124] dark:text-[#E8EAED] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-2.5 text-[#202124] dark:text-[#E8EAED] font-semibold focus:bg-white focus:outline-none cursor-pointer"
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
            className="text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-2.5 text-[#202124] dark:text-[#E8EAED] font-semibold focus:bg-white focus:outline-none cursor-pointer"
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
            className="text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-2.5 text-[#202124] dark:text-[#E8EAED] font-semibold focus:bg-white focus:outline-none cursor-pointer"
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
            className="text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-2.5 text-[#202124] dark:text-[#E8EAED] font-semibold focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {PUNE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-slate-100 dark:hover:bg-[#3C4043] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Demo Listings Result Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6] uppercase tracking-wider">
            Showing {listings.length} Sample Listing{listings.length === 1 ? '' : 's'} (Example Only)
          </span>
          <Link
            href="/find"
            className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] hover:underline flex items-center gap-1"
          >
            <span>Switch to Real Student Listings</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-12 text-center text-xs font-semibold text-[#5F6368] dark:text-[#BDC1C6]">
            Loading sample listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-[#5F6368] mx-auto" />
            <h3 className="font-bold text-[#202124] dark:text-[#E8EAED] text-sm">No sample listings match your filters</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
              Try resetting your search filters or browse all accommodation types.
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
                isVisualOnly={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
