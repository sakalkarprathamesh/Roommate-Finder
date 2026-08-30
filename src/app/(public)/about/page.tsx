import React from 'react';
import Link from 'next/link';
import { Building2, Shield, Mail, Lock, ArrowLeft } from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
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
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Our Core Mission</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students at MIT-ADT University frequently rely on chaotic WhatsApp groups, word-of-mouth, or unvetted listings to find flat vacancies or roommates. <strong>Roomie</strong> unifies accommodation discovery into a trusted platform with verified academic credentials and protected contact sharing.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Strict Privacy Principles</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Personal Gmail addresses, phone numbers, and student IDs remain hidden from public search.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Private contacts are only unlocked when a student and listing owner mutually accept a contact request.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
          <div className="font-bold text-slate-900">Creator & Attribution</div>
          <p className="text-slate-600">
            Built by <strong className="text-slate-800">{CREATOR_NAME}</strong>
          </p>
          <div className="font-bold text-slate-900 pt-2">Official Support</div>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-1.5 text-brand-700 font-bold hover:underline"
          >
            <Mail className="w-3.5 h-3.5" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
