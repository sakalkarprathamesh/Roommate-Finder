'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Lock,
  Mail,
  Phone,
  User,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  Home,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import CaptchaBox from './CaptchaBox';
import AvatarPicker, { PRESET_AVATARS, DEFAULT_MALE_AVATAR, DEFAULT_FEMALE_AVATAR } from './AvatarPicker';
import {
  MIT_SCHOOLS,
  MIT_DEPARTMENTS,
  ACADEMIC_YEARS,
  SUPPORTED_CITIES,
  FLATMATE_PREFERENCES,
} from '@/lib/constants';

export type UserRoleType = 'SEEKER' | 'PG_OWNER' | 'FLAT_OWNER';

export default function RegisterWizard() {
  const router = useRouter();

  // Navigation state: Steps 1 to 5 (and Step 6 for Seeker)
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Step 1: Credentials & Captcha
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Step 2: Essential Details & Gender
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [college, setCollege] = useState('MIT-ADT University, Pune');
  const [school, setSchool] = useState<string>(MIT_SCHOOLS[0]);
  const [department, setDepartment] = useState<string>(MIT_DEPARTMENTS[0]);
  const [year, setYear] = useState<string>(ACADEMIC_YEARS[0]);
  const [division, setDivision] = useState('');

  // Step 3: Role Selection
  const [role, setRole] = useState<UserRoleType>('SEEKER');

  // Step 4: City Selection
  const [city, setCity] = useState<string>('Pune');

  // Step 5: Avatar / Photo
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(DEFAULT_MALE_AVATAR.id);
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_MALE_AVATAR.url);

  // Step 6 (Seeker only): Flatmate Preferences
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const totalSteps = role === 'SEEKER' ? 6 : 5;

  const togglePreference = (prefId: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(prefId) ? prev.filter((id) => id !== prefId) : [...prev, prefId]
    );
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!captchaVerified) {
      setError('Please complete the CAPTCHA security verification');
      return;
    }

    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    setStep(3);
  };

  const handleNextFromStep3 = () => {
    setError('');
    setStep(4);
  };

  const handleNextFromStep4 = () => {
    setError('');
    setStep(5);
  };

  const handleNextFromStep5 = () => {
    setError('');
    if (role === 'SEEKER') {
      setStep(6);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          name: fullName.trim(),
          school,
          department,
          year,
          division: division.trim() || undefined,
          role,
          roles: [role],
          city: city || 'Pune',
          profilePhotoUrl: photoUrl,
          avatarId: selectedAvatarId,
          preferences: JSON.stringify(selectedPreferences),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setIsCompleted(true);
      setLoading(false);
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Completion View
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-xs">
          🎉
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            You&apos;re all set!
          </h1>
          <p className="text-base text-slate-600 dark:text-[#BDC1C6] max-w-md mx-auto">
            Your Roomie account has been created successfully.
          </p>
        </div>

        <div className="bg-white dark:bg-[#303134] rounded-3xl border border-slate-200 dark:border-[#3C4043] p-6 shadow-sm max-w-sm mx-auto text-left flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 dark:bg-[#202124] flex-shrink-0 border border-slate-200 dark:border-[#3C4043]">
            <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white">{fullName}</div>
            <div className="text-xs text-slate-500 dark:text-[#BDC1C6]">{email}</div>
            <div className="text-[11px] font-bold text-blue-600 dark:text-[#8AB4F8] mt-0.5">
              {role === 'SEEKER' ? 'Student / Seeker' : role === 'PG_OWNER' ? 'PG Owner' : 'Flat Owner'} • {city}
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {role === 'SEEKER' && (
            <button
              type="button"
              onClick={() => {
                router.push('/find');
                router.refresh();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Roomie</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {role === 'PG_OWNER' && (
            <button
              type="button"
              onClick={() => {
                router.push('/pg/new');
                router.refresh();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Add Your PG Listing</span>
            </button>
          )}

          {role === 'FLAT_OWNER' && (
            <button
              type="button"
              onClick={() => {
                router.push('/flat/new');
                router.refresh();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Add Your Flat Listing</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      {/* Progress & Back navigation */}
      <div className="flex items-center justify-between mb-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setError('');
              setStep((prev) => Math.max(1, prev - 1));
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-[#BDC1C6] hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-[#BDC1C6] hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Already registered? Login</span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-[#BDC1C6]">
            Step {step} of {totalSteps}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx + 1 === step
                    ? 'w-6 bg-blue-600'
                    : idx + 1 < step
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-[#3C4043]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-[#3C1E1E] border border-rose-200 dark:border-[#5C2828] text-rose-800 dark:text-[#F28B82] text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ================= STEP 1: Account Credentials & CAPTCHA ================= */}
      {step === 1 && (
        <form onSubmit={handleNextFromStep1} className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Let&apos;s get you started
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#BDC1C6]">
              Create your Roomie account in just a few steps.
            </p>
          </div>

          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-slate-200 dark:border-[#3C4043] p-6 sm:p-8 shadow-sm space-y-5">
            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 text-xs font-bold">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-16 pr-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Email ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                Email ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email address (e.g. name@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Visual CAPTCHA */}
            <CaptchaBox onVerify={(valid) => setCaptchaVerified(valid)} />
          </div>

          <button
            type="submit"
            disabled={!captchaVerified}
            className={`w-full py-3.5 font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              captchaVerified
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 dark:bg-[#3C4043] text-slate-400 dark:text-[#BDC1C6] cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* ================= STEP 2: Essential Details & Gender Selection ================= */}
      {step === 2 && (
        <form onSubmit={handleNextFromStep2} className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Tell us a little about yourself
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#BDC1C6]">
              Essential profile info for student accommodation matching.
            </p>
          </div>

          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-slate-200 dark:border-[#3C4043] p-6 sm:p-8 shadow-sm space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* 🌟 Gender Selection (Crucial for Avatar suggestions) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                Gender (for avatar suggestions) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setGender('MALE');
                    setSelectedAvatarId(DEFAULT_MALE_AVATAR.id);
                    setPhotoUrl(DEFAULT_MALE_AVATAR.url);
                  }}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between px-4 text-xs font-bold transition-all cursor-pointer ${
                    gender === 'MALE'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-[#1E3A5F] text-blue-700 dark:text-[#8AB4F8] shadow-2xs'
                      : 'border-slate-200 dark:border-[#3C4043] bg-slate-50 dark:bg-[#202124] text-slate-600 dark:text-[#BDC1C6] hover:bg-white'
                  }`}
                >
                  <span>Male</span>
                  {gender === 'MALE' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender('FEMALE');
                    setSelectedAvatarId(DEFAULT_FEMALE_AVATAR.id);
                    setPhotoUrl(DEFAULT_FEMALE_AVATAR.url);
                  }}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between px-4 text-xs font-bold transition-all cursor-pointer ${
                    gender === 'FEMALE'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-[#1E3A5F] text-blue-700 dark:text-[#8AB4F8] shadow-2xs'
                      : 'border-slate-200 dark:border-[#3C4043] bg-slate-50 dark:bg-[#202124] text-slate-600 dark:text-[#BDC1C6] hover:bg-white'
                  }`}
                >
                  <span>Female</span>
                  {gender === 'FEMALE' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* College / University */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                College / University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* School / Course */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                School / Faculty
              </label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
              >
                {MIT_SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                Department / Branch
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
              >
                {MIT_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Year & Division */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                  Year of Study
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
                >
                  {ACADEMIC_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-[#E8EAED] block">
                  Division (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Div B"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* ================= STEP 3: Role Selection ================= */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Choose your role
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#BDC1C6]">
              Select how you will be using the Roomie platform.
            </p>
          </div>

          <div className="space-y-3">
            {/* Option 1: Seeker */}
            <button
              type="button"
              onClick={() => setRole('SEEKER')}
              className={`p-6 rounded-3xl border-2 transition-all flex items-start gap-4 text-left cursor-pointer group ${
                role === 'SEEKER'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-[#1E3A5F] shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-[#3C4043] bg-white dark:bg-[#303134] hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-[#1E3A5F] text-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                🎓
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    I&apos;m a Student looking for Flat / PG
                  </h2>
                  {role === 'SEEKER' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-in zoom-in-75">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-[#BDC1C6] leading-relaxed">
                  Find compatible flatmates, explore verified PGs, single rooms, and shared apartments near college.
                </p>
              </div>
            </button>

            {/* Option 2: PG Owner */}
            <button
              type="button"
              onClick={() => setRole('PG_OWNER')}
              className={`p-6 rounded-3xl border-2 transition-all flex items-start gap-4 text-left cursor-pointer group ${
                role === 'PG_OWNER'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-[#1E3A5F] shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-[#3C4043] bg-white dark:bg-[#303134] hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                🏢
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    I&apos;m a PG Owner
                  </h2>
                  {role === 'PG_OWNER' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-in zoom-in-75">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-[#BDC1C6] leading-relaxed">
                  List your paying guest accommodation and connect with verified student tenants.
                </p>
              </div>
            </button>

            {/* Option 3: Flat Owner */}
            <button
              type="button"
              onClick={() => setRole('FLAT_OWNER')}
              className={`p-6 rounded-3xl border-2 transition-all flex items-start gap-4 text-left cursor-pointer group ${
                role === 'FLAT_OWNER'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-[#1E3A5F] shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-[#3C4043] bg-white dark:bg-[#303134] hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                🏡
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    I&apos;m a Flat Owner
                  </h2>
                  {role === 'FLAT_OWNER' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-in zoom-in-75">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-[#BDC1C6] leading-relaxed">
                  List your residential flat and find reliable student tenants or flatmates.
                </p>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextFromStep3}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= STEP 4: City Selection ================= */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Where are you looking?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#BDC1C6]">
              Select your primary city for campus accommodation listings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUPPORTED_CITIES.map((c) => {
              const isSelected = city === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-[#1E3A5F] shadow-xs ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-[#3C4043] bg-white dark:bg-[#303134] hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-[#8AB4F8]' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-900 dark:text-white' : 'text-slate-700 dark:text-[#BDC1C6]'}`}>
                    {c}
                  </span>
                  {c === 'Pune' && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-[#1E3A5F] text-blue-700 dark:text-[#8AB4F8]">
                      MIT-ADT Campus
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextFromStep4}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= STEP 5: Profile Picture / Illustrated Avatar ================= */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Add your profile picture
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#BDC1C6]">
              {gender === 'FEMALE'
                ? 'Choose from female student avatars or upload your custom photo.'
                : 'Choose from male student avatars or upload your custom photo.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-slate-200 dark:border-[#3C4043] p-6 sm:p-8 shadow-sm">
            <AvatarPicker
              selectedAvatarId={selectedAvatarId}
              customPhotoUrl={selectedAvatarId === 'custom' ? photoUrl : ''}
              userGender={gender}
              onSelectAvatar={(avId, url) => {
                setSelectedAvatarId(avId);
                setPhotoUrl(url);
              }}
              onGenderChange={(g) => setGender(g)}
            />
          </div>

          <button
            type="button"
            onClick={handleNextFromStep5}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>{role === 'SEEKER' ? 'Continue to Lifestyle Preferences' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* ================= STEP 6 (SEEKER ONLY): Lifestyle & Flatmate Preferences ================= */}
      {step === 6 && role === 'SEEKER' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Lifestyle & Roommate Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#BDC1C6]">
              Select tags that describe your ideal flatmate habits. You can edit these anytime.
            </p>
          </div>

          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-slate-200 dark:border-[#3C4043] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-[#E8EAED]">
              <span>Popular Flatmate Tags</span>
              <span className="text-blue-600 dark:text-[#8AB4F8]">{selectedPreferences.length} selected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FLATMATE_PREFERENCES.map((pref) => {
                const isSelected = selectedPreferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-[#1E3A5F] shadow-2xs'
                        : 'border-slate-200 dark:border-[#3C4043] bg-slate-50 dark:bg-[#202124] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pref.emoji}</span>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-blue-900 dark:text-[#8AB4F8]' : 'text-slate-800 dark:text-white'}`}>
                          {pref.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#BDC1C6]">{pref.description}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-[#5F6368] bg-white dark:bg-[#202124]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finalizing Profile...</span>
              </>
            ) : (
              <>
                <span>Finish & Start Exploring</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
