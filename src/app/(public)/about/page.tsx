import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Shield, Mail, Lock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';
import SEO from '@/components/common/SEO';

export const metadata: Metadata = {
  title: 'About | Roomie',
  description:
    'Learn about Roomie, the student-focused accommodation and flatmate discovery network for MIT-ADT University Pune.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <SEO
        title="About | Roomie"
        description="Learn about Roomie, the student-focused accommodation and flatmate discovery network for MIT-ADT University Pune."
        noindex={false}
      />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] border border-[#DADCE0] text-[#1A73E8] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>About Roomie</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202124] tracking-tight">
          Find your room. Find your people.
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
          Find rooms, flats, PGs and compatible roommates near your college at MIT-ADT University Pune.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#DADCE0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#202124]">Platform Mission</h2>
          <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
            Roomie is designed to help students, PG owners, and flat owners connect for shared rooms, flats, and verified PG accommodations near campus. We eliminate the chaos of unverified WhatsApp groups, high broker fees, and untrusted listings.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#202124]">Student Privacy & Verification</h2>
          <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
            Contact numbers and full profiles are only shared after a mutual connection request is accepted. Your contact data remains protected and is never sold to commercial entities.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#202124]">Contact & Support</h2>
          <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
            Have questions, feedback, or need help? Email our student support desk directly:
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] text-xs font-bold text-[#202124]">
            <Mail className="w-4 h-4 text-[#1A73E8]" />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline text-[#1A73E8]">
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
