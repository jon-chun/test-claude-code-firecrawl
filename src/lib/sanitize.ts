/**
 * Sanitization utilities for creating OS-friendly filenames
 */

/**
 * Converts search terms into OS-friendly filename component
 * - Collapses whitespace to single hyphen
 * - Converts to lowercase
 * - Removes all punctuation except hyphens
 * - Limits length to prevent filesystem issues
 *
 * @example
 * sanitizeSearchTerms("Machine Learning & AI!") → "machine-learning-ai"
 * sanitizeSearchTerms("  Multiple   Spaces  ") → "multiple-spaces"
 */
export function sanitizeSearchTerms(searchQuery: string): string {
  return searchQuery
    .toLowerCase()
    .trim()
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Remove all punctuation except hyphens
    .replace(/[^\w\s-]/g, '')
    // Collapse multiple hyphens to single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 100 characters for filesystem safety
    .slice(0, 100);
}

/**
 * Validates filename to prevent directory traversal attacks
 * @returns true if filename is safe, false otherwise
 */
export function isValidFilename(filename: string): boolean {
  // Check for directory traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  // Check for valid characters (alphanumeric, hyphens, underscores, dots)
  const validPattern = /^[a-zA-Z0-9_.-]+$/;
  if (!validPattern.test(filename)) {
    return false;
  }

  // Check length
  if (filename.length === 0 || filename.length > 255) {
    return false;
  }

  return true;
}
