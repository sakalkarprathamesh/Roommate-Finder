'use client';

import React from 'react';
import ManageListingView from '@/components/listings/ManageListingView';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ManageFlatPage() {
  usePageMeta({
    title: 'Manage Flat Listings | Roomie',
    description: 'View and manage your Flat listings and verification status.',
    noindex: true,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <ManageListingView type="Flat" />
    </div>
  );
}
