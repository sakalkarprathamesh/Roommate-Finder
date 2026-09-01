'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function LoginPage() {
  usePageMeta({
    title: 'Login | Roomie',
    description: 'Sign in to your Roomie account to connect with flatmates and manage your listings.',
    noindex: false,
  });

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user?.role === 'admin') {
          router.push('/admin');
        } else if (data.user?.role === 'PG_OWNER') {
          router.push('/manage/pg');
        } else if (data.user?.role === 'FLAT_OWNER') {
          router.push('/manage/flat');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#DADCE0] p-8 sm:p-10 shadow-sm space-y-6 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1A73E8] text-white font-black flex items-center justify-center mx-auto text-lg shadow-2xs">
            R
          </div>
          <h1 className="text-2xl font-black text-[#202124] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#5F6368]">
            Sign in to Roomie with your email address
          </p>
        </div>

        {error && (
          <div className="bg-[#FCE8E6] border border-[#FAD2CF] text-[#C5221F] text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#202124]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 pl-10 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#202124]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 pl-10 pr-10 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#5F6368] space-y-2 border-t border-[#DADCE0]">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-[#1A73E8] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
