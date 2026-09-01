'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building, Home, Users, ArrowRight, Sparkles } from 'lucide-react';
import ListingForm from '@/components/listings/ListingForm';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NewListingPage() {
  usePageMeta({
    title: 'Post a Listing | Roomie',
    description: 'List an available room, shared flat vacancy, or post your accommodation for MIT-ADT University students.',
    noindex: true,
  });

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'SEEKER' | 'PG' | 'FLAT'>('SEEKER');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (data.user.role === 'PG_OWNER') {
            router.replace('/pg/new');
          } else if (data.user.role === 'FLAT_OWNER') {
            router.replace('/flat/new');
          }
        }
      })
      .catch(() => {});
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
          Post an Accommodation Listing
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368]">
          Select the type of listing you would like to publish on Roomie.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setSelectedType('SEEKER')}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
            selectedType === 'SEEKER'
              ? 'border-[#1A73E8] bg-[#E8F0FE] shadow-xs'
              : 'border-[#DADCE0] bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-2xl mb-2">👥</div>
          <div className="text-xs font-bold text-[#202124]">Student Vacancy</div>
          <div className="text-[11px] text-[#5F6368]">Need flatmate/roommate</div>
        </button>

        <Link
          href="/pg/new"
          className="p-4 rounded-3xl border border-[#DADCE0] bg-white hover:border-[#1A73E8] hover:shadow-xs text-left transition-all group block"
        >
          <div className="text-2xl mb-2 group-hover:scale-105 transition-transform">🏢</div>
          <div className="text-xs font-bold text-[#202124] group-hover:text-[#1A73E8]">Add Your PG</div>
          <div className="text-[11px] text-[#5F6368]">For PG owners</div>
        </Link>

        <Link
          href="/flat/new"
          className="p-4 rounded-3xl border border-[#DADCE0] bg-white hover:border-[#1A73E8] hover:shadow-xs text-left transition-all group block"
        >
          <div className="text-2xl mb-2 group-hover:scale-105 transition-transform">🏡</div>
          <div className="text-xs font-bold text-[#202124] group-hover:text-[#1A73E8]">Add Your Flat</div>
          <div className="text-[11px] text-[#5F6368]">For Flat owners</div>
        </Link>
      </div>

      {/* Student Roommate Vacancy Form */}
      {selectedType === 'SEEKER' && <ListingForm />}
    </div>
  );
}
