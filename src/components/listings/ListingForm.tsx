'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LISTING_TYPES,
  ACCOMMODATION_TYPES,
  ROOM_TYPES,
  PUNE_AREAS,
} from '@/lib/constants';
import { Save, AlertCircle, CheckCircle2, Building, Calendar, IndianRupee, Users } from 'lucide-react';

interface ListingFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ListingForm({ initialData, isEdit = false }: ListingFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    listingType: initialData?.listingType || 'HAVE_VACANCY',
    accommodationType: initialData?.accommodationType || 'Flat',
    roomType: initialData?.roomType || 'Shared',
    location: initialData?.location || PUNE_AREAS[0],
    rent: initialData?.rent || 7500,
    deposit: initialData?.deposit || 15000,
    currentOccupants: initialData?.currentOccupants || 2,
    vacancies: initialData?.vacancies || 1,
    totalCapacity: initialData?.totalCapacity || 3,
    moveInDate: initialData?.moveInDate || 'September 2026',
    description: initialData?.description || '',
    status: initialData?.status || 'ACTIVE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validations
    if (formData.rent < 0 || formData.deposit < 0 || formData.currentOccupants < 0 || formData.vacancies < 0 || formData.totalCapacity < 1) {
      setError('Rent, deposit, occupants and vacancies cannot be negative, and capacity must be at least 1');
      setLoading(false);
      return;
    }

    try {
      const url = isEdit ? `/api/listings/${initialData.id}` : '/api/listings';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.status === 401) {
        setError('Please log in or register to publish an accommodation listing.');
        setTimeout(() => {
          router.push(`/login?redirect=${isEdit ? `/listings/${initialData.id}/edit` : '/listings/new'}`);
        }, 1200);
        return;
      }

      if (res.ok) {
        setSuccess(isEdit ? 'Listing updated successfully!' : 'Listing published successfully!');
        setTimeout(() => {
          router.push(isEdit ? `/listings/${initialData.id}` : '/dashboard');
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || 'Failed to save listing. Please check the form fields.');
      }
    } catch {
      setError('Connection issue. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isVacancyType = formData.listingType === 'HAVE_VACANCY' || formData.listingType === 'HAVE_ROOM';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* 1. Primary Listing Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          What type of listing are you creating? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(LISTING_TYPES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleChange('listingType', key)}
              className={`p-3.5 rounded-2xl border text-left font-bold text-xs transition-all flex items-center justify-between ${
                formData.listingType === key
                  ? 'border-brand-900 bg-brand-50 text-brand-900 ring-2 ring-brand-900/20 shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>{label}</span>
              {formData.listingType === key && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Listing Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Listing Headline / Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={
            isVacancyType
              ? 'e.g. 1 Vacancy in 2BHK Flat near Gate 2'
              : 'e.g. Looking for 1 Roommate for flat in Loni Kalbhor'
          }
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
        />
      </div>

      {/* 3. Accommodation & Room Type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Accommodation Type *
          </label>
          <select
            value={formData.accommodationType}
            onChange={(e) => handleChange('accommodationType', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
          >
            {ACCOMMODATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Room Type *
          </label>
          <select
            value={formData.roomType}
            onChange={(e) => handleChange('roomType', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
          >
            {ROOM_TYPES.map((r) => (
              <option key={r} value={r}>
                {r} Room
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Area / General Location *
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
          >
            {PUNE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Financials: Rent & Deposit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Monthly Rent (₹ / person) *
          </label>
          <input
            type="number"
            min="0"
            required
            value={formData.rent}
            onChange={(e) => handleChange('rent', parseInt(e.target.value, 10))}
            placeholder="e.g. 7500"
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Security Deposit (₹)
          </label>
          <input
            type="number"
            min="0"
            value={formData.deposit}
            onChange={(e) => handleChange('deposit', parseInt(e.target.value, 10))}
            placeholder="e.g. 15000"
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 5. Dynamic Vacancies & Occupancy */}
      {isVacancyType ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Occupants
            </label>
            <input
              type="number"
              min="0"
              value={formData.currentOccupants}
              onChange={(e) => handleChange('currentOccupants', parseInt(e.target.value, 10))}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Vacancies Available *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.vacancies}
              onChange={(e) => handleChange('vacancies', parseInt(e.target.value, 10))}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Total Flat Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.totalCapacity}
              onChange={(e) => handleChange('totalCapacity', parseInt(e.target.value, 10))}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Move-in Date / Timeline *
            </label>
            <input
              type="text"
              required
              value={formData.moveInDate}
              onChange={(e) => handleChange('moveInDate', e.target.value)}
              placeholder="e.g. September 2026 / Immediately"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 6. Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Description & Details *
        </label>
        <textarea
          rows={4}
          required
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe amenities (WiFi, maid, washing machine, parking), flat environment, distance to MIT-ADT main gate, and preferences..."
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-brand-600 focus:outline-none"
        />
        <span className="text-[11px] text-slate-400 mt-1 block">
          🔒 For your privacy, do not write your phone number or flat number in the public description.
        </span>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving Listing...' : isEdit ? 'Update Listing' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
}
