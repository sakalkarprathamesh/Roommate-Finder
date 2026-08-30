'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { MIT_SCHOOLS, MIT_DEPARTMENTS, ACADEMIC_YEARS } from '@/lib/constants';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function RegisterPage() {
  usePageMeta({
    title: 'Student Registration | MIT-ADT Roommate Finder',
    description:
      'Create your verified MIT-ADT student account to find roommates and shared flats near campus.',
    noindex: false,
  });

  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: MIT_SCHOOLS[0],
    department: MIT_DEPARTMENTS[0],
    year: ACADEMIC_YEARS[0],
    division: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-900 text-white flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Registration
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Join the official student accommodation network for MIT-ADT University Pune.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name & Gmail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Prathamesh Sakalkar"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gmail / Personal Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. yourname@gmail.com"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number (Private) *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              🔒 Kept strictly private. Only shared with students when you accept their contact request.
            </span>
          </div>

          {/* School & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                School / SOC *
              </label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              >
                {MIT_SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              >
                {MIT_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Year & Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Division / Batch (Optional)
              </label>
              <input
                type="text"
                name="division"
                value={formData.division}
                onChange={handleChange}
                placeholder="e.g. Div B / Batch 1"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type password"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-brand-900 hover:underline">
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
