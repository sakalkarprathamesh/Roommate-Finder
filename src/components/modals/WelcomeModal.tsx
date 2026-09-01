'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { SUPPORT_EMAIL, CREATOR_NAME } from '@/lib/constants';

// Auto-expiry: Stops appearing to all users after 2 months (October 30, 2026)
const EXPIRY_TIMESTAMP = new Date('2026-10-30T23:59:59Z').getTime();
const SESSION_KEY = 'roomie_welcome_note_session_active';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (Date.now() > EXPIRY_TIMESTAMP) {
      return;
    }

    try {
      localStorage.removeItem('roomie_welcome_note_seen_v1');
      localStorage.removeItem('roomie_founder_welcome_seen_v1');
      localStorage.removeItem('roomie_welcome_dismissed_v1');
    } catch {}

    try {
      if (typeof window !== 'undefined' && window.performance) {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          const navTiming = navEntries[0] as PerformanceNavigationTiming;
          if (navTiming.type === 'reload') {
            return;
          }
        } else if ((performance as any).navigation?.type === 1) {
          return;
        }
      }

      const seenInSession = sessionStorage.getItem(SESSION_KEY);
      if (seenInSession) {
        return;
      }

      sessionStorage.setItem(SESSION_KEY, 'true');

      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#202124] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-5 relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-white hover:bg-[#F1F3F4] dark:hover:bg-[#303134] transition-colors cursor-pointer"
          aria-label="Close welcome popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Personal Note */}
        <div className="space-y-3 pr-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] dark:bg-[#1E3A5F] border border-[#DADCE0] dark:border-[#1A73E8]/30 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Welcome to Roomie</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#202124] dark:text-[#E8EAED] tracking-tight">
            Find Your Roommate & Flat
          </h2>

          <div className="bg-[#F8F9FA] dark:bg-[#303134] rounded-2xl p-4 sm:p-5 border border-[#DADCE0] dark:border-[#3C4043] space-y-1.5 text-[#202124] dark:text-[#E8EAED] text-xs sm:text-sm leading-relaxed">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-[#BDC1C6] block">
              A Personal Note
            </span>
            <p className="font-medium text-[#3C4043] dark:text-[#E8EAED]">
              &ldquo;Hii everyone! This is <strong className="text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{CREATOR_NAME}</strong>, a 2nd year CSE student. I built Roomie to make it easier for MIT-ADT students to find verified flats, PGs, and compatible roommates near campus.&rdquo;
            </p>
          </div>
        </div>

        {/* Live Launch & Feedback Note */}
        <div className="bg-[#FEF7E0] dark:bg-[#3B3116] rounded-2xl border border-[#FEEFC3] dark:border-[#5B481A] p-4 text-xs text-[#7A4B04] dark:text-[#FDD663] space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#7A4B04] dark:text-[#FDD663]">
            <HelpCircle className="w-4 h-4 text-[#FBBC04] flex-shrink-0" />
            <span>Community Platform</span>
          </div>
          <p className="text-[11px] text-[#7A4B04] dark:text-[#FDD663] leading-relaxed">
            Your feedback and suggestions are warmly welcome anytime at{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-bold underline hover:text-[#202124] dark:hover:text-white"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center justify-end">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#202124] font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Got it, let&apos;s explore!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
