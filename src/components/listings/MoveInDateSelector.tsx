'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { MOVE_IN_OPTIONS } from '@/lib/constants';

interface MoveInDateSelectorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export const MoveInDateSelector: React.FC<MoveInDateSelectorProps> = ({
  value,
  onChange,
  label = 'Move-in Date / Period',
  required = false,
}) => {
  // Determine if value is a known option or specific date format
  const isDatePattern = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const matchedPredefined = MOVE_IN_OPTIONS.find((opt) => opt.value === value);

  const initialSelect = matchedPredefined
    ? matchedPredefined.value
    : isDatePattern
    ? 'SPECIFIC_DATE'
    : value === 'Immediately'
    ? 'IMMEDIATELY'
    : value || 'IMMEDIATELY';

  const [selectedOption, setSelectedOption] = useState<string>(
    initialSelect === 'SPECIFIC_DATE' || MOVE_IN_OPTIONS.some((o) => o.value === initialSelect)
      ? initialSelect
      : 'SPECIFIC_DATE'
  );

  const [specificDate, setSpecificDate] = useState<string>(
    isDatePattern ? value : new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (value) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        setSelectedOption('SPECIFIC_DATE');
        setSpecificDate(value);
      } else if (MOVE_IN_OPTIONS.some((o) => o.value === value)) {
        setSelectedOption(value);
      } else if (value.toLowerCase() === 'immediately') {
        setSelectedOption('IMMEDIATELY');
      }
    }
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextOption = e.target.value;
    setSelectedOption(nextOption);

    if (nextOption === 'SPECIFIC_DATE') {
      onChange(specificDate);
    } else {
      onChange(nextOption);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSpecificDate(newDate);
    onChange(newDate);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-[#E8EAED]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="grid grid-cols-1 gap-2">
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="w-full text-xs bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl p-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#303134] focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold cursor-pointer"
        >
          {MOVE_IN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {selectedOption === 'SPECIFIC_DATE' && (
          <div className="relative animate-in fade-in zoom-in-95 duration-150">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <input
              type="date"
              min={todayStr}
              value={specificDate}
              onChange={handleDateChange}
              required={required}
              className="w-full text-xs bg-white dark:bg-[#303134] border border-slate-300 dark:border-[#5F6368] rounded-2xl p-3 pl-9 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold cursor-pointer shadow-2xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveInDateSelector;
