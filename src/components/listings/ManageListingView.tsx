'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Home,
  MapPin,
  IndianRupee,
  Edit,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import PGListingForm from './PGListingForm';
import FlatListingForm from './FlatListingForm';

interface ManageListingViewProps {
  type: 'PG' | 'Flat';
}

export default function ManageListingView({ type }: ManageListingViewProps) {
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<any | null>(null);

  const fetchMyListings = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push(`/login?redirect=/manage/${type.toLowerCase()}`);
        return;
      }
      const meData = await meRes.json();
      setCurrentUser(meData.user);

      const res = await fetch('/api/listings?status=ALL');
      if (res.ok) {
        const data = await res.json();
        const userId = meData.user?.id;
        if (userId) {
          const myListings = (data.listings || []).filter(
            (l: any) => l.ownerId === userId && l.accommodationType === type
          );
          setListings(myListings);
        }
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [type]);

  if (loading) {
    return (
      <div className="py-16 text-center text-[#5F6368] text-xs font-semibold">
        Loading your {type} listings...
      </div>
    );
  }

  // Strict Backend & Frontend Role Permissions Guard
  const userRole = currentUser?.role;
  const isAuthorized =
    userRole === 'admin' ||
    (type === 'PG' && userRole === 'PG_OWNER') ||
    (type === 'Flat' && userRole === 'FLAT_OWNER');

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#FCE8E6] text-[#C5221F] mx-auto flex items-center justify-center text-3xl">
          <Lock className="w-8 h-8 text-[#C5221F]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#202124] tracking-tight">
            Role Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
            {type === 'PG'
              ? 'This section is reserved for PG Owners. You are currently logged in with a different role.'
              : 'This section is reserved for Flat Owners. You are currently logged in with a different role.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all"
          >
            Go to Your Dashboard
          </Link>
          {userRole === 'PG_OWNER' && (
            <Link
              href="/manage/pg"
              className="px-6 py-3 bg-white border border-[#DADCE0] text-[#202124] font-bold text-xs rounded-2xl hover:bg-slate-50 transition-colors"
            >
              Go to Manage PG
            </Link>
          )}
          {userRole === 'FLAT_OWNER' && (
            <Link
              href="/manage/flat"
              className="px-6 py-3 bg-white border border-[#DADCE0] text-[#202124] font-bold text-xs rounded-2xl hover:bg-slate-50 transition-colors"
            >
              Go to Manage Flat
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (editingListing) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            setEditingListing(null);
            fetchMyListings();
          }}
          className="text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] flex items-center gap-1.5 cursor-pointer"
        >
          ← Cancel Editing
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#202124] tracking-tight">
            Edit & Resubmit {type === 'PG' ? 'PG Accommodation' : 'Flat Listing'}
          </h1>
          <p className="text-xs text-[#5F6368]">
            Make the requested corrections and resubmit for admin verification.
          </p>
        </div>

        {type === 'PG' ? (
          <PGListingForm initialData={editingListing} isEdit={true} />
        ) : (
          <FlatListingForm initialData={editingListing} isEdit={true} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
            Manage Your {type === 'PG' ? 'PG Accommodations' : 'Flat Listings'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            View verification status, update amenities, and manage student tenant inquiries.
          </p>
        </div>

        <Link
          href={type === 'PG' ? '/pg/new' : '/flat/new'}
          className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New {type}</span>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F0FE] text-[#1A73E8] mx-auto flex items-center justify-center text-3xl">
            {type === 'PG' ? '🏢' : '🏡'}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-[#202124]">
              No {type} listings found
            </h2>
            <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
              You haven&apos;t posted any {type} accommodations yet. Post one now to connect with MIT-ADT students.
            </p>
          </div>
          <Link
            href={type === 'PG' ? '/pg/new' : '/flat/new'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all"
          >
            <span>Add Your {type}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => {
            const status = (listing.status || 'ACTIVE').toUpperCase();
            const isPending = status === 'PENDING_VERIFICATION' || status === 'PENDING';
            const isVerified = status === 'VERIFIED' || status === 'ACTIVE';
            const isRejected = status === 'REJECTED';
            const photos = listing.photos ? JSON.parse(listing.photos) : [];

            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl border border-[#DADCE0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row"
              >
                {/* Photo Preview */}
                <div className="md:w-72 h-48 md:h-auto bg-slate-100 relative flex-shrink-0">
                  {photos.length > 0 ? (
                    <img
                      src={photos[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100">
                      {type === 'PG' ? '🏢' : '🏡'}
                    </div>
                  )}

                  {/* Verification Status Badge on Photo */}
                  <div className="absolute top-3 left-3">
                    {isPending && (
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                        <span>🟡</span>
                        <span>Verification Pending</span>
                      </span>
                    )}
                    {isVerified && (
                      <span className="px-3 py-1 rounded-full bg-[#34A853] text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                        <span>🟢</span>
                        <span>Verified & Public</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-full bg-[#EA4335] text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                        <span>🔴</span>
                        <span>Verification Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-[#202124]">
                        {listing.title}
                      </h2>
                      <div className="text-base font-black text-[#1A73E8]">
                        ₹{listing.rent?.toLocaleString('en-IN')}/mo
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5F6368]">
                      <span className="flex items-center gap-1 font-semibold text-[#202124]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {listing.address || listing.location}
                      </span>
                      <span>•</span>
                      <span>{listing.location}</span>
                      {listing.pgType && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-[#202124]">{listing.pgType} PG</span>
                        </>
                      )}
                      {listing.bedrooms && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-[#202124]">{listing.bedrooms} BHK</span>
                        </>
                      )}
                    </div>

                    {/* Status Notice Callout Box */}
                    {isPending && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Waiting for Admin Review</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          Your listing has been submitted and is waiting for verification. It will become publicly visible once approved.
                        </p>
                      </div>
                    )}

                    {isVerified && (
                      <div className="p-3.5 rounded-2xl bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
                          <span>Publicly Visible to MIT-ADT Students</span>
                        </div>
                        <p className="text-[11px] text-[#137333]/90 leading-relaxed">
                          Your accommodation is live in search results and receiving connection requests.
                        </p>
                      </div>
                    )}

                    {isRejected && (
                      <div className="p-3.5 rounded-2xl bg-[#FCE8E6] border border-[#FAD2CF] text-[#C5221F] text-xs space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-[#C5221F]" />
                          <span>Action Required — Verification Rejected</span>
                        </div>
                        <p className="text-[11px] text-[#C5221F] leading-relaxed font-semibold">
                          Reason for rejection: {listing.rejectionReason || 'Please review and improve listing photos or details.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingListing(listing)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#202124] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isRejected ? 'Edit & Resubmit' : 'Edit Listing'}</span>
                    </button>

                    {isVerified && (
                      <Link
                        href={`/listings/${listing.id}`}
                        className="px-4 py-2 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Live Listing</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
