'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building } from 'lucide-react';
import PGListingForm from '@/components/listings/PGListingForm';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NewPGPage() {
  usePageMeta({
    title: 'Add Your PG | Roomie',
    description: 'List your PG accommodation for MIT-ADT University students.',
    noindex: true,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Add Your PG Accommodation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          List your paying guest property to connect with verified student tenants.
        </p>
      </div>

      <PGListingForm />
    </div>
  );
}
