'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  MapPin,
  IndianRupee,
  Upload,
  Check,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { PUNE_AREAS, FLAT_AMENITIES } from '@/lib/constants';

interface FlatListingFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function FlatListingForm({ initialData, isEdit = false }: FlatListingFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<any>(null);

  // Owner Info
  const [ownerName, setOwnerName] = useState(initialData?.owner?.profile?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(initialData?.owner?.profile?.phone || '');

  // Flat Basic Info
  const [title, setTitle] = useState(initialData?.title || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [location, setLocation] = useState(initialData?.location || PUNE_AREAS[0]);

  // Specifications
  const [bedrooms, setBedrooms] = useState<number>(initialData?.bedrooms || 2);
  const [bathrooms, setBathrooms] = useState<number>(initialData?.bathrooms || 2);
  const [furnishing, setFurnishing] = useState<string>(initialData?.furnishing || 'Semi-Furnished');
  const [availableRooms, setAvailableRooms] = useState<string>(initialData?.roomType || 'Private');
  const [preferredTenant, setPreferredTenant] = useState<string>(initialData?.preferredTenant || 'Students');
  const normalizeAmountInput = (val: string): string => {
    if (val === '') return '';
    const clean = val.replace(/[^\d]/g, '');
    if (clean === '') return '';
    return clean.replace(/^0+(?=\d)/, '');
  };

  // Pricing
  const [rent, setRent] = useState(initialData?.rent !== undefined ? normalizeAmountInput(String(initialData.rent)) : '');
  const [deposit, setDeposit] = useState(initialData?.deposit !== undefined ? normalizeAmountInput(String(initialData.deposit)) : '');
  const [maintenanceCharges, setMaintenanceCharges] = useState(initialData?.maintenanceCharges !== undefined ? normalizeAmountInput(String(initialData.maintenanceCharges)) : '');
  const [availableFrom, setAvailableFrom] = useState(initialData?.availableFrom || 'Immediately');

  // Amenities & Photos
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities ? JSON.parse(initialData.amenities) : ['wifi', 'refrigerator', 'washing_machine', 'lift']
  );
  const [photos, setPhotos] = useState<string[]>(
    initialData?.photos ? JSON.parse(initialData.photos) : []
  );

  // Description & Confirmation
  const [description, setDescription] = useState(initialData?.description || '');
  const [confirmed, setConfirmed] = useState(false);

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

    if (!title.trim() || !address.trim() || !location || !rent) {
      setError('Please fill in the flat title, address, location, and monthly rent');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a descriptive overview of the flat (at least 20 characters)');
      return;
    }

    if (!confirmed && !isEdit) {
      setError('Please confirm that the information provided is true and accurate');
      return;
    }

    setSubmitting(true);

    const parsedRent = parseInt(rent, 10);
    const parsedDeposit = deposit ? parseInt(deposit, 10) : 0;
    const parsedMaintenance = maintenanceCharges ? parseInt(maintenanceCharges, 10) : 0;

    const payload = {
      title: title.trim(),
      listingType: 'HAVE_VACANCY',
      accommodationType: 'Flat',
      roomType: availableRooms,
      location,
      address: address.trim(),
      rent: parsedRent,
      deposit: parsedDeposit,
      maintenanceCharges: parsedMaintenance,
      bedrooms,
      bathrooms,
      furnishing,
      preferredTenant,
      availableFrom,
      amenities: JSON.stringify(selectedAmenities),
      photos: JSON.stringify(photos),
      description: description.trim(),
      moveInDate: availableFrom,
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
        setError(data.error || 'Failed to submit flat listing');
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
            Your Flat details have been successfully posted. It will be published shortly after verifying the details.
          </p>
        </div>

        {/* Flat Profile Card with 🟡 Pending Badge */}
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
            <div className="h-32 w-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-4xl">
              🏡
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
              <span className="text-xs font-bold text-slate-700">{bedrooms} BHK • {furnishing}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-blue-700">₹{rent}/mo</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  router.push(`/manage/flat`);
                  router.refresh();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Manage Flat</span>
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

      {/* Section 2: Flat Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Home className="w-4 h-4" />
          <span>Flat Information</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Flat Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Spacious 2BHK in Gated Society Near MIT-ADT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bedrooms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Configuration</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
              >
                <option value={1}>1 BHK</option>
                <option value={2}>2 BHK</option>
                <option value={3}>3 BHK</option>
                <option value={4}>4 BHK+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Bathrooms</label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
              >
                <option value={1}>1 Bath</option>
                <option value={2}>2 Baths</option>
                <option value={3}>3 Baths+</option>
              </select>
            </div>

            {/* Furnishing */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Campus Area Location</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Detailed Address</label>
              <input
                type="text"
                placeholder="Building Name, Flat No, Society, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Rent, Deposit & Maintenance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <IndianRupee className="w-4 h-4" />
          <span>Pricing & Terms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Monthly Rent <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 18000"
                value={rent}
                onChange={(e) => setRent(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Deposit (If Any)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Optional"
                value={deposit}
                onChange={(e) => setDeposit(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Maintenance (If Any)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Optional"
                value={maintenanceCharges}
                onChange={(e) => setMaintenanceCharges(normalizeAmountInput(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Available From</label>
            <input
              type="text"
              placeholder="e.g. Immediately, 1st October 2026"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Preferred Tenants</label>
            <select
              value={preferredTenant}
              onChange={(e) => setPreferredTenant(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
            >
              <option value="Students">College Students</option>
              <option value="Boys Only">Boys Only</option>
              <option value="Girls Only">Girls Only</option>
              <option value="Anyone">Anyone (Students & Working)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 4: Photos */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Upload className="w-4 h-4" />
          <span>Flat Photos</span>
        </div>
        <p className="text-xs text-slate-500">
          Upload clear photos of bedrooms, living room, kitchen, and society view (up to 6 photos):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100">
              <img src={photo} alt={`Flat Photo ${index + 1}`} className="w-full h-full object-cover" />
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

      {/* Section 5: Amenities */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Flat Amenities</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FLAT_AMENITIES.map((amenity) => {
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
            Flat Description & Rules <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="e.g. Beautiful 2BHK flat available for MIT-ADT students in a secure society. Features modular kitchen, high-speed Wi-Fi, 24x7 water and power backup, lift, dedicated bike parking..."
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
              I confirm that the information provided in this form is true and accurately represents the residential flat.
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
            <span>Submitting Flat for verification...</span>
          </>
        ) : (
          <>
            <span>Submit Flat for Verification</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
