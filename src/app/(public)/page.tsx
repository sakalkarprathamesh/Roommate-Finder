'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  PlusCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Home,
  Sparkles,
  MapPin,
  IndianRupee,
  UserCheck,
  MessageSquare,
  Compass,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PUNE_AREAS } from '@/lib/constants';

export default function HomePage() {
  usePageMeta({
    title: 'MIT-ADT Roommate Finder | Find Roommates & Rooms Near MIT-ADT',
    description:
      'Find verified roommates, shared flats, and student room vacancies near MIT-ADT University, Pune. Safe, student-only platform for MIT-ADT students.',
    noindex: false,
  });

  const router = useRouter();

  // Search State
  const [searchType, setSearchType] = useState<'HAVE_VACANCY' | 'NEED_ROOMMATE'>('HAVE_VACANCY');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Listings & Stats State
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [sampleListings, setSampleListings] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    occupiedListingsCount: number;
    matchedStudentsCount: number;
    activeListingsCount: number;
  }>({
    occupiedListingsCount: 0,
    matchedStudentsCount: 0,
    activeListingsCount: 0,
  });

  useEffect(() => {
    // 1. Fetch Real Live Listings (isDemo: false)
    fetch('/api/listings?status=ACTIVE')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) {
          setFeaturedListings(data.listings.slice(0, 4));
        }
      })
      .catch(() => {});

    // 2. Fetch Sample Demo Listings (isDemo: true, purely visual preview)
    fetch('/api/listings?demoOnly=true&status=ACTIVE')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) {
          setSampleListings(data.listings.slice(0, 4));
        }
      })
      .catch(() => {});

    // 3. Fetch Dynamic Public Matched Stats (isDemo: false only)
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStats({
            occupiedListingsCount: data.occupiedListingsCount || 0,
            matchedStudentsCount: data.matchedStudentsCount || 0,
            activeListingsCount: data.activeListingsCount || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchType) params.set('listingType', searchType);
    if (selectedLocation) params.set('location', selectedLocation);
    if (searchKeyword.trim()) params.set('q', searchKeyword.trim());

    if (selectedBudget === 'under5k') {
      params.set('maxRent', '5000');
    } else if (selectedBudget === '5k-8k') {
      params.set('minRent', '5000');
      params.set('maxRent', '8000');
    } else if (selectedBudget === '8k-12k') {
      params.set('minRent', '8000');
      params.set('maxRent', '12000');
    } else if (selectedBudget === 'above12k') {
      params.set('minRent', '12000');
    }

    router.push(`/find?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-900 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            <span>MIT-ADT University Student Accommodation Network</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
            Find the right roommate & flat near <span className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-700 bg-clip-text text-transparent">MIT-ADT</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Looking for a room, a shared flatmate, or someone to fill a vacancy? Connect directly with verified MIT-ADT students in one clean, broker-free platform.
          </p>

          {/* Interactive Quick Search Card */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-4 sm:p-6 space-y-4 text-left">
              {/* Type Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setSearchType('HAVE_VACANCY')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    searchType === 'HAVE_VACANCY'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Find a Room / Vacancy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchType('NEED_ROOMMATE')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    searchType === 'NEED_ROOMMATE'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Find a Flatmate</span>
                </button>
              </div>

              {/* Multi-Filter Search Form */}
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Location Select */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Campus Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">All Pune Areas</option>
                      {PUNE_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget Select */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Budget (₹/mo)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Any Budget</option>
                      <option value="under5k">Under ₹5,000</option>
                      <option value="5k-8k">₹5,000 - ₹8,000</option>
                      <option value="8k-12k">₹8,000 - ₹12,000</option>
                      <option value="above12k">₹12,000+</option>
                    </select>
                  </div>
                </div>

                {/* Keyword Search Input */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Keyword (Optional)
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 2BHK, CSE, WiFi..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="sm:col-span-12 pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-medium">
                    ⚡ Real-time verified student accommodations
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/listings/new"
                      className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Post Listing</span>
                    </Link>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Listings</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Quick Campus Filter Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Popular:
              </span>
              <Link
                href="/find?location=Near+MIT-ADT"
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-colors shadow-3xs flex items-center gap-1"
              >
                📍 Near MIT-ADT
              </Link>
              <Link
                href="/find?location=Loni+Kalbhor"
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-colors shadow-3xs flex items-center gap-1"
              >
                📍 Loni Kalbhor
              </Link>
              <Link
                href="/find?accommodationType=Flat"
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-colors shadow-3xs flex items-center gap-1"
              >
                🏠 Shared Flats (2BHK/3BHK)
              </Link>
              <Link
                href="/find?roomType=Single"
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-colors shadow-3xs flex items-center gap-1"
              >
                🛏️ Private Single Rooms
              </Link>
              <Link
                href="/find?maxRent=6000"
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-colors shadow-3xs flex items-center gap-1"
              >
                ⚡ Under ₹6,000/mo
              </Link>
            </div>
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <div className="bg-white rounded-2xl border border-slate-200 px-4 py-2.5 shadow-2xs inline-flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold text-slate-900">
                  {stats.occupiedListingsCount > 0
                    ? `${stats.matchedStudentsCount}+ Students Successfully Matched`
                    : 'MIT-ADT Student Peer Network'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {stats.occupiedListingsCount > 0
                    ? `${stats.occupiedListingsCount} spaces confirmed occupied across campuses`
                    : '100% verified student flatmates & shared rooms'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                Zero Brokers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Private Contact Sharing
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                Mutual Occupancy Confirmation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recent Listings (Only displayed when real student listings exist) */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Live Campus Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                Available Rooms & Vacancies
              </h2>
            </div>
            <Link
              href="/find"
              className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              Explore all listings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredListings.map((listing) => (
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
                isVisualOnly={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* How It Works (4-Step Process Section with Minimalist Styling) */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Simple 4-Step Process</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Structured accommodation discovery with protected contact sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-brand-200 hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-900 flex items-center justify-center font-black text-sm group-hover:bg-brand-900 group-hover:text-white transition-colors">
                  01
                </div>
                <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-brand-700 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Create your profile</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Register with your Gmail and select your MIT-ADT School, Department, and Academic Year.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-brand-200 hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-900 flex items-center justify-center font-black text-sm group-hover:bg-brand-900 group-hover:text-white transition-colors">
                  02
                </div>
                <Search className="w-5 h-5 text-slate-400 group-hover:text-brand-700 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Discover listings</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Filter by vacancies, room types, rent budget, Pune areas, and department preferences.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-brand-200 hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-900 flex items-center justify-center font-black text-sm group-hover:bg-brand-900 group-hover:text-white transition-colors">
                  03
                </div>
                <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-brand-700 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Send contact request</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click Request Contact on any listing to introduce yourself with zero initial phone exposure.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-brand-200 hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-900 flex items-center justify-center font-black text-sm group-hover:bg-brand-900 group-hover:text-white transition-colors">
                  04
                </div>
                <CheckCircle2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Connect & confirm</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Chat in-app, exchange contact info, and mutually confirm when the room vacancy is occupied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Accommodation Listings (Placed Directly BELOW 4-Step Process) */}
      {sampleListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Featured Accommodation Examples
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                Explore Popular Student Configurations
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Typical room types, pricing, and locations shared across MIT-ADT University campuses.
              </p>
            </div>

            <Link
              href="/find"
              className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 self-start sm:self-auto"
            >
              Browse all live listings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleListings.map((listing) => (
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
                isVisualOnly={true} // Non-clickable and purely visual
              />
            ))}
          </div>
        </section>
      )}

      {/* Privacy & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Lock className="w-4 h-4" />
              Privacy & Trust Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              &ldquo;Your contact information stays private until you choose to share it.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We never publicly display your phone number, Gmail address, or exact residential address. Private contacts and chat are only unlocked when you mutually accept a student&apos;s request.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/register"
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
