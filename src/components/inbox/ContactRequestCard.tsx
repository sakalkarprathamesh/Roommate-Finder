'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';

interface ContactRequestCardProps {
  id: string;
  type: 'received' | 'sent' | 'connected';
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  listingRent: number;
  status: string;
  message?: string | null;
  createdAt?: string;
  connectedAt?: string;
  role?: string;
  sender?: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      division?: string | null;
      bio?: string | null;
      emailVerified: boolean;
      email?: string;
      phone?: string;
    };
  };
  receiver?: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      division?: string | null;
      emailVerified: boolean;
      email?: string;
      phone?: string;
    };
  };
  contact?: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      division?: string | null;
      emailVerified: boolean;
      email?: string;
      phone?: string;
    };
  };
  onActionComplete?: () => void;
}

export default function ContactRequestCard({
  id,
  type,
  listingId,
  listingTitle,
  listingLocation,
  listingRent,
  status,
  message,
  sender,
  receiver,
  contact,
  onActionComplete,
}: ContactRequestCardProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok && onActionComplete) {
        onActionComplete();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const student = type === 'received' ? sender?.profile : type === 'sent' ? receiver?.profile : contact?.profile;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Top Header: Listing Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-medium">Listing Context:</span>{' '}
          <Link href={`/listings/${listingId}`} className="font-bold text-slate-900 hover:text-brand-700 transition-colors">
            {listingTitle}
          </Link>
        </div>
        <div className="text-slate-500 font-semibold">
          ₹{listingRent.toLocaleString('en-IN')}/mo • {listingLocation}
        </div>
      </div>

      {/* Profile & Content */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden flex-shrink-0">
            {student?.profilePhotoUrl ? (
              <img src={student.profilePhotoUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              student?.name?.charAt(0) || 'U'
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm sm:text-base truncate">{student?.name}</span>
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                Email Verified
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {student?.department} • {student?.year} {student?.division ? `(${student.division})` : ''}
            </p>
            <p className="text-[11px] text-slate-400">{student?.school}</p>

            {message && (
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 italic">
                &ldquo;{message}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Status / Authorized Contact Info */}
        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0">
          {type === 'received' && status === 'PENDING' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('REJECTED')}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
              <button
                onClick={() => handleUpdate('ACCEPTED')}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Accept & Share Contact
              </button>
            </div>
          )}

          {type === 'sent' && (
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                status === 'ACCEPTED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : status === 'REJECTED'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {status === 'ACCEPTED' ? 'Approved' : status === 'REJECTED' ? 'Request Declined' : 'Pending Owner Review'}
            </span>
          )}

          {type === 'connected' && student?.phone && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-2 text-xs w-full sm:w-72">
              <div className="font-bold text-emerald-900 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Authorized Private Contact
              </div>
              <div className="space-y-1">
                <a
                  href={`tel:${student.phone}`}
                  className="flex items-center gap-2 font-bold text-slate-900 hover:text-brand-700 bg-white p-1.5 rounded-lg border border-emerald-100"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{student.phone}</span>
                </a>
                {student.email && (
                  <a
                    href={`mailto:${student.email}`}
                    className="flex items-center gap-2 font-bold text-slate-900 hover:text-brand-700 bg-white p-1.5 rounded-lg border border-emerald-100 truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
