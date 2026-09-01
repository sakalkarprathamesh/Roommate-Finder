'use client';

import React, { useState, useMemo } from 'react';
import { Upload, Check, User, Image as ImageIcon } from 'lucide-react';

export interface AvatarItem {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  url: string;
}

export const PRESET_AVATARS: AvatarItem[] = [
  // Male Avatars
  { id: 'avatar-male-1', name: 'Avatar 1', gender: 'MALE', url: '/avatars/avatar-male-1.png' },
  { id: 'avatar-male-2', name: 'Avatar 2', gender: 'MALE', url: '/avatars/avatar-male-2.png' },
  { id: 'avatar-male-3', name: 'Avatar 3', gender: 'MALE', url: '/avatars/avatar-male-3.png' },
  { id: 'avatar-male-4', name: 'Avatar 4', gender: 'MALE', url: '/avatars/avatar-male-4.png' },
  { id: 'avatar-male-5', name: 'Avatar 5', gender: 'MALE', url: '/avatars/avatar-male-5.png' },
  { id: 'avatar-male-6', name: 'Avatar 6', gender: 'MALE', url: '/avatars/avatar-male-6.png' },

  // Female Avatars
  { id: 'avatar-female-1', name: 'Avatar 7', gender: 'FEMALE', url: '/avatars/avatar-female-1.png' },
  { id: 'avatar-female-2', name: 'Avatar 8', gender: 'FEMALE', url: '/avatars/avatar-female-2.png' },
  { id: 'avatar-female-3', name: 'Avatar 9', gender: 'FEMALE', url: '/avatars/avatar-female-3.png' },
  { id: 'avatar-female-4', name: 'Avatar 10', gender: 'FEMALE', url: '/avatars/avatar-female-4.png' },
];

export const DEFAULT_MALE_AVATAR = PRESET_AVATARS[0];
export const DEFAULT_FEMALE_AVATAR = PRESET_AVATARS[6];

interface AvatarPickerProps {
  selectedAvatarId: string;
  customPhotoUrl: string;
  userGender?: string | null; // 'MALE' | 'FEMALE' | 'OTHER' | ''
  onSelectAvatar: (avatarId: string, photoUrl: string) => void;
  onGenderChange?: (gender: 'MALE' | 'FEMALE') => void;
}

