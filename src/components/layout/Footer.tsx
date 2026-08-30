import React from 'react';
import Link from 'next/link';
import { Building2, Shield, Mail } from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white font-bold flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-white font-black text-base sm:text-lg tracking-tight">
                Roomie <span className="text-brand-400 text-xs font-normal">MIT-ADT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              &ldquo;Find the right roommate, flatmate, room, or accommodation vacancy with fellow MIT-ADT students.&rdquo;
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Dedicated student accommodation discovery platform for MIT-ADT University Pune.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find" className="hover:text-white transition-colors">
                  Find Accommodations
                </Link>
              </li>
              <li>
                <Link href="/listings/new" className="hover:text-white transition-colors">
                  Post a Listing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Privacy */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Help & Safety</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Support
                </a>
              </li>
              <li className="text-[11px] text-slate-500">Official: {SUPPORT_EMAIL}</li>
              <li className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Protected Private Contact Sharing
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Roomie. Built by {CREATOR_NAME}.</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-300">
              Support: {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
