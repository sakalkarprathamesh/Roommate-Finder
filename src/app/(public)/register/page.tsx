'use client';

import React from 'react';
import RegisterWizard from '@/components/auth/RegisterWizard';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function RegisterPage() {
  usePageMeta({
    title: 'Register & Onboarding | Roomie',
    description: 'Create your Roomie account, choose your role, and connect with verified roommates and accommodations.',
    noindex: false,
  });

  return (
    <div className="min-h-[85vh] bg-[#F8F9FA] py-6 sm:py-12">
      <RegisterWizard />
    </div>
  );
}
