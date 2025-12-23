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

// Generate cryptographically secure hash using Web Crypto API
export async function generateHash(data: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback for server-side rendering or unsupported browsers
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate secure token for CSRF protection
export async function generateCSRFToken(): Promise<string> {
  const randomData = generateSecureRandom(32);
  const timestamp = Date.now().toString();
  const combined = `${randomData}-${timestamp}`;
  return await generateHash(combined);
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

// Rate limiting helper using Web Crypto API for secure token generation
export class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  getStatus(identifier: string): { remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    const remaining = Math.max(0, this.maxRequests - validRequests.length);
    const resetTime = validRequests.length > 0 
      ? Math.min(...validRequests) + this.windowMs 
      : now + this.windowMs;

    return { remaining, resetTime };
  }
}