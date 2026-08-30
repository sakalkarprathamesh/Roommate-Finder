import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import ListingForm from '@/components/listings/ListingForm';
import SEO from '@/components/common/SEO';

export const metadata: Metadata = {
  title: 'Post a Listing | MIT-ADT Roommate Finder',
  description:
    'List an available room, shared flat vacancy, or post your roommate requirement for MIT-ADT University students.',
};

export default function NewListingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <SEO
        title="Post a Listing | MIT-ADT Roommate Finder"
        description="List an available room, shared flat vacancy, or post your roommate requirement for MIT-ADT University students."
        noindex={false}
      />
      <Link
        href="/find"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Post an Accommodation Listing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Create a vacancy, room offering, or request to find roommates across MIT-ADT Pune.
        </p>
      </div>

      <ListingForm />
    </div>
  );
}
