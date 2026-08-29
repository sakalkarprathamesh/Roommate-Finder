'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ListingForm from '@/components/listings/ListingForm';

export default function EditListingPage() {
  const params = useParams();
  const listingId = params?.id as string;
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listingId) {
      fetch(`/api/listings/${listingId}`)
        .then((res) => res.json())
        .then((data) => {
          setListing(data.listing);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading listing details for editing...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <Link href="/dashboard" className="inline-block px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href={`/listings/${listingId}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listing Details
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Edit Listing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Update accommodation details, rent, or availability status.
        </p>
      </div>

      <ListingForm initialData={listing} isEdit={true} />
    </div>
  );
}
