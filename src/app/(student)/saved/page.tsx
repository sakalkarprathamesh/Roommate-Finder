'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Search,
  ArrowLeft,
  MapPin,
  Sparkles,
  Building2,
  Trash2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function SavedListingsPage() {
  usePageMeta({
    title: 'Saved Listings | Roomie',
    description: 'View and manage your saved student accommodation listings and flatmate vacancies.',
    noindex: true,
  });

  const router = useRouter();
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSaved() {
      try {
        const listRes = await fetch('/api/listings?status=ALL');
        if (listRes.ok) {
          const lData = await listRes.json();
          const allListings = lData.listings || [];

          // Retrieve saved IDs from localStorage
          const savedIds = JSON.parse(localStorage.getItem('roomie_saved_listing_ids') || '[]');
          if (Array.isArray(savedIds) && savedIds.length > 0) {
            const matched = allListings.filter((l: any) => savedIds.includes(l.id));
            setSavedListings(matched);
          } else {
            setSavedListings([]);
          }
        }
      } catch {
        setSavedListings([]);
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
  }, []);

  const handleRemoveSaved = (id: string) => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('roomie_saved_listing_ids') || '[]');
      const updated = savedIds.filter((item: string) => item !== id);
      localStorage.setItem('roomie_saved_listing_ids', JSON.stringify(updated));
      setSavedListings((prev) => prev.filter((l) => l.id !== id));
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link & Header */}
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight">
                Saved Listings
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#BDC1C6]">
              Accommodations and roommate vacancies you bookmarked to review.
            </p>
          </div>

          <Link
            href="/find"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Explore More</span>
          </Link>
        </div>
      </div>

      {/* Main Content View */}
      {loading ? (
        <div className="py-20 text-center text-xs font-bold text-[#5F6368] dark:text-[#BDC1C6]">
          Loading your saved listings...
        </div>
      ) : savedListings.length === 0 ? (
        /* 🌟 EXACT EMPTY STATE: "No shared listings" */
        <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-12 sm:p-16 text-center space-y-5 shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center text-3xl mx-auto shadow-xs">
            🏠
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight">
              No shared listings
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#BDC1C6] max-w-md mx-auto leading-relaxed">
              You haven&apos;t saved or shared any student accommodation listings yet. Explore verified PGs, shared flats, and room vacancies near campus.
            </p>
          </div>

          <div className="pt-3">
            <Link
              href="/find"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore Accommodations</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Grid of Saved Listings */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.map((l) => (
            <div
              key={l.id}
              className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-5 shadow-2xs hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] text-[10px] font-bold">
                    {l.accommodationType || 'Accommodation'}
                  </span>
                  <span className="text-xs font-black text-[#137333] dark:text-[#81C995]">
                    ₹{l.rent?.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#202124] dark:text-[#FFFFFF] line-clamp-1">
                  {l.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#5F6368] dark:text-[#BDC1C6]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#BDC1C6] flex-shrink-0" />
                  <span className="truncate">{l.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3C4043] flex items-center justify-between gap-2">
                <Link
                  href={`/listings/${l.id}`}
                  className="px-4 py-2 bg-white dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] text-[#202124] dark:text-[#FFFFFF] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleRemoveSaved(l.id)}
                  className="p-2 text-[#EA4335] dark:text-[#F28B82] hover:bg-rose-50 dark:hover:bg-[#3C1E1E] rounded-xl transition-colors cursor-pointer"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
