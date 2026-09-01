'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { CHANGELOG_ENTRIES } from '@/lib/changelog';

interface WhatsNewModalProps {
  buttonStyle?: 'pill' | 'text' | 'button';
  buttonLabel?: string;
}

export default function WhatsNewModal({
  buttonStyle = 'pill',
  buttonLabel = "What's New",
}: WhatsNewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      {buttonStyle === 'pill' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8] text-xs font-bold transition-colors cursor-pointer border border-[#DADCE0] dark:border-[#2B4C7E]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </button>
      )}

      {buttonStyle === 'text' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </button>
      )}

      {buttonStyle === 'button' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-white dark:bg-[#3C4043] border border-[#DADCE0] dark:border-[#5F6368] hover:bg-slate-50 dark:hover:bg-[#4A4D51] text-[#202124] dark:text-[#FFFFFF] rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span>{buttonLabel}</span>
        </button>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-5 relative max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3C4043] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight">
                    What&apos;s New in Roomie
                  </h2>
                  <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
                    Platform updates, role-based workflows & verification features
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-2xl text-slate-400 hover:text-[#202124] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#3C4043] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Changelog Entries List */}
            <div className="overflow-y-auto space-y-4 pr-1 divide-y divide-slate-100 dark:divide-[#3C4043] flex-1">
              {CHANGELOG_ENTRIES.map((entry) => (
                <div key={entry.id} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-xs text-[#202124] dark:text-[#FFFFFF] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#34A853] dark:text-[#81C995] flex-shrink-0" />
                      <span>{entry.title}</span>
                    </h3>
                    <span className="text-[10px] font-bold text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#1E3A5F] px-2 py-0.5 rounded-full">
                      v2.0
                    </span>
                  </div>
                  <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed pl-5.5">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#3C4043] flex items-center justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
              >
                Awesome, got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
