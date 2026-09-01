'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Mail,
  HelpCircle,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  Laptop,
  Check,
  Palette,
  Sparkles,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CREATOR_NAME, SUPPORT_EMAIL } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function SettingsPage() {
  usePageMeta({
    title: 'Settings & Appearance | Roomie',
    description: 'Customize your theme appearance (Dark / Light), privacy rules, and account deletion options.',
    noindex: true,
  });

  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/auth/me', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete account. Please try again.');
        setDeleting(false);
        return;
      }

      // Clear local storage items
      try {
        localStorage.removeItem('roomie_saved_listing_ids');
        localStorage.removeItem('roomie_token');
        sessionStorage.clear();
      } catch {}

      // Redirect to homepage with full refresh
      window.location.href = '/?account_deleted=true';
    } catch {
      setDeleteError('A network error occurred. Please check your connection.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#BDC1C6] mt-0.5">
          Theme appearance, privacy controls, and account management.
        </p>
      </div>

      {/* 🌟 1. APPEARANCE & THEME SECTION (DARK / LIGHT / SYSTEM) */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 text-[#202124] dark:text-[#FFFFFF] font-bold text-sm">
          <Palette className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span>Appearance & Theme</span>
        </div>

        <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
          Choose your preferred theme. Your choice will be saved and applied across all pages.
        </p>

        {/* 3 Interactive Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-3xl border text-left transition-all relative flex flex-col justify-between space-y-4 cursor-pointer group ${
              theme === 'light'
                ? 'border-[#1A73E8] bg-[#E8F0FE] dark:border-[#8AB4F8] dark:bg-[#1E3A5F] ring-2 ring-[#1A73E8]/20 shadow-xs'
                : 'border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-white dark:hover:bg-[#303134] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                  theme === 'light'
                    ? 'bg-[#1A73E8] text-white'
                    : 'border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#202124]'
                }`}
              >
                {theme === 'light' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            <div>
              <p className={`font-bold text-xs ${theme === 'light' ? 'text-[#1A73E8] dark:text-[#8AB4F8]' : 'text-[#202124] dark:text-[#FFFFFF]'}`}>
                Light Theme
              </p>
              <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] mt-0.5">
                Clean Google white canvas
              </p>
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-3xl border text-left transition-all relative flex flex-col justify-between space-y-4 cursor-pointer group ${
              theme === 'dark'
                ? 'border-[#1A73E8] bg-[#E8F0FE] dark:border-[#8AB4F8] dark:bg-[#1E3A5F] ring-2 ring-[#1A73E8]/20 shadow-xs'
                : 'border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-white dark:hover:bg-[#303134] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-[#2D2A4A] text-indigo-600 dark:text-[#A8C7FA] flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#1A73E8] text-white'
                    : 'border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#202124]'
                }`}
              >
                {theme === 'dark' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            <div>
              <p className={`font-bold text-xs ${theme === 'dark' ? 'text-[#1A73E8] dark:text-[#8AB4F8]' : 'text-[#202124] dark:text-[#FFFFFF]'}`}>
                Dark Theme
              </p>
              <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] mt-0.5">
                Google dark charcoal palette
              </p>
            </div>
          </button>

          {/* System Default Card */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-3xl border text-left transition-all relative flex flex-col justify-between space-y-4 cursor-pointer group ${
              theme === 'system'
                ? 'border-[#1A73E8] bg-[#E8F0FE] dark:border-[#8AB4F8] dark:bg-[#1E3A5F] ring-2 ring-[#1A73E8]/20 shadow-xs'
                : 'border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-white dark:hover:bg-[#303134] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-slate-200 dark:bg-[#3C4043] text-slate-700 dark:text-[#E8EAED] flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                  theme === 'system'
                    ? 'bg-[#1A73E8] text-white'
                    : 'border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#202124]'
                }`}
              >
                {theme === 'system' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            <div>
              <p className={`font-bold text-xs ${theme === 'system' ? 'text-[#1A73E8] dark:text-[#8AB4F8]' : 'text-[#202124] dark:text-[#FFFFFF]'}`}>
                System Default
              </p>
              <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] mt-0.5">
                Syncs with device ({resolvedTheme})
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 🌟 2. OFFICIAL SUPPORT & CONTACT CARD */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-[#202124] dark:text-[#FFFFFF] font-bold text-sm">
          <HelpCircle className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span>Official Contact & Support</span>
        </div>

        <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
          Need assistance, want to report a safety concern, or verify your MIT-ADT student credentials manually? Reach out to our student support desk:
        </p>

        <div className="bg-[#F8F9FA] dark:bg-[#202124] p-4 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] font-semibold block">Support Email</span>
            <span className="text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">{SUPPORT_EMAIL}</span>
          </div>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="px-4 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </a>
        </div>

        <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">
          Roomie is designed and maintained with care by{' '}
          <strong className="text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
            {CREATOR_NAME}
          </strong>{' '}
          for MIT-ADT University Pune.
        </p>
      </div>

      {/* 🌟 3. PRIVACY GUARANTEE CARD */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-[#137333] dark:text-[#81C995] font-bold text-sm">
          <Shield className="w-5 h-5 text-[#34A853] dark:text-[#81C995]" />
          <span>Privacy & Contact Data Rules</span>
        </div>

        <ul className="space-y-3 text-xs text-[#5F6368] dark:text-[#BDC1C6]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#34A853] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
            <span>Your personal Gmail and phone number are never exposed to public crawlers or search engines.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#34A853] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
            <span>Only students whose contact requests you explicitly approve can view your verified phone number.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#34A853] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
            <span>Exact house numbers or flat units are strictly omitted from public listings.</span>
          </li>
        </ul>
      </div>

      {/* 🌟 4. ACCOUNT DELETION */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#FAD2CF] dark:border-[#5C2828] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-[#C5221F] dark:text-[#F28B82] font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-[#C5221F] dark:text-[#F28B82]" />
          <span>Account Deletion</span>
        </div>

        <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
          Permanently delete your Roomie account, profile information, published listings, and active connection requests. This action is irreversible.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setDeleteError('');
              setConfirmationText('');
              setShowDeleteModal(true);
            }}
            className="px-5 py-2.5 bg-[#C5221F] hover:bg-[#A51D1A] dark:bg-[#D93025] dark:hover:bg-[#C5221F] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete User Account</span>
          </button>
        </div>
      </div>

      {/* 🌟 DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#303134] rounded-3xl border border-[#FAD2CF] dark:border-[#5C2828] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-5 relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3C4043]">
              <div className="flex items-center gap-2.5 text-[#C5221F] dark:text-[#F28B82]">
                <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-[#3C1E1E] text-[#C5221F] dark:text-[#F28B82] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#202124] dark:text-[#FFFFFF]">
                    Delete Roomie Account
                  </h2>
                  <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
                    This action is permanent and cannot be undone
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-[#202124] dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
              <p>
                Deleting your account will permanently wipe:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li>Your profile details, student verification status, and avatar</li>
                <li>All active or archived PG/flat listings created by you</li>
                <li>Your inbox messages, mutual contact requests, and notifications</li>
              </ul>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 dark:bg-[#3C1E1E] border border-rose-200 dark:border-[#5C2828] text-rose-800 dark:text-[#F28B82] text-xs font-semibold rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-[#3C4043] hover:bg-slate-200 dark:hover:bg-[#4A4D51] text-[#202124] dark:text-[#FFFFFF] text-xs font-bold rounded-2xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-5 py-2.5 bg-[#C5221F] hover:bg-[#A51D1A] dark:bg-[#D93025] dark:hover:bg-[#C5221F] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete My Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
