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
  MapPin,
  Building,
  UserCheck,
  MessageSquare,
  ChevronRight,
  UserPlus,
  Send,
  CheckCheck,
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function HomePage() {
  usePageMeta({
    title: 'Roomie | Find your room. Find your people.',
    description:
      'Find rooms, flats, PGs and compatible roommates near your college at MIT-ADT University Pune.',
    noindex: false,
  });

  const [user, setUser] = useState<any>(null);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
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
    // Check Auth
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    // 1. Fetch Real Live Verified Listings (Excludes demo listings)
    fetch('/api/listings?status=ACTIVE')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) {
          setFeaturedListings(data.listings.slice(0, 4));
        }
      })
      .catch(() => {});

    // 2. Fetch Dynamic Public Matched Stats
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
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Welcome Pill with Vibrant Roomie Colors */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FE] border border-[#DADCE0] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="text-[#202124] dark:text-[#E8EAED]">
              Welcome to{' '}
              <span className="font-black text-sm tracking-normal capitalize inline-block">
                <span className="text-[#1A73E8] dark:text-[#8AB4F8]">R</span>
                <span className="text-[#EA4335] dark:text-[#F28B82]">o</span>
                <span className="text-[#FBBC04] dark:text-[#FDD663]">o</span>
                <span className="text-[#1A73E8] dark:text-[#8AB4F8]">m</span>
                <span className="text-[#34A853] dark:text-[#81C995]">i</span>
                <span className="text-[#EA4335] dark:text-[#F28B82]">e</span>
              </span>
            </span>
          </div>

          {/* Main Headline (Single Horizontal Line) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#202124] dark:text-[#E8EAED] tracking-tight leading-tight md:whitespace-nowrap">
            Find your <span className="text-[#1A73E8] dark:text-[#8AB4F8]">room.</span> Find your <span className="text-[#1A73E8] dark:text-[#8AB4F8]">people.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed max-w-2xl mx-auto font-normal">
            Find rooms, flats, PGs and compatible roommates near your college at MIT-ADT University Pune.
          </p>

          {/* Primary Action Buttons (Login & Register for new visitors) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!user ? (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register Free</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#303134] hover:bg-slate-50 dark:hover:bg-[#3C4043] border border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E8EAED] font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Login</span>
                </Link>

                <Link
                  href="/find"
                  className="w-full sm:w-auto px-6 py-3.5 text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-[#E8EAED] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Browse as Guest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/find"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Listings</span>
                </Link>

                <Link
                  href={user.role === 'PG_OWNER' ? '/pg/new' : user.role === 'FLAT_OWNER' ? '/flat/new' : '/listings/new'}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#303134] hover:bg-slate-50 dark:hover:bg-[#3C4043] border border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E8EAED] font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                  <span>Post Listing</span>
                </Link>
              </>
            )}
          </div>

          {/* Quick Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-2xl mx-auto">
            <Link
              href="/find?accommodationType=Room"
              className="p-4 bg-white dark:bg-[#303134] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🛏️</div>
              <div className="text-xs font-bold text-[#202124] dark:text-[#E8EAED]">Single Rooms</div>
              <div className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">Private space</div>
            </Link>

            <Link
              href="/find?accommodationType=Flat"
              className="p-4 bg-white dark:bg-[#303134] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🏡</div>
              <div className="text-xs font-bold text-[#202124] dark:text-[#E8EAED]">Shared Flats</div>
              <div className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">2BHK & 3BHK</div>
            </Link>

            <Link
              href="/find?accommodationType=PG"
              className="p-4 bg-white dark:bg-[#303134] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🏢</div>
              <div className="text-xs font-bold text-[#202124] dark:text-[#E8EAED]">Verified PGs</div>
              <div className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">Food & amenities</div>
            </Link>

            <Link
              href="/find?listingType=NEED_ROOMMATE"
              className="p-4 bg-white dark:bg-[#303134] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">👥</div>
              <div className="text-xs font-bold text-[#202124] dark:text-[#E8EAED]">Find Flatmate</div>
              <div className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">Verified peers</div>
            </Link>
          </div>

          {/* Social Proof Live Highlight */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-white dark:bg-[#303134] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] px-5 py-3 shadow-2xs inline-flex items-center gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#E6F4EA] dark:bg-[#133E26] border border-[#CEEAD6] dark:border-[#1E5E3A] text-[#137333] dark:text-[#81C995] flex items-center justify-center font-bold flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#202124] dark:text-[#E8EAED]">
                  {stats.occupiedListingsCount > 0
                    ? `${stats.matchedStudentsCount}+ Students Successfully Matched`
                    : '100% Student-Only Accommodation Network'}
                </div>
                <div className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] font-medium">
                  {stats.occupiedListingsCount > 0
                    ? `${stats.occupiedListingsCount} confirmed spaces near MIT-ADT University campuses`
                    : 'Discover rooms, PGs, and compatible flatmates safely'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recent Listings */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] uppercase tracking-wider">
                Recent Accommodation Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-[#E8EAED] mt-0.5 tracking-tight">
                Available Rooms & Vacancies
              </h2>
            </div>
            <Link
              href="/find"
              className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] hover:underline flex items-center gap-1"
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

      {/* 🌟 HOW IT WORKS (VIBRANT GOOGLE 4-STEP PROCESS SECTION) */}
      <section className="bg-white dark:bg-[#1E1E22] border-y border-[#DADCE0] dark:border-[#3C4043] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl font-black text-[#202124] dark:text-[#E8EAED] tracking-tight">
              Simple 4-Step Process
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#BDC1C6]">
              Structured accommodation discovery with protected contact sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 - Google Blue */}
            <div className="bg-[#F8F9FA] dark:bg-[#303134] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#1A73E8] dark:text-[#8AB4F8]">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center text-lg">
                    👤
                  </div>
                </div>
                <h3 className="font-black text-[#202124] dark:text-[#E8EAED] text-base tracking-tight">
                  Create your profile
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Register with mobile & email, solve CAPTCHA, pick your role (Seeker, PG Owner, Flat Owner), and set your preferences.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#3C4043] text-[11px] font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                Step 1: Role Setup →
              </div>
            </div>

            {/* Step 2 - Google Red */}
            <div className="bg-[#F8F9FA] dark:bg-[#303134] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#EA4335] dark:hover:border-[#F28B82] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#EA4335] dark:text-[#F28B82]">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FCE8E6] dark:bg-[#3C1E1E] text-[#EA4335] dark:text-[#F28B82] flex items-center justify-center text-lg">
                    🔍
                  </div>
                </div>
                <h3 className="font-black text-[#202124] dark:text-[#E8EAED] text-base tracking-tight">
                  Find a suitable listing
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Filter verified PGs, flats, and shared vacancies by single/double occupancy, budget, deposit, and student amenities.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#3C4043] text-[11px] font-bold text-[#EA4335] dark:text-[#F28B82]">
                Step 2: Smart Discovery →
              </div>
            </div>

            {/* Step 3 - Google Yellow */}
            <div className="bg-[#F8F9FA] dark:bg-[#303134] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#FBBC04] dark:hover:border-[#FDD663] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#FBBC04] dark:text-[#FDD663]">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF7E0] dark:bg-[#3B3116] text-[#7A4B04] dark:text-[#FDD663] flex items-center justify-center text-lg">
                    📩
                  </div>
                </div>
                <h3 className="font-black text-[#202124] dark:text-[#E8EAED] text-base tracking-tight">
                  Send a contact request
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Click Request Contact on any verified listing to introduce yourself with safety — private phone numbers remain protected.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#3C4043] text-[11px] font-bold text-[#7A4B04] dark:text-[#FDD663]">
                Step 3: Safe Request →
              </div>
            </div>

            {/* Step 4 - Google Green */}
            <div className="bg-[#F8F9FA] dark:bg-[#303134] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#34A853] dark:hover:border-[#81C995] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#34A853] dark:text-[#81C995]">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] dark:bg-[#133E26] text-[#137333] dark:text-[#81C995] flex items-center justify-center text-lg">
                    🤝
                  </div>
                </div>
                <h3 className="font-black text-[#202124] dark:text-[#E8EAED] text-base tracking-tight">
                  Connect & confirm
                </h3>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                  Chat privately in your Inbox, unlock verified contact details upon acceptance, and mutually confirm when occupied.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#3C4043] text-[11px] font-bold text-[#137333] dark:text-[#81C995]">
                Step 4: Unlock & Move In →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#202124] dark:bg-[#303134] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-transparent dark:border-[#3C4043]">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#34A853] dark:text-[#81C995]">
              <Lock className="w-4 h-4" />
              Privacy & Trust Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              &ldquo;Your contact information stays private until you choose to share it.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-[#BDC1C6] leading-relaxed">
              We never publicly display your phone number, Gmail address, or exact residential address. Private contacts and chat are only unlocked when you mutually accept a student&apos;s request.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#202124] font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
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
