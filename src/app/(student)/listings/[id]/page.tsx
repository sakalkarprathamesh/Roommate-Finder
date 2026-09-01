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
  Sparkles,
  ShieldCheck,
  Home,
  CheckCheck,
} from 'lucide-react';
import { LISTING_TYPES, REPORT_REASONS, formatMoveInDate } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id as string;

  const [listing, setListing] = useState<any>(null);

  usePageMeta({
    title: listing?.title
      ? `${listing.title} | Roomie`
      : 'Listing Details | Roomie',
    description:
      listing?.description?.slice(0, 160) ||
      'View student accommodation vacancy details on Roomie.',
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#5F6368] text-xs font-semibold">
        Loading accommodation details...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-[#202124]">Listing Not Found</h2>
        <p className="text-xs text-[#5F6368]">This listing may have been filled or removed.</p>
        <Link href="/find" className="inline-block px-5 py-2.5 bg-[#1A73E8] text-white font-bold text-xs rounded-2xl shadow-xs">
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
  const photos = listing.photos ? JSON.parse(listing.photos) : [];
  const amenities = listing.amenities ? JSON.parse(listing.amenities) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/find"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search</span>
      </Link>

      {/* Photo Gallery (if photos uploaded) */}
      {photos.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#DADCE0] overflow-hidden p-3 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 aspect-video rounded-2xl overflow-hidden bg-slate-100">
              <img src={photos[0]} alt={listing.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
              {photos.slice(1, 3).map((imgUrl: string, idx: number) => (
                <div key={idx} className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img src={imgUrl} alt={`${listing.title} photo ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {photos.length === 1 && (
                <div className="aspect-video rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-4xl">
                  {listing.accommodationType === 'PG' ? '🏢' : '🏡'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-[#DADCE0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#E8F0FE] border border-[#DADCE0] text-[#1A73E8] text-xs font-bold uppercase tracking-wider">
                {listing.accommodationType === 'PG' ? '🏢 Verified PG' : listing.accommodationType === 'Flat' ? '🏡 Residential Flat' : typeLabel}
              </span>
              {listing.pgType && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#202124] text-xs font-bold">
                  {listing.pgType} PG
                </span>
              )}
              {listing.bedrooms && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#202124] text-xs font-bold">
                  {listing.bedrooms} BHK
                </span>
              )}
              {listing.status === 'FILLED' && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#202124] text-xs font-bold">
                  Filled
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#202124] leading-tight">
              {listing.title}
            </h1>
            <p className="text-xs text-[#5F6368] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#EA4335] inline" />
              <span>{listing.address || listing.location}</span>
              <span>•</span>
              <span>Move-in: {formatMoveInDate(listing.moveInDate || listing.availableFrom)}</span>
              <span>•</span>
              <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="bg-[#F8F9FA] p-4 sm:p-5 rounded-3xl border border-[#DADCE0] text-right flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-black text-[#1A73E8]">
              ₹{listing.rent.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#5F6368] block font-medium">/ month</span>
            {listing.deposit > 0 && (
              <span className="text-[11px] text-[#5F6368] font-semibold block mt-1">
                Deposit: ₹{listing.deposit.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Occupancy Pricing Grid for PG */}
        {(listing.singleRent || listing.doubleRent || listing.tripleRent) && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Occupancy & Pricing Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Single Occupancy</span>
                <span className="text-base font-black text-[#202124]">
                  {listing.singleRent ? `₹${listing.singleRent.toLocaleString('en-IN')}/mo` : 'N/A'}
                </span>
              </div>
              <div className="p-3.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Double Sharing</span>
                <span className="text-base font-black text-[#202124]">
                  {listing.doubleRent ? `₹${listing.doubleRent.toLocaleString('en-IN')}/mo` : 'N/A'}
                </span>
              </div>
              <div className="p-3.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Triple Sharing</span>
                <span className="text-base font-black text-[#202124]">
                  {listing.tripleRent ? `₹${listing.tripleRent.toLocaleString('en-IN')}/mo` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Flat Specifications */}
        {(listing.bedrooms || listing.bathrooms || listing.furnishing) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-[#DADCE0] text-xs text-[#202124]">
            <div>
              <span className="text-[11px] text-[#5F6368] font-medium block">Configuration</span>
              <span className="font-bold text-[#202124]">{listing.bedrooms} BHK</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5F6368] font-medium block">Bathrooms</span>
              <span className="font-bold text-[#202124]">{listing.bathrooms} Bath</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5F6368] font-medium block">Furnishing</span>
              <span className="font-bold text-[#202124]">{listing.furnishing || 'Standard'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5F6368] font-medium block">Preferred Tenants</span>
              <span className="font-bold text-[#202124]">{listing.preferredTenant || 'Students'}</span>
            </div>
          </div>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Amenities & Facilities
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {amenities.map((item: string) => (
                <span key={item} className="px-3 py-1 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl text-xs font-semibold text-[#202124] capitalize">
                  ✓ {item.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
            Overview & Description
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Owner Public Profile Card */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
            Host / Owner Profile
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl border border-[#DADCE0]">
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
                  <span className="font-bold text-[#202124] text-sm">{p?.name}</span>
                  <span className="px-2 py-0.5 bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-[10px] font-bold rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#34A853]" />
                    Verified Host
                  </span>
                </div>
                <p className="text-xs text-[#5F6368] mt-0.5">
                  {p?.department ? `${p.department} • ` : ''}{p?.year ? `${p.year} • ` : ''}{p?.school || 'MIT-ADT University'}
                </p>
              </div>
            </div>

            {/* Revealed Private Contact when Accepted */}
            {isAuthorized && p?.phone && (
              <div className="bg-[#E6F4EA] border border-[#CEEAD6] p-3 rounded-2xl space-y-1.5 text-xs text-[#137333]">
                <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#137333]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                  Verified Contact Details
                </div>
                <div className="space-y-1">
                  <a
                    href={`tel:${p.phone}`}
                    className="flex items-center gap-2 font-bold text-[#202124] hover:text-[#1A73E8] bg-white p-1.5 rounded-xl border border-[#CEEAD6]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#34A853]" />
                    <span>{p.phone}</span>
                  </a>
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="flex items-center gap-2 font-bold text-[#202124] hover:text-[#1A73E8] bg-white p-1.5 rounded-xl border border-[#CEEAD6]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#1A73E8]" />
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
          <div className="text-xs text-[#5F6368]">
            🔒 Private contact info is shared only upon mutual approval.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isOwner ? (
              <>
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="px-4 py-2.5 rounded-2xl border border-[#DADCE0] text-[#202124] hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Listing</span>
                </Link>
                <button
                  onClick={handleDeleteListing}
                  className="px-4 py-2.5 rounded-2xl border border-[#FAD2CF] text-[#C5221F] hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            ) : isAuthorized ? (
              <span className="px-4 py-2.5 bg-[#E6F4EA] text-[#137333] rounded-2xl text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#34A853]" />
                <span>Connected! Contact Unlocked Above</span>
              </span>
            ) : contactStatus === 'PENDING' ? (
              <span className="px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Contact Request Pending</span>
              </span>
            ) : (
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-6 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request Contact</span>
              </button>
            )}

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-[#EA4335] hover:bg-rose-50 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-3xl shadow-2xl border border-[#DADCE0] w-full max-w-md p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-[#202124] text-base">
                Request Contact Details
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#34A853] mx-auto" />
                <p className="text-xs font-bold text-[#202124]">{requestSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendContactRequest} className="space-y-4">
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Send a contact request to <strong className="text-[#202124]">{p?.name}</strong>. Your verified student profile will be shared, and once approved, phone and email will be unlocked.
                </p>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#202124]">
                    Introduction Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Hi! I am a student interested in your accommodation vacancy. Can we connect?"
                    className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#5F6368] hover:bg-slate-100 rounded-2xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestSending}
                    className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{requestSending ? 'Sending...' : 'Send Request'}</span>
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
          <div className="bg-white rounded-3xl shadow-2xl border border-[#DADCE0] w-full max-w-md p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#EA4335] font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Report Listing</span>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#34A853] mx-auto" />
                <p className="text-xs font-bold text-[#202124]">{reportSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#202124]">
                    Reason *
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-2.5 text-[#202124] focus:outline-none"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#202124]">
                    Details (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide details for moderators..."
                    className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-2.5 text-[#202124] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#5F6368] hover:bg-slate-100 rounded-2xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSending}
                    className="px-4 py-2 bg-[#EA4335] hover:bg-rose-700 text-white font-bold text-xs rounded-2xl cursor-pointer"
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
