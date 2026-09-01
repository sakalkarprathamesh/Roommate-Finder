'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface CaptchaBoxProps {
  onVerify: (isValid: boolean) => void;
}

export default function CaptchaBox({ onVerify }: CaptchaBoxProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2; // 2 - 9
    const n2 = Math.floor(Math.random() * 8) + 1; // 1 - 8
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsVerified(false);
    setError(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCheck = (val: string) => {
    setUserAnswer(val);
    const parsed = parseInt(val.trim(), 10);
    if (!isNaN(parsed) && parsed === num1 + num2) {
      setIsVerified(true);
      setError(false);
      onVerify(true);
    } else {
      setIsVerified(false);
      if (val.trim().length >= 2 || (val.trim().length > 0 && parsed !== num1 + num2 && !String(num1 + num2).startsWith(val.trim()))) {
        setError(true);
      } else {
        setError(false);
      }
      onVerify(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
        <span className="flex items-center gap-1.5 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Security Verification (CAPTCHA)
        </span>
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
          title="Refresh CAPTCHA"
        >
          <RefreshCw className="w-3 h-3" />
          <span>New challenge</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Math visual challenge box */}
        <div className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs select-none">
          <span className="font-mono text-base font-black text-slate-800 tracking-wider">
            {num1} + {num2} = ?
          </span>
        </div>

        {/* Input box */}
        <div className="flex-1 relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter sum"
            value={userAnswer}
            onChange={(e) => handleCheck(e.target.value)}
            disabled={isVerified}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border outline-none ${
              isVerified
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                : error
                ? 'bg-rose-50 border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-200'
                : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {isVerified && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 text-xs font-bold animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified</span>
            </div>
          )}
        </div>
      </div>

      {error && !isVerified && (
        <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Incorrect sum. Please calculate {num1} + {num2} or click new challenge.
        </p>
      )}
    </div>
  );
}
