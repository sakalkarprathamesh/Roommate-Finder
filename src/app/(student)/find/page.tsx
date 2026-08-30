'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Building,
  GraduationCap,
  Filter,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import {
  MIT_SCHOOLS,
  MIT_DEPARTMENTS,
  ACADEMIC_YEARS,
  LISTING_TYPES,
  ACCOMMODATION_TYPES,
  ROOM_TYPES,
  PUNE_AREAS,
} from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

function FindContent() {
  usePageMeta({
    title: 'Find Roommates & Rooms | MIT-ADT Roommate Finder',
    description:
      'Search and filter verified student accommodations, flat vacancies, and compatible roommates near MIT-ADT University Pune.',
    noindex: false,
  });

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    listingType: searchParams.get('listingType') || '',
    accommodationType: searchParams.get('accommodationType') || '',
    roomType: searchParams.get('roomType') || '',
    location: searchParams.get('location') || '',
    school: searchParams.get('school') || '',
    department: searchParams.get('department') || '',
    year: searchParams.get('year') || '',
    minRent: parseInt(searchParams.get('minRent') || '0', 10),
    maxRent: parseInt(searchParams.get('maxRent') || '999999', 10),
    sortBy: 'newest',
  });

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.listingType) params.set('listingType', filters.listingType);
      if (filters.accommodationType) params.set('accommodationType', filters.accommodationType);
      if (filters.roomType) params.set('roomType', filters.roomType);
      if (filters.location) params.set('location', filters.location);
      if (filters.school) params.set('school', filters.school);
      if (filters.department) params.set('department', filters.department);
      if (filters.year) params.set('year', filters.year);
      if (filters.minRent > 0) params.set('minRent', filters.minRent.toString());
      if (filters.maxRent < 999999) params.set('maxRent', filters.maxRent.toString());
      if (filters.sortBy) params.set('sortBy', filters.sortBy);

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
    fetchListings();
  }, [filters]);

  const handleReset = () => {
    setFilters({
      q: '',
      listingType: '',
      accommodationType: '',
      roomType: '',
      location: '',
      school: '',
      department: '',
      year: '',
      minRent: 0,
      maxRent: 999999,
      sortBy: 'newest',
    });
  };

  const updateField = (key: string, val: any) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Find Accommodations & Roommates
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse vacancies, rooms, and roommate requests from MIT-ADT University students.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-700" />
              <span>Filters</span>
            </button>
            <Link
              href="/listings/new"
              className="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => updateField('q', e.target.value)}
            placeholder="Search by keyword, flat details, student name, or location (e.g. Loni Kalbhor, Wagholi)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:border-brand-600 focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900">
              <Filter className="w-4 h-4 text-brand-700" />
              Filters
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-brand-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateField('sortBy', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
            </select>
          </div>

          {/* Accommodation Filters */}
          <div className="space-y-4">
            <div className="font-bold text-xs text-brand-900 uppercase tracking-wider border-b border-slate-100 pb-1">
              Accommodation Filters
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Listing Type</label>
              <select
                value={filters.listingType}
                onChange={(e) => updateField('listingType', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Listing Types</option>
                {Object.entries(LISTING_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Accommodation</label>
              <select
                value={filters.accommodationType}
                onChange={(e) => updateField('accommodationType', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Types</option>
                {ACCOMMODATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Room Type</label>
              <select
                value={filters.roomType}
                onChange={(e) => updateField('roomType', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Room Types</option>
                {ROOM_TYPES.map((r) => (
                  <option key={r} value={r}>
                    {r} Room
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Locations</option>
                {PUNE_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Budget Max (₹)</label>
              <input
                type="number"
                value={filters.maxRent >= 999999 ? '' : filters.maxRent}
                onChange={(e) => updateField('maxRent', parseInt(e.target.value, 10) || 999999)}
                placeholder="e.g. 10000"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>
          </div>

          {/* Academic Filters */}
          <div className="space-y-4 pt-2">
            <div className="font-bold text-xs text-brand-900 uppercase tracking-wider border-b border-slate-100 pb-1">
              Academic Filters
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">School / SOC</label>
              <select
                value={filters.school}
                onChange={(e) => updateField('school', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Schools</option>
                {MIT_SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => updateField('department', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Departments</option>
                {MIT_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Academic Year</label>
              <select
                value={filters.year}
                onChange={(e) => updateField('year', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
              >
                <option value="">All Years</option>
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="md:hidden col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider">Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="text-xs font-bold text-brand-700">
                Close
              </button>
            </div>
            <select
              value={filters.listingType}
              onChange={(e) => updateField('listingType', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
            >
              <option value="">All Listing Types</option>
              {Object.entries(LISTING_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select
              value={filters.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
            >
              <option value="">All Locations</option>
              {PUNE_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                handleReset();
                setShowMobileFilters(false);
              }}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Results Column */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Loading listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No listings found.</h3>
              <p className="text-xs text-slate-500">Try changing your filters or search keywords.</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-brand-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((l) => (
                <ListingCard
                  key={l.id}
                  id={l.id}
                  title={l.title}
                  listingType={l.listingType}
                  accommodationType={l.accommodationType}
                  roomType={l.roomType}
                  location={l.location}
                  rent={l.rent}
                  deposit={l.deposit}
                  currentOccupants={l.currentOccupants}
                  vacancies={l.vacancies}
                  totalCapacity={l.totalCapacity}
                  moveInDate={l.moveInDate}
                  owner={l.owner}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FindPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
          Loading listings search...
        </div>
      }
    >
      <FindContent />
    </Suspense>
  );
}
