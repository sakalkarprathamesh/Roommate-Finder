'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  CheckCircle2,
  Save,
  AlertCircle,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Sliders,
  ShieldCheck,
  Camera,
  Check,
  Info,
  Lock,
} from 'lucide-react';
import {
  MIT_SCHOOLS,
  MIT_DEPARTMENTS,
  ACADEMIC_YEARS,
  FLATMATE_PREFERENCES,
} from '@/lib/constants';
import AvatarPicker from '@/components/auth/AvatarPicker';
import WhatsNewModal from '@/components/modals/WhatsNewModal';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ProfilePage() {
  usePageMeta({
    title: 'Profile | Roomie',
    description: 'Manage your Roomie personal information, lifestyle preferences, and security settings.',
    noindex: true,
  });

  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'security'>('personal');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    school: '',
    department: '',
    year: '',
    division: '',
    bio: '',
    avatarId: 'avatar-male-1',
    profilePhotoUrl: '',
    city: 'Pune',
    preferences: [] as string[],
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login?redirect=/profile');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.profile) {
          setProfile(data.profile);
          setFormData({
            name: data.profile.name || '',
            phone: data.profile.phone || '',
            school: data.profile.school || MIT_SCHOOLS[0],
            department: data.profile.department || MIT_DEPARTMENTS[0],
            year: data.profile.year || ACADEMIC_YEARS[0],
            division: data.profile.division || '',
            bio: data.profile.bio || '',
            avatarId: data.profile.avatarId || 'avatar-male-1',
            profilePhotoUrl: data.profile.profilePhotoUrl || '',
            city: data.profile.city || 'Pune',
            preferences: data.profile.preferences || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const togglePreference = (prefId: string) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(prefId);
      const updated = exists
        ? prev.preferences.filter((p) => p !== prefId)
        : [...prev.preferences, prefId];
      return { ...prev, preferences: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
        setMessage('Your profile and preferences have been saved successfully.');
        setTimeout(() => setMessage(''), 3500);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch {
      setError('Something went wrong. Please check your network.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#5F6368] dark:text-[#BDC1C6] text-xs font-semibold">
        Loading your Roomie profile...
      </div>
    );
  }

  const roleLabel =
    profile?.role === 'PG_OWNER'
      ? '🏢 PG Owner Account'
      : profile?.role === 'FLAT_OWNER'
      ? '🏡 Flat Owner Account'
      : profile?.role === 'admin'
      ? '🛡️ Admin Account'
      : '🏠 Student Seeker';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 🌟 1. GOOGLE ACCOUNT PROFILE HEADER */}
      <div className="text-center space-y-3 pb-2">
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-3xl font-black shadow-md mx-auto overflow-hidden border-4 border-white dark:border-[#303134]">
            {formData.profilePhotoUrl ? (
              <img
                src={formData.profilePhotoUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              formData.name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()
            )}
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className="absolute bottom-1 right-1 p-2 bg-white dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] hover:bg-slate-50 dark:hover:bg-[#4A4D51] border border-[#DADCE0] dark:border-[#5F6368] rounded-full shadow-xs transition-transform hover:scale-105 cursor-pointer"
            title="Change Avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-[#FFFFFF] tracking-tight">
            Welcome, {formData.name || 'Roomie User'}
          </h1>
          <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] font-medium">
            Manage your personal info, lifestyle preferences, and privacy settings.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          <span className="px-3 py-1 bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#DADCE0] dark:border-[#2B4C7E] text-xs font-bold rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
            {roleLabel}
          </span>
          <span className="px-3 py-1 bg-[#E6F4EA] dark:bg-[#133E26] text-[#137333] dark:text-[#81C995] border border-[#CEEAD6] dark:border-[#1E5E3A] text-xs font-bold rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34A853] dark:text-[#81C995]" />
            Verified Profile
          </span>
        </div>
      </div>

      {/* 🌟 2. GOOGLE ACCOUNT TAB NAVIGATION */}
      <div className="flex items-center justify-center border-b border-[#DADCE0] dark:border-[#3C4043]">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`pb-3.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'personal'
                ? 'border-[#1A73E8] text-[#1A73E8] dark:border-[#8AB4F8] dark:text-[#8AB4F8]'
                : 'border-transparent text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`pb-3.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'preferences'
                ? 'border-[#1A73E8] text-[#1A73E8] dark:border-[#8AB4F8] dark:text-[#8AB4F8]'
                : 'border-transparent text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Lifestyle & Preferences</span>
            {formData.preferences?.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] rounded-full text-[10px] font-black">
                {formData.preferences.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-[#1A73E8] text-[#1A73E8] dark:border-[#8AB4F8] dark:text-[#8AB4F8]'
                : 'border-transparent text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Privacy</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div className="bg-[#E6F4EA] dark:bg-[#133E26] border border-[#CEEAD6] dark:border-[#1E5E3A] text-[#137333] dark:text-[#81C995] text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#137333] dark:text-[#81C995] flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-[#FCE8E6] dark:bg-[#3C1E1E] border border-[#FAD2CF] dark:border-[#5C2828] text-[#C5221F] dark:text-[#F28B82] text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 🌟 3. TAB CONTENT CARDS */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF]">Personal & Academic Information</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
                Basic info and contact details used across your Roomie listings and requests.
              </p>
            </div>

            {/* Avatar & Photo Selection */}
            <div className="space-y-2 pb-6 border-b border-[#DADCE0] dark:border-[#3C4043]">
              <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                Profile Picture / Avatar
              </label>
              <AvatarPicker
                selectedAvatarId={formData.avatarId}
                customPhotoUrl={formData.profilePhotoUrl}
                userGender={formData.avatarId?.includes('female') ? 'FEMALE' : 'MALE'}
                onSelectAvatar={(avatarId, photoUrl) => {
                  handleChange('avatarId', avatarId);
                  handleChange('profilePhotoUrl', photoUrl);
                }}
              />
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  Phone Number (Protected) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold"
                />
                <span className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] block">
                  🔒 Kept private until you approve a student&apos;s connection request.
                </span>
              </div>
            </div>

            {/* School & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  School / College *
                </label>
                <select
                  value={formData.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
                >
                  {MIT_SCHOOLS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
                >
                  {MIT_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year & Division */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  Academic Year *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
                >
                  {ACADEMIC_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  Division / Section (Optional)
                </label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  placeholder="e.g. Div B / Batch 3"
                  className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                About You / Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Share your hobbies, study schedule, cleanliness habits, or flat preferences..."
                className="w-full text-xs bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-3 text-[#202124] dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: LIFESTYLE & PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF]">Flatmate & Lifestyle Preferences</h2>
                <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
                  Select the lifestyle habits and qualities you look for in compatible roommates.
                </p>
              </div>
              <span className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#1E3A5F] px-3 py-1 rounded-full self-start sm:self-auto">
                {formData.preferences?.length || 0} / 10 Selected
              </span>
            </div>

            {/* 10 Visual Flatmate Preference Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {FLATMATE_PREFERENCES.map((pref) => {
                const isSelected = formData.preferences?.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-3xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#1A73E8] dark:border-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#1E3A5F] shadow-2xs'
                        : 'border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] hover:bg-white dark:hover:bg-[#303134]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pref.emoji}</span>
                      <div>
                        <p className={`font-bold text-xs ${isSelected ? 'text-[#1A73E8] dark:text-[#8AB4F8]' : 'text-[#202124] dark:text-[#FFFFFF]'}`}>
                          {pref.title}
                        </p>
                        <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">{pref.description}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors flex-shrink-0 ${
                        isSelected ? 'bg-[#1A73E8] text-white' : 'border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#202124]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & PRIVACY */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-[#202124] dark:text-[#FFFFFF]">Security, Privacy & Data Protection</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
                Review how your academic identity and contact numbers are protected on Roomie.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#E6F4EA] dark:bg-[#133E26] border border-[#CEEAD6] dark:border-[#1E5E3A] p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#34A853] dark:text-[#81C995] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-[#137333] dark:text-[#81C995] text-xs">Verified Account Status</h3>
                  <p className="text-[11px] text-[#137333]/90 dark:text-[#81C995]/90 leading-relaxed">
                    Your account is registered with email <strong className="text-[#137333] dark:text-[#81C995]">{profile?.email}</strong> and verified for student accommodations.
                  </p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] p-4 rounded-2xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-[#202124] dark:text-[#FFFFFF] text-xs">Protected Contact Sharing</h3>
                  <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                    Your phone number and email address are never displayed publicly on search results. They are only revealed after you approve a mutual contact request in your Inbox.
                  </p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] p-4 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[#5F6368] dark:text-[#BDC1C6] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-[#202124] dark:text-[#FFFFFF] text-xs">Zero-Cost Platform Guarantee</h3>
                  <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">
                    Roomie provides CAPTCHA-based verification with zero subscription fees, SMS charges, or paid OTP barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
            Changes are saved to your verified Roomie account.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>

      {/* 🌟 4. WHAT'S NEW SECTION (HIGH CONTRAST IN DARK MODE) */}
      <div className="bg-white dark:bg-[#303134] rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F0FE] dark:bg-[#1E3A5F] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center text-xl flex-shrink-0">
            ✨
          </div>
          <div>
            <h2 className="text-sm font-black text-[#202124] dark:text-[#FFFFFF]">
              What&apos;s New in Roomie v2.0
            </h2>
            <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
              Role-based onboarding, PG occupancy pricing grid, and 3-state verification.
            </p>
          </div>
        </div>

        <WhatsNewModal buttonStyle="button" buttonLabel="View What's New" />
      </div>
    </div>
  );
}
