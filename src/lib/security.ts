// Client-side security utilities using browser-compatible APIs

// Generate a cryptographically secure random string using Web Crypto API
export function generateSecureToken(length: number = 32): string {
  if (typeof window === 'undefined' || !window.crypto) {
    // Fallback for server-side rendering or unsupported browsers
    return Math.random().toString(36).substring(2, length + 2);
  }
  
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Enhanced HTML sanitization to prevent XSS
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Prevent JavaScript protocol injection
    .replace(/javascript:/gi, '')
    // Prevent data URL injection
    .replace(/data:/gi, '')
    // Prevent vbscript injection
    .replace(/vbscript:/gi, '');
}

// Enhanced email validation
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Length check
  if (email.length > 254) return false;
  
  // Additional checks for common patterns
  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) return false;
  if (domain.length > 253) return false;
  
  return true;
}

// Generate nonce for CSP
export function generateNonce(): string {
  return generateSecureToken(16);
}

// Client-side form validation
export function validateFormInput(value: string, type: 'name' | 'email' | 'message'): { isValid: boolean; error?: string } {
  const trimmed = value.trim();
  
  switch (type) {
    case 'name':
      if (!trimmed) return { isValid: false, error: 'Name is required' };
      if (trimmed.length > 100) return { isValid: false, error: 'Name must be less than 100 characters' };
      if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
      }
      return { isValid: true };
      
    case 'email':
      if (!trimmed) return { isValid: false, error: 'Email is required' };
      if (!validateEmail(trimmed)) return { isValid: false, error: 'Please enter a valid email address' };
      return { isValid: true };
      
    case 'message':
      if (!trimmed) return { isValid: false, error: 'Message is required' };
      if (trimmed.length < 10) return { isValid: false, error: 'Message must be at least 10 characters' };
      if (trimmed.length > 2000) return { isValid: false, error: 'Message must be less than 2000 characters' };
      return { isValid: true };
      
    default:
      return { isValid: false, error: 'Invalid input type' };
  }
}