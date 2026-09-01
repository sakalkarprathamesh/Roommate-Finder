'use client';

import React from 'react';
import ManageListingView from '@/components/listings/ManageListingView';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ManagePGPage() {
  usePageMeta({
    title: 'Manage PG Accommodations | Roomie',
    description: 'View and manage your PG accommodations and verification status.',
    noindex: true,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <ManageListingView type="PG" />
    </div>
  );
}
