/**
 * Datetime utility functions for consistent timestamp formatting
 * Used across logging, filenames, and reports
 */

/**
 * Formats current date/time for filenames (OS-safe)
 * @returns String like "2025-10-20_14-30-45"
 */
export function getDatetimeString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Formats date for human-readable display
 * @returns String like "October 20, 2025 at 2:30 PM"
 */
export function formatDatetimeHuman(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Formats date for log entries
 * @returns String like "[2025-10-20 14:30:45]"
 */
export function formatDatetimeLog(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

/**
 * Formats date for ISO 8601 storage
 * @returns String like "2025-10-20T14:30:45.000Z"
 */
export function formatDatetimeISO(date: Date = new Date()): string {
  return date.toISOString();
}
