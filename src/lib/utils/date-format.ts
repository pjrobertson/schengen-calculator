/**
 * Format a date using the system locale
 * @param date - The date to format
 * @param style - 'short' for compact format (e.g., 1/15/25), 'medium' for readable format (e.g., Jan 15, 2025), 'long' for month/year (e.g., January 2025)
 */
export function formatLocaleDate(date: Date, style: 'short' | 'medium' | 'long' = 'medium'): string {
  if (style === 'short') {
    return date.toLocaleDateString(undefined, {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    });
  } else if (style === 'medium') {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } else {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    });
  }
}
