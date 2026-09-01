'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LISTING_TYPES,
  ACCOMMODATION_TYPES,
  ROOM_TYPES,
  PUNE_AREAS,
} from '@/lib/constants';
import { Save, AlertCircle, CheckCircle2, Building, Calendar, IndianRupee, Users, ArrowRight } from 'lucide-react';
import NumericInput from '@/components/ui/NumericInput';
import MoveInDateSelector from '@/components/listings/MoveInDateSelector';
import { normalizeNumericInput, parseNumericValue } from '@/lib/numberUtils';

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
    rent: initialData?.rent !== undefined ? normalizeNumericInput(initialData.rent) : '7500',
    deposit: initialData?.deposit !== undefined ? normalizeNumericInput(initialData.deposit) : '15000',
    currentOccupants: initialData?.currentOccupants !== undefined ? normalizeNumericInput(initialData.currentOccupants) : '2',
    vacancies: initialData?.vacancies !== undefined ? normalizeNumericInput(initialData.vacancies) : '1',
    totalCapacity: initialData?.totalCapacity !== undefined ? normalizeNumericInput(initialData.totalCapacity) : '3',
    moveInDate: initialData?.moveInDate || 'IMMEDIATELY',
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

    const parsedRent = parseNumericValue(formData.rent, 0);
    const parsedDeposit = parseNumericValue(formData.deposit, 0);
    const parsedOccupants = parseNumericValue(formData.currentOccupants, 0);
    const parsedVacancies = parseNumericValue(formData.vacancies, 1);
    const parsedCapacity = parseNumericValue(formData.totalCapacity, parsedOccupants + parsedVacancies);

    if (parsedRent < 0 || parsedDeposit < 0 || parsedOccupants < 0 || parsedVacancies < 1 || parsedCapacity < 1) {
      setError('Rent, deposit, occupants cannot be negative, and vacancies/capacity must be at least 1');
      setLoading(false);
      return;
    }

    try {
      const url = isEdit ? `/api/listings/${initialData.id}` : '/api/listings';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rent: parsedRent,
          deposit: parsedDeposit,
          currentOccupants: parsedOccupants,
          vacancies: parsedVacancies,
          totalCapacity: parsedCapacity,
        }),
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#DADCE0] p-6 sm:p-8 shadow-sm space-y-6">
      {error && (
        <div className="bg-[#FCE8E6] border border-[#FAD2CF] text-[#C5221F] text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#34A853] flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Basic Info: Title & Listing Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Listing Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. 1 Vacancy in 2BHK Flat near Gate 2, MIT-ADT"
            className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Listing Type *
          </label>
          <select
            value={formData.listingType}
            onChange={(e) => handleChange('listingType', e.target.value)}
            className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
          >
            {Object.entries(LISTING_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Core Property Specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Property Type *
          </label>
          <select
            value={formData.accommodationType}
            onChange={(e) => handleChange('accommodationType', e.target.value)}
            className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
          >
            {ACCOMMODATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Room Type *
          </label>
          <select
            value={formData.roomType}
            onChange={(e) => handleChange('roomType', e.target.value)}
            className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
          >
            {ROOM_TYPES.map((r) => (
              <option key={r} value={r}>
                {r} Room
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Campus Area Location *
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold cursor-pointer"
          >
            {PUNE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Monthly Rent per Person (₹) *
          </label>
          <NumericInput
            required
            value={formData.rent}
            onChangeValue={(val) => handleChange('rent', val)}
            prefix="₹"
            placeholder="e.g. 7500"
            className="bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Deposit (If Any) (₹)
          </label>
          <NumericInput
            value={formData.deposit}
            onChangeValue={(val) => handleChange('deposit', val)}
            prefix="₹"
            placeholder="e.g. 15000"
            className="bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white"
          />
        </div>
      </div>

      {/* 5. Occupancy Details & Move-In Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Current Occupants
          </label>
          <NumericInput
            value={formData.currentOccupants}
            onChangeValue={(val) => handleChange('currentOccupants', val)}
            placeholder="e.g. 2"
            className="bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#202124]">
            Available Vacancies
          </label>
          <NumericInput
            value={formData.vacancies}
            onChangeValue={(val) => handleChange('vacancies', val)}
            placeholder="e.g. 1"
            className="bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-3 text-[#202124] focus:bg-white"
          />
        </div>

        <div className="space-y-1">
          <MoveInDateSelector
            value={formData.moveInDate}
            onChange={(val) => handleChange('moveInDate', val)}
            label="Move-in Date / Period"
          />
        </div>
      </div>

      {/* 6. Description */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#202124]">
          Detailed Description & Student Preferences *
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the flat features, study habits, room amenities, Wi-Fi speed, nearby mess/cafe, etc."
          className="w-full text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-4 text-[#202124] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-semibold leading-relaxed"
        />
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'Publishing...' : isEdit ? 'Save Changes' : 'Publish Vacancy'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
