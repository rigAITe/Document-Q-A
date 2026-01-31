/**
 * Security utilities for display-safe strings (defense in depth).
 * React escapes by default; these helpers strip control characters and limit length.
 */

/** Control characters and other unsafe chars for display (C0, C1, and common problematic chars). */
const CONTROL_AND_UNSAFE =
  /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u2028\u2029\uFEFF]/gu;

/** Max length for display strings to mitigate layout/DoS from huge names. */
const MAX_DISPLAY_LENGTH = 500;

/**
 * Sanitizes a string for safe display: strips control characters and truncates.
 * Use for user-controlled content (file names, toast messages) shown in the UI.
 */
export function sanitizeDisplayString(value: string, maxLength = MAX_DISPLAY_LENGTH): string {
  if (typeof value !== 'string') return '';
  const stripped = value.replace(CONTROL_AND_UNSAFE, '');
  return stripped.length > maxLength ? stripped.slice(0, maxLength) + '\u2026' : stripped;
}
