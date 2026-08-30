import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Shield, Mail, Lock, ArrowLeft } from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';
import SEO from '@/components/common/SEO';

export const metadata: Metadata = {
  title: 'About | MIT-ADT Roommate Finder',
  description:
    'Learn about Roomie, the verified student accommodation and roommate discovery network for MIT-ADT University Pune.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <SEO
        title="About | MIT-ADT Roommate Finder"
        description="Learn about Roomie, the verified student accommodation and roommate discovery network for MIT-ADT University Pune."
        noindex={false}
      />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-brand-700" />
          About Roomie
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Simplifying Student Accommodation at MIT-ADT
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          &ldquo;Find the right roommate, flatmate, room, or accommodation vacancy with fellow MIT-ADT students.&rdquo;
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Platform Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Roomie is designed to help students of MIT-ADT University (Pune) connect for shared rooms, flats, and PG accommodations near campus. We eliminate the chaos of unverified WhatsApp groups, brokers, and untrusted listings.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Privacy & Verification</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Contact numbers and full profiles are only shared after a mutual connection request is accepted by both students. Your contact data remains protected and is never sold to commercial entities.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Contact & Support</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Have questions, feedback, or need help? Email our student support desk directly:
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
            <Mail className="w-4 h-4 text-brand-700" />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline text-brand-900">
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
