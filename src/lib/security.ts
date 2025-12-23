// Client-side security utilities - browser compatible only

// Generate a cryptographically secure nonce for CSP using Web Crypto API
export function generateNonce(): string {
  if (typeof window === 'undefined' || !window.crypto) {
    // Fallback for server-side rendering or unsupported browsers
    return Math.random().toString(36).substring(2, 18);
  }
  
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Enhanced HTML sanitization using basic approach
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Basic client-side sanitization - server should do thorough sanitization
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// Validate email format with stricter regex
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Generate secure random string using Web Crypto API
export function generateSecureRandom(length: number = 32): string {
  if (typeof window === 'undefined' || !window.crypto) {
    // Fallback for server-side rendering
    return Math.random().toString(36).substring(2, 2 + length);
  }
  
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Generic error messages to prevent information disclosure
export const SECURITY_MESSAGES = {
  GENERIC_ERROR: 'Request failed. Please try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  INVALID_TOKEN: 'Invalid request. Please refresh the page.',
  VALIDATION_ERROR: 'Invalid input provided.',
  SERVER_ERROR: 'An error occurred. Please try again later.'
} as const;

// Basic XSS prevention for client-side
export function preventXSS(input: string): string {
  return sanitizeHtml(input);
}

// Check if running in browser environment
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}