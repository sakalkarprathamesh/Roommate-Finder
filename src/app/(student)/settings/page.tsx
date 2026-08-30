'use client';

import React from 'react';
import {
  Shield,
  Mail,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function SettingsPage() {
  usePageMeta({
    title: 'Account Settings | MIT-ADT Roommate Finder',
    description: 'Manage your account preferences and settings.',
    noindex: true,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Settings & Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Privacy controls, account safety, and official Roomie support.
        </p>
      </div>

      {/* Support Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-brand-900 font-bold text-sm">
          <HelpCircle className="w-5 h-5 text-brand-700" />
          Official Contact & Support
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Need assistance, want to report a safety concern, or verify your MIT-ADT student credentials manually? Reach out to our student support team:
        </p>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Support Email</span>
            <span className="text-xs font-bold text-slate-900">{SUPPORT_EMAIL}</span>
          </div>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>

        <p className="text-[11px] text-slate-400">
          Roomie built by <strong className="text-slate-700">{CREATOR_NAME}</strong> for MIT-ADT University students.
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
          <Shield className="w-5 h-5 text-emerald-600" />
          Privacy & Contact Data Rules
        </div>

        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Your personal Gmail and phone number are never exposed to public crawlers or search engines.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Only students whose contact requests you explicitly approve can view your verified phone number.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Exact house numbers or flat units are strictly omitted from public listings.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
