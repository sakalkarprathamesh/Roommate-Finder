'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  IndianRupee,
  Calendar,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { LISTING_TYPES, formatMoveInDate } from '@/lib/constants';

interface ListingCardProps {
  id: string;
  title: string;
  listingType: string;
  accommodationType: string;
  roomType: string;
  location: string;
  rent: number;
  deposit?: number;
  currentOccupants?: number;
  vacancies?: number;
  totalCapacity?: number;
  moveInDate: string;
  owner: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      emailVerified: boolean;
    };
  };
  isVisualOnly?: boolean; // When true, purely visual/non-clickable sample card
}

export default function ListingCard({
  id,
  title,
  listingType,
  accommodationType,
  roomType,
  location,
  rent,
  currentOccupants = 0,
  vacancies = 1,
  moveInDate,
  owner,
  isVisualOnly = false,
}: ListingCardProps) {
  const p = owner?.profile;

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'HAVE_VACANCY':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'NEED_ROOMMATE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'NEED_ACCOMMODATION':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'HAVE_ROOM':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const typeLabel = (LISTING_TYPES as Record<string, string>)[listingType] || listingType;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between overflow-hidden group ${
      isVisualOnly ? 'opacity-95' : 'hover:shadow-md transition-all'
    }`}>
      <div className="p-5 pb-4 space-y-3.5">
        {/* Top Tag & Price */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-tight uppercase ${getBadgeStyle(listingType)}`}>
            {listingType === 'HAVE_VACANCY'
              ? `${vacancies} SPOT${vacancies > 1 ? 'S' : ''} AVAILABLE`
              : typeLabel}
          </span>
          <div className="text-right">
            <span className="text-base font-black text-slate-900">₹{rent.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 font-medium block -mt-1">/month</span>
          </div>
        </div>

        {/* Listing Title */}
        {isVisualOnly ? (
          <span className="block font-bold text-slate-900 text-sm sm:text-base line-clamp-2 cursor-default">
            {title}
          </span>
        ) : (
          <Link href={`/listings/${id}`} className="block font-bold text-slate-900 text-sm sm:text-base hover:text-brand-700 transition-colors line-clamp-2">
            {title}
          </Link>
        )}

        {/* Student Owner Info & Verification */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs overflow-hidden flex-shrink-0">
            {p?.profilePhotoUrl ? (
              <img src={p.profilePhotoUrl} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              p?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-900 truncate">{p?.name}</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5" title="Verified MIT-ADT Student Account">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {p?.department} • {p?.year}
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 truncate">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{accommodationType} • {roomType}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 truncate">
            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 truncate">
            <Users className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{currentOccupants} member{currentOccupants !== 1 ? 's' : ''} • {vacancies} vacancy</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{formatMoveInDate(moveInDate)}</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">{p?.school}</span>
        {isVisualOnly ? (
          <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs select-none">
            Sample Preview
          </span>
        ) : (
          <Link
            href={`/listings/${id}`}
            className="text-xs font-bold text-brand-900 hover:text-brand-700 px-3 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors flex items-center gap-1"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