export default function AvatarPicker({
  selectedAvatarId,
  customPhotoUrl,
  userGender,
  onSelectAvatar,
  onGenderChange,
}: AvatarPickerProps) {
  const [tab, setTab] = useState<'avatar' | 'upload'>(customPhotoUrl ? 'upload' : 'avatar');
  const [genderFilter, setGenderFilter] = useState<'MALE' | 'FEMALE' | 'ALL'>(
    userGender?.toUpperCase() === 'FEMALE'
      ? 'FEMALE'
      : userGender?.toUpperCase() === 'MALE'
      ? 'MALE'
      : 'ALL'
  );
  const [uploadError, setUploadError] = useState('');

  // Sync gender filter when userGender prop changes
  React.useEffect(() => {
    if (userGender?.toUpperCase() === 'FEMALE') {
      setGenderFilter('FEMALE');
    } else if (userGender?.toUpperCase() === 'MALE') {
      setGenderFilter('MALE');
    }
  }, [userGender]);

  // Filtered avatars based on gender preference
  const filteredAvatars = useMemo(() => {
    if (genderFilter === 'MALE') {
      return PRESET_AVATARS.filter((a) => a.gender === 'MALE');
    }
    if (genderFilter === 'FEMALE') {
      return PRESET_AVATARS.filter((a) => a.gender === 'FEMALE');
    }
    return PRESET_AVATARS;
  }, [genderFilter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onSelectAvatar('custom', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomPhoto = () => {
    const fallback = genderFilter === 'FEMALE' ? DEFAULT_FEMALE_AVATAR : DEFAULT_MALE_AVATAR;
    onSelectAvatar(fallback.id, fallback.url);
    setTab('avatar');
  };

  const handleGenderSwitch = (gender: 'MALE' | 'FEMALE' | 'ALL') => {
    setGenderFilter(gender);
    if (gender !== 'ALL' && onGenderChange) {
      onGenderChange(gender);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tab Switcher (Illustrated Avatar vs Upload) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#202124] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] w-fit">
          <button
            type="button"
            onClick={() => setTab('avatar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tab === 'avatar'
                ? 'bg-white dark:bg-[#303134] text-[#1A73E8] dark:text-[#8AB4F8] shadow-xs'
                : 'text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Avatars</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tab === 'upload'
                ? 'bg-white dark:bg-[#303134] text-[#1A73E8] dark:text-[#8AB4F8] shadow-xs'
                : 'text-[#5F6368] dark:text-[#BDC1C6] hover:text-[#202124] dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Gender Filter Quick Pills (No emojis) */}
        {tab === 'avatar' && (
          <div className="flex items-center gap-1.5 text-xs font-bold self-start sm:self-auto">
            <span className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] mr-1 hidden sm:inline">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => handleGenderSwitch('MALE')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                genderFilter === 'MALE'
                  ? 'bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] border-[#1A73E8] shadow-xs'
                  : 'bg-white dark:bg-[#202124] text-[#5F6368] dark:text-[#BDC1C6] border-[#DADCE0] dark:border-[#3C4043] hover:bg-slate-50 dark:hover:bg-[#303134]'
              }`}
            >
              Male ({PRESET_AVATARS.filter((a) => a.gender === 'MALE').length})
            </button>

            <button
              type="button"
              onClick={() => handleGenderSwitch('FEMALE')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                genderFilter === 'FEMALE'
                  ? 'bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] border-[#1A73E8] shadow-xs'
                  : 'bg-white dark:bg-[#202124] text-[#5F6368] dark:text-[#BDC1C6] border-[#DADCE0] dark:border-[#3C4043] hover:bg-slate-50 dark:hover:bg-[#303134]'
              }`}
            >
              Female ({PRESET_AVATARS.filter((a) => a.gender === 'FEMALE').length})
            </button>

            <button
              type="button"
              onClick={() => handleGenderSwitch('ALL')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                genderFilter === 'ALL'
                  ? 'bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] border-[#1A73E8] shadow-xs'
                  : 'bg-white dark:bg-[#202124] text-[#5F6368] dark:text-[#BDC1C6] border-[#DADCE0] dark:border-[#3C4043] hover:bg-slate-50 dark:hover:bg-[#303134]'
              }`}
            >
              All
            </button>
          </div>
        )}
      </div>

      {tab === 'avatar' ? (
        <div className="space-y-3">
          <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6]">
            {genderFilter === 'MALE' && 'Showing male student avatars. Click to select:'}
            {genderFilter === 'FEMALE' && 'Showing female student avatars. Click to select:'}
            {genderFilter === 'ALL' && 'Showing all student avatars. Click to select:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {filteredAvatars.map((av) => {
              const isSelected = selectedAvatarId === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => onSelectAvatar(av.id, av.url)}
                  className={`relative p-3.5 rounded-3xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer group ${
                    isSelected
                      ? 'border-[#1A73E8] dark:border-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#1E3A5F] ring-2 ring-[#1A73E8]/30 shadow-xs'
                      : 'border-[#DADCE0] dark:border-[#3C4043] bg-white dark:bg-[#202124] hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#303134]'
                  }`}
                >
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden bg-slate-50 dark:bg-[#303134] p-1 flex items-center justify-center shadow-xs">
                    <img
                      src={av.url}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-105"
                    />
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] flex items-center justify-center animate-in zoom-in-75 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {customPhotoUrl && selectedAvatarId === 'custom' ? (
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043] rounded-3xl shadow-2xs">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1A73E8] dark:border-[#8AB4F8] p-0.5">
                <img
                  src={customPhotoUrl}
                  alt="Custom Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-xs font-bold text-[#202124] dark:text-[#FFFFFF] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#34A853] dark:text-[#81C995]" />
                  Custom photo uploaded
                </div>
                <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6]">
                  This photo will be displayed on your profile and listings.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveCustomPhoto}
                className="px-3.5 py-2 bg-slate-100 dark:bg-[#3C4043] hover:bg-slate-200 text-[#202124] dark:text-[#FFFFFF] text-xs font-bold rounded-2xl transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] dark:hover:border-[#8AB4F8] bg-[#F8F9FA] dark:bg-[#202124] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3 group">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#303134] border border-[#DADCE0] dark:border-[#3C4043] shadow-2xs flex items-center justify-center text-[#1A73E8] dark:text-[#8AB4F8] group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#202124] dark:text-[#FFFFFF]">
                  Click to upload your custom photo
                </div>
                <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] mt-0.5">
                  PNG, JPG or WebP (Max 5MB)
                </p>
              </div>
            </label>
          )}

          {uploadError && (
            <p className="text-xs text-rose-600 font-medium">
              {uploadError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
