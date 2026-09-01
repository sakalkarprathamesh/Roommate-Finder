'use client';

import React from 'react';
import { normalizeNumericInput } from '@/lib/numberUtils';

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'prefix'> {
  value: string | number | undefined | null;
  onChangeValue: (val: string) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeValue,
  prefix,
  suffix,
  className = '',
  placeholder,
  disabled,
  required,
  ...rest
}) => {
  const displayValue = value === undefined || value === null ? '' : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = normalizeNumericInput(e.target.value);
    onChangeValue(clean);
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
          {prefix}
        </div>
      )}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full transition-colors text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          prefix ? 'pl-8' : 'px-3'
        } ${suffix ? 'pr-8' : 'pr-3'} ${className}`}
        {...rest}
      />
      {suffix && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 font-medium text-xs">
          {suffix}
        </div>
      )}
    </div>
  );
};

export default NumericInput;
