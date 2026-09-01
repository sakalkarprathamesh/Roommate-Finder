import React from 'react';
import Link from 'next/link';
import { Building2, Shield, Mail, Heart } from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1A1A1C] text-[#5F6368] dark:text-[#BDC1C6] text-xs border-t border-[#DADCE0] dark:border-[#3C4043] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] font-black flex items-center justify-center text-sm shadow-2xs">
                R
              </div>
              <div className="font-black text-base sm:text-lg tracking-tight">
                <span className="text-[#1A73E8] dark:text-[#8AB4F8]">R</span>
                <span className="text-[#EA4335] dark:text-[#F28B82]">o</span>
                <span className="text-[#FBBC04] dark:text-[#FDD663]">o</span>
                <span className="text-[#1A73E8] dark:text-[#8AB4F8]">m</span>
                <span className="text-[#34A853] dark:text-[#81C995]">i</span>
                <span className="text-[#EA4335] dark:text-[#F28B82]">e</span>
                <span className="text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-bold ml-1.5">MIT-ADT</span>
              </div>
            </div>
            <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] max-w-md leading-relaxed">
              &ldquo;Find the right roommate, flatmate, room, or accommodation vacancy with fellow MIT-ADT students.&rdquo;
            </p>
            <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] font-medium">
              Verified student accommodation network for MIT-ADT University Pune.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-[#202124] dark:text-[#E8EAED] text-xs font-bold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find" className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors">
                  Find Accommodations
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors flex items-center gap-1.5">
                  <span>Demo Listings (Examples)</span>
                </Link>
              </li>
              <li>
                <Link href="/pg/new" className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors">
                  Add Your PG
                </Link>
              </li>
              <li>
                <Link href="/flat/new" className="hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors">
                  Add Your Flat
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Privacy */}
          <div className="space-y-2">
            <h4 className="text-[#202124] dark:text-[#E8EAED] text-xs font-bold uppercase tracking-wider">Help & Trust</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-bold flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Support</span>
                </a>
              </li>
              <li className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">{SUPPORT_EMAIL}</li>
              <li className="flex items-center gap-1 text-[#137333] dark:text-[#81C995] font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Protected Contact Sharing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line with high-contrast, prominent Prathamesh Sakalkar branding */}
        <div className="pt-6 border-t border-[#DADCE0] dark:border-[#3C4043] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">
          <p>
            © {new Date().getFullYear()} Roomie. Designed with care by{' '}
            <strong className="text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
              {CREATOR_NAME}
            </strong>.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#202124] dark:hover:text-[#E8EAED]">
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
