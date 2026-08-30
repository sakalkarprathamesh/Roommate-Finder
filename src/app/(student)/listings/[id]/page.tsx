'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building,
  MapPin,
  IndianRupee,
  Users,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Send,
  Clock,
  Check,
  AlertTriangle,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { LISTING_TYPES, REPORT_REASONS } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id as string;

  const [listing, setListing] = useState<any>(null);

  usePageMeta({
    title: listing?.title
      ? `${listing.title} | MIT-ADT Roommate Finder`
      : 'Listing Details | MIT-ADT Roommate Finder',
    description:
      listing?.description?.slice(0, 160) ||
      'View student accommodation vacancy details on MIT-ADT Roommate Finder.',
    noindex: false,
  });
  const [loading, setLoading] = useState(true);

  // Request Contact Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
  const [reportDescription, setReportDescription] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${listingId}`);
      if (res.ok) {
        const data = await res.json();
        setListing(data.listing);
      } else {
        setListing(null);
      }
    } catch {
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) fetchListing();
  }, [listingId]);

  const handleSendContactRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSending(true);
    try {
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          message: requestMessage.trim() || undefined,
        }),
      });

      if (res.ok) {
        setRequestSuccess('Contact request sent! The owner will be notified.');
        setTimeout(() => {
          setShowRequestModal(false);
          fetchListing();
        }, 1200);
      }
    } catch {
      // handle error
    } finally {
      setRequestSending(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSending(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          reportedUserId: listing?.owner?.id,
          reason: reportReason,
          description: reportDescription.trim() || undefined,
        }),
      });

      if (res.ok) {
        setReportSuccess('Thanks. Your report has been submitted.');
        setTimeout(() => {
          setShowReportModal(false);
          setReportSuccess('');
        }, 1500);
      }
    } catch {
      // handle error
    } finally {
      setReportSending(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard');
      }
    } catch {
      // handle error
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading listing details...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-xs text-slate-500">This listing may have been filled or removed.</p>
        <Link href="/find" className="inline-block px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl">
          Back to Listings
        </Link>
      </div>
    );
  }

  const p = listing.owner?.profile;
  const isOwner = listing.isOwner;
  const isAuthorized = listing.isAuthorizedContact;
  const contactStatus = listing.contactRequestStatus;
  const typeLabel = (LISTING_TYPES as Record<string, string>)[listing.listingType] || listing.listingType;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/find"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings Search
      </Link>

      {/* Main Listing Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold uppercase tracking-wider">
                {typeLabel}
              </span>
              {listing.status === 'FILLED' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                  Filled
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {listing.title}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 inline" />
              <span>{listing.location}</span>
              <span>•</span>
              <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-right flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{listing.rent.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 block font-medium">/ month</span>
            {listing.deposit > 0 && (
              <span className="text-[11px] text-slate-500 font-semibold block mt-1">
                Deposit: ₹{listing.deposit.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Accommodation Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Accommodation</span>
            <span className="font-bold text-slate-900">{listing.accommodationType}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Room Type</span>
            <span className="font-bold text-slate-900">{listing.roomType} Room</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Occupants / Vacancies</span>
            <span className="font-bold text-slate-900">
              {listing.currentOccupants} occupants • {listing.vacancies} vacancy
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Move-in Date</span>
            <span className="font-bold text-slate-900">{listing.moveInDate}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Listing Description
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Owner Public Profile Card */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Posted By Student
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-base overflow-hidden flex-shrink-0">
                {p?.profilePhotoUrl ? (
                  <img src={p.profilePhotoUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  p?.name?.charAt(0) || 'U'
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{p?.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Email Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {p?.department} • {p?.year}
                </p>
                <p className="text-[11px] text-slate-400">{p?.school}</p>
              </div>
            </div>

            {/* Revealed Private Contact when Accepted */}
            {isAuthorized && p?.phone && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5 text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Contact Details
                </div>
                <div className="space-y-1">
                  <a
                    href={`tel:${p.phone}`}
                    className="flex items-center gap-2 font-bold text-slate-900 hover:text-brand-700 bg-white p-1 rounded-md"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{p.phone}</span>
                  </a>
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="flex items-center gap-2 font-bold text-slate-900 hover:text-brand-700 bg-white p-1 rounded-md"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{p.email}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            🔒 Private contact info is shared only upon mutual approval.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isOwner ? (
              <>
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  Edit Listing
                </Link>
                <button
                  onClick={handleDeleteListing}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            ) : isAuthorized ? (
              <span className="px-4 py-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                Connected! Contact Unlocked Above
              </span>
            ) : contactStatus === 'PENDING' ? (
              <span className="px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Contact Request Pending
              </span>
            ) : (
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Request Contact
              </button>
            )}

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Report Listing"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Request Contact Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Request Contact Details
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">{requestSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendContactRequest} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send a contact request to <strong className="text-slate-900">{p?.name}</strong>. Your academic profile will be shared, and once approved, verified phone and email details will be unlocked.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Introduction Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Hi! I am a 2nd year student interested in your flat vacancy. Can we schedule a visit?"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestSending}
                    className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {requestSending ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Report Listing
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">{reportSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reason *
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Details (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide details for MIT-ADT student housing moderators..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                  >
                    {reportSending ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
