'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { SUPPORT_EMAIL } from '@/lib/constants';

// Auto-expiry: Stops appearing to all users after 2 months (October 30, 2026)
const EXPIRY_TIMESTAMP = new Date('2026-10-30T23:59:59Z').getTime();
const STORAGE_KEY = 'roomie_welcome_note_seen_v1';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Auto-expiry check (2 months limit from August 30, 2026)
    if (Date.now() > EXPIRY_TIMESTAMP) {
      return;
    }

    // 2. Check localStorage to ensure it only shows once per user
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        // Smooth entrance after initial page mount
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // LocalStorage access fallback
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-5 relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close welcome popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Personal Note */}
        <div className="space-y-3 pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            Welcome to Roomie • MIT-ADT
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Find Your Roommate & Flat
          </h2>

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-1.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              A Small Note
            </span>
            <p>
              &ldquo;Hii everyone! This is <strong className="text-slate-950 font-bold">Prathamesh Sakalkar</strong>, a 2nd year CSE student. I built Roomie to make it easier for MIT-ADT students to find roommates and accommodation near campus — no more relying on random WhatsApp group chats or word of mouth.&rdquo;
            </p>
          </div>
        </div>

        {/* Live Launch & Feedback Note */}
        <div className="bg-amber-50/80 rounded-2xl border border-amber-200/80 p-4 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Early Live Release</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            The site has just gone live and is currently collecting real data, so you may encounter occasional rough edges. Your feedback and suggestions are warmly welcome anytime at{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-bold underline hover:text-amber-950"
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
            className="w-full sm:w-auto px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Got it, let&apos;s explore!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
