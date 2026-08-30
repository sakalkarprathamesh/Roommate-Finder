'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';

export default function HomePage() {
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

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-brand-700" />
            MIT-ADT University Student Accommodation Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
            Find the right roommate at <span className="text-brand-700">MIT-ADT</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Looking for a room, a flatmate, or someone to fill a vacancy? Connect with fellow MIT-ADT students in one place.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/find?listingType=HAVE_VACANCY"
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Find a Room</span>
            </Link>

            <Link
              href="/find?listingType=NEED_ROOMMATE"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-brand-700" />
              <span>Find a Roommate</span>
            </Link>

            <Link
              href="/listings/new"
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-700" />
              <span>Post a Listing</span>
            </Link>
          </div>

          {/* Public Matched Counter Highlight */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3 shadow-2xs inline-flex items-center gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {stats.occupiedListingsCount > 0
                    ? `${stats.matchedStudentsCount}+ Students Successfully Matched`
                    : 'Be one of our first successful matches!'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {stats.occupiedListingsCount > 0
                    ? `${stats.occupiedListingsCount} spaces confirmed occupied across MIT-ADT campuses`
                    : 'Discover verified student flatmates and shared rooms safely'}
                </div>
              </div>
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
                Recent Accommodation Listings
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

      {/* How It Works (4-Step Process Section) */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl font-black text-slate-900">Simple 4-Step Process</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Structured accommodation discovery with protected contact sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
              <span className="text-2xl font-black text-brand-700">01</span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Create your profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register with your Gmail, select your MIT-ADT School, Department, and Year.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
              <span className="text-2xl font-black text-brand-700">02</span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Find a suitable listing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by vacancies, room types, rent, location, and department preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
              <span className="text-2xl font-black text-brand-700">03</span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Send a contact request</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click Request Contact on the listing to introduce yourself without exposing private data.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
              <span className="text-2xl font-black text-brand-700">04</span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Connect & confirm occupancy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chat privately, share contact details, and mutually confirm when the space is occupied.
              </p>
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
            <h2 className="text-2xl sm:text-3xl font-black">
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
