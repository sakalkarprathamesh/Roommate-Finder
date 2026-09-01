'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  MapPin,
  IndianRupee,
  Upload,
  Check,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { PUNE_AREAS, PG_AMENITIES } from '@/lib/constants';

interface PGListingFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function PGListingForm({ initialData, isEdit = false }: PGListingFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<any>(null);

  // Owner Info
  const [ownerName, setOwnerName] = useState(initialData?.owner?.profile?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(initialData?.owner?.profile?.phone || '');

  // PG Info
  const [title, setTitle] = useState(initialData?.title || '');
  const [pgType, setPgType] = useState(initialData?.pgType || 'Both');
  const [address, setAddress] = useState(initialData?.address || '');
  const [location, setLocation] = useState(initialData?.location || PUNE_AREAS[0]);
  const normalizeAmountInput = (val: string): string => {
    if (val === '') return '';
    const clean = val.replace(/[^\d]/g, '');
    if (clean === '') return '';
    return clean.replace(/^0+(?=\d)/, '');
  };

  // Occupancy & Pricing
  const [singleRent, setSingleRent] = useState(initialData?.singleRent !== undefined ? normalizeAmountInput(String(initialData.singleRent)) : '');
  const [doubleRent, setDoubleRent] = useState(initialData?.doubleRent !== undefined ? normalizeAmountInput(String(initialData.doubleRent)) : '');
  const [tripleRent, setTripleRent] = useState(initialData?.tripleRent !== undefined ? normalizeAmountInput(String(initialData.tripleRent)) : '');
  const [deposit, setDeposit] = useState(initialData?.deposit !== undefined ? normalizeAmountInput(String(initialData.deposit)) : '');
  const [maintenanceCharges, setMaintenanceCharges] = useState(initialData?.maintenanceCharges !== undefined ? normalizeAmountInput(String(initialData.maintenanceCharges)) : '');
  const [noticePeriod, setNoticePeriod] = useState(initialData?.noticePeriod || '1 Month');

  // Amenities & Photos
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities ? JSON.parse(initialData.amenities) : ['wifi', 'cctv', 'water_purifier']
  );
  const [photos, setPhotos] = useState<string[]>(
    initialData?.photos ? JSON.parse(initialData.photos) : []
  );

  // Description & Confirmation
  const [description, setDescription] = useState(initialData?.description || '');
  const [confirmed, setConfirmed] = useState(false);

  // Fetch logged in user to pre-fill owner details
  useEffect(() => {
    if (!initialData) {
      setLoading(true);
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.profile) {
            setOwnerName(data.user.profile.name || '');
            setOwnerPhone(data.user.profile.phone || '');
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialData]);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 6 - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotos((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !address.trim() || !location) {
      setError('Please fill in the PG name, address, and location area');
      return;
    }

    if (!singleRent && !doubleRent && !tripleRent) {
      setError('Please provide rent pricing for at least one occupancy type (Single, Double, or Triple)');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a descriptive overview of the PG (at least 20 characters)');
      return;
    }

    if (!confirmed && !isEdit) {
      setError('Please confirm that the information provided is true and accurate');
      return;
    }

    setSubmitting(true);

    const baseRent = parseInt(singleRent || doubleRent || tripleRent || '0', 10);
    const parsedDeposit = deposit ? parseInt(deposit, 10) : 0;
    const parsedMaintenance = maintenanceCharges ? parseInt(maintenanceCharges, 10) : 0;

    const payload = {
      title: title.trim(),
      listingType: 'HAVE_VACANCY',
      accommodationType: 'PG',
      roomType: singleRent ? 'Single' : doubleRent ? 'Double' : 'Shared',
      location,
      address: address.trim(),
      rent: baseRent,
      deposit: parsedDeposit,
      singleRent: singleRent ? parseInt(singleRent, 10) : null,
      doubleRent: doubleRent ? parseInt(doubleRent, 10) : null,
      tripleRent: tripleRent ? parseInt(tripleRent, 10) : null,
      maintenanceCharges: parsedMaintenance,
      noticePeriod,
      pgType,
      amenities: JSON.stringify(selectedAmenities),
      photos: JSON.stringify(photos),
      description: description.trim(),
      moveInDate: 'Immediately',
      status: 'PENDING_VERIFICATION',
    };

    try {
      const url = isEdit ? `/api/listings/${initialData.id}` : '/api/listings';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit PG listing');
        setSubmitting(false);
        return;
      }

      setSubmittedListing(data.listing);
      setIsSuccess(true);
      setSubmitting(false);
    } catch (err) {
      setError('Network error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (isSuccess && submittedListing) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-xs">
          🎉
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Successfully Submitted
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your PG details have been successfully posted. It will be published shortly after verifying the details.
          </p>
        </div>

        {/* PG Profile Card with 🟡 Pending Badge */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm max-w-md mx-auto text-left">
          {photos.length > 0 ? (
            <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
              <img src={photos[0]} alt={title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                <span>🟡</span>
                <span>Verification Pending</span>
              </div>
            </div>
          ) : (
            <div className="h-32 w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-4xl">
              🏢
            </div>
          )}

          <div className="p-6 space-y-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">{title}</h2>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{address}, {location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Type: {pgType} PG</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-blue-700">
                ₹{singleRent || doubleRent || tripleRent}/mo
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  router.push(`/manage/pg`);
                  router.refresh();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Manage PG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Owner Information */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Owner Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
            <input
              type="tel"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              placeholder="10-digit mobile number"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 2: PG Property Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Building className="w-4 h-4" />
          <span>PG Information</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              PG Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sunrise Luxury Student PG"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PG Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                PG Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Boys', 'Girls', 'Both'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPgType(type)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      pgType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Area Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Campus Location Area <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
              >
                {PUNE_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Detailed PG Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Near MIT-ADT Gate 2, Loni Kalbhor, Pune"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 3: Occupancy & Rent (Single / Double / Triple) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <IndianRupee className="w-4 h-4" />
          <span>Occupancy & Pricing</span>
        </div>
        <p className="text-xs text-slate-500">
          Enter monthly rent per student for the available occupancy configurations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Single */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">Single Occupancy</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 10000"
                value={singleRent}
                onChange={(e) => setSingleRent(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">₹/month</span>
          </div>

          {/* Double */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">Double Occupancy</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 6500"
                value={doubleRent}
                onChange={(e) => setDoubleRent(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">₹/month per bed</span>
          </div>

          {/* Triple */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">Triple Occupancy</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 5000"
                value={tripleRent}
                onChange={(e) => setTripleRent(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">₹/month per bed</span>
          </div>
        </div>

        {/* Deposit & Other details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Deposit (If Any)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Optional (e.g. 5000)"
                value={deposit}
                onChange={(e) => setDeposit(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Maintenance Charges (If Any)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Optional (e.g. 500)"
                value={maintenanceCharges}
                onChange={(e) => setMaintenanceCharges(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Notice Period</label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
            >
              <option value="15 Days">15 Days</option>
              <option value="1 Month">1 Month</option>
              <option value="2 Months">2 Months</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 4: PG Photos */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Upload className="w-4 h-4" />
          <span>Upload Photos of your PG</span>
        </div>
        <p className="text-xs text-slate-500">
          Upload clear photos of the rooms, washrooms, dining, and building facade (up to 6 photos):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100">
              <img src={photo} alt={`PG Photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {photos.length < 6 && (
            <label className="aspect-video border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all p-3 group">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Add Photo</span>
              <span className="text-[10px] text-slate-400">Max 5MB</span>
            </label>
          )}
        </div>
      </div>

      {/* Section 5: Amenities (Icon Selection) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>PG Amenities & Facilities</span>
        </div>
        <p className="text-xs text-slate-500">
          Select all the facilities available at your PG:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PG_AMENITIES.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-left cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{amenity.emoji}</span>
                <span className="text-xs truncate">{amenity.label}</span>
                {isSelected && (
                  <Check className="w-3 h-3 text-blue-600 ml-auto flex-shrink-0 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 6: Description & Confirmation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            PG Description & Rules <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Mention gate timings, food availability, laundry, nearby college distance, and house rules.
          </p>
          <textarea
            rows={4}
            placeholder="e.g. Spacious and hygienic PG for MIT-ADT students. Includes 3 times home-style meals, 24x7 Wi-Fi, hot water, daily room cleaning, and zero brokerage..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            required
          />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs font-semibold text-slate-700 leading-relaxed">
              I confirm that the information provided in this form is true and accurately represents the PG accommodation.
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || (!confirmed && !isEdit)}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting PG for verification...</span>
          </>
        ) : (
          <>
            <span>Submit PG for Verification</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
