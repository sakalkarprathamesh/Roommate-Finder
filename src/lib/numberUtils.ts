/**
 * Centralized Numeric Utilities for Roomie Form Inputs
 */

/**
 * Normalizes user numeric input while typing.
 * - Allows empty string "" so users can delete and re-type freely.
 * - Strips non-digit characters.
 * - Removes unnecessary leading zeros: "08000" -> "8000", "010000" -> "10000", "01" -> "1".
 * - Preserves "0" when the user explicitly enters "0" (e.g. 0 deposit or 0 occupants).
 */
export function normalizeNumericInput(val: string | number | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  const str = String(val);
  const clean = str.replace(/[^\d]/g, '');
  if (clean === '') return '';
  return clean.replace(/^0+(?=\d)/, '');
}

/**
 * Parses numeric input for API payload submission or state calculation.
 * If empty or invalid, falls back to the specified fallback value (default 0).
 */
export function parseNumericValue(val: string | number | undefined | null, fallback = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  const parsed = parseInt(String(val).replace(/[^\d]/g, ''), 10);
  return isNaN(parsed) ? fallback : parsed;
}
