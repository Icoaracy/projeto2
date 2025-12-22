import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';
import { kv } from '@vercel/kv';

// Generate a cryptographically secure nonce for CSP
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Enhanced HTML sanitization using DOMPurify
export function sanitizeHtml(input: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }
  
  // Server-side fallback sanitization
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
}

// Validate email format with stricter regex
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Enhanced rate limiting with persistent storage using Vercel KV
export class RateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  // Validate and sanitize IP address
  private sanitizeIP(ip: string): string {
    if (!ip || ip === 'unknown') return 'unknown';
    
    // Remove potential injection attempts
    const cleanIP = ip.replace(/[^\d.:]/g, '').trim();
    
    // Basic IP validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (ipv4Regex.test(cleanIP) || ipv6Regex.test(cleanIP)) {
      return cleanIP;
    }
    
    return 'invalid';
  }

  async isAllowed(identifier: string): Promise<boolean> {
    const sanitizedIP = this.sanitizeIP(identifier);
    const now = Date.now();
    const key = `rate_limit:${sanitizedIP}`;
    const windowStart = now - this.windowMs;

    try {
      // Get existing requests from KV
      const existingData = await kv.get<{ timestamps: number[] }>(key);
      const timestamps = existingData?.timestamps || [];

      // Filter out old requests outside the window
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);

      // Check if limit exceeded
      if (validTimestamps.length >= this.maxRequests) {
        return false;
      }

      // Add current request timestamp
      validTimestamps.push(now);

      // Store updated timestamps with expiration
      await kv.set(key, { timestamps: validTimestamps }, { px: this.windowMs });

      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if KV is unavailable
      return true;
    }
  }

  // Method to get current rate limit status
  async getStatus(identifier: string): Promise<{ remaining: number; resetTime: number }> {
    const sanitizedIP = this.sanitizeIP(identifier);
    const now = Date.now();
    const key = `rate_limit:${sanitizedIP}`;
    const windowStart = now - this.windowMs;

    try {
      const existingData = await kv.get<{ timestamps: number[] }>(key);
      const timestamps = existingData?.timestamps || [];
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      
      const remaining = Math.max(0, this.maxRequests - validTimestamps.length);
      const resetTime = validTimestamps.length > 0 
        ? Math.min(...validTimestamps) + this.windowMs 
        : now + this.windowMs;

      return { remaining, resetTime };
    } catch (error) {
      console.error('Rate limit status error:', error);
      return { remaining: this.maxRequests, resetTime: now + this.windowMs };
    }
  }
}

// Enhanced CSRF protection using signed tokens
export class CSRFProtection {
  private static readonly SECRET_KEY = process.env.CSRF_SECRET || 'default-secret-key-change-in-production';
  private static readonly TOKEN_EXPIRY = 3600000; // 1 hour

  static generateToken(): string {
    const timestamp = Date.now();
    const random = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const payload = `${timestamp}.${random}`;
    const signature = CryptoJS.HmacSHA256(payload, this.SECRET_KEY).toString();
    
    return `${payload}.${signature}`;
  }

  static validateToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [timestampStr, random, signature] = parts;
    
    // Check timestamp
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > this.TOKEN_EXPIRY) {
      return false;
    }

    // Verify signature
    const payload = `${timestampStr}.${random}`;
    const expectedSignature = CryptoJS.HmacSHA256(payload, this.SECRET_KEY).toString();
    
    return CryptoJS.HmacSHA256(payload, this.SECRET_KEY).toString() === signature;
  }
}

// Generic error messages to prevent information disclosure
export const SECURITY_MESSAGES = {
  GENERIC_ERROR: 'Request failed. Please try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  INVALID_TOKEN: 'Invalid request. Please refresh the page.',
  VALIDATION_ERROR: 'Invalid input provided.',
  SERVER_ERROR: 'An error occurred. Please try again later.'
} as const;

// Constant-time comparison to prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

// Add random jitter to prevent timing analysis
export function addRandomJitter(baseDelay: number = 500): number {
  const jitter = Math.random() * 200; // 0-200ms jitter
  return baseDelay + jitter;
}

// NEW: Recursive validation and sanitization for nested objects
interface ValidationSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
  properties?: Record<string, ValidationSchema>;
  items?: ValidationSchema;
}

// Schema definitions for different endpoints
export const SCHEMAS = {
  contact: {
    type: 'object',
    required: true,
    properties: {
      name: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 100,
        sanitize: true,
        pattern: /^[a-zA-Z\s'-]+$/
      },
      email: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 254,
        sanitize: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      message: {
        type: 'string',
        required: true,
        minLength: 10,
        maxLength: 2000,
        sanitize: true
      }
    }
  },
  improveText: {
    type: 'object',
    required: true,
    properties: {
      text: {
        type: 'string',
        required: true,
        minLength: 10,
        maxLength: 5000,
        sanitize: true
      },
      context: {
        type: 'string',
        required: false,
        maxLength: 100,
        sanitize: true
      }
    }
  }
} as const;

// Recursive validation and sanitization function
export function validateAndSanitize(data: any, schema: ValidationSchema): any {
  // Type validation
  if (schema.type === 'string') {
    if (typeof data !== 'string') {
      throw new Error('Expected string value');
    }

    let sanitized = data;

    // Apply sanitization if required
    if (schema.sanitize) {
      sanitized = sanitizeHtml(sanitized);
    }

    // Length validation
    if (schema.minLength !== undefined && sanitized.length < schema.minLength) {
      throw new Error(`Value too short (minimum ${schema.minLength} characters)`);
    }

    if (schema.maxLength !== undefined && sanitized.length > schema.maxLength) {
      throw new Error(`Value too long (maximum ${schema.maxLength} characters)`);
    }

    // Pattern validation
    if (schema.pattern && !schema.pattern.test(sanitized)) {
      throw new Error('Invalid format');
    }

    return sanitized;
  }

  if (schema.type === 'number') {
    if (typeof data !== 'number') {
      throw new Error('Expected number value');
    }
    return data;
  }

  if (schema.type === 'boolean') {
    if (typeof data !== 'boolean') {
      throw new Error('Expected boolean value');
    }
    return data;
  }

  if (schema.type === 'object') {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new Error('Expected object value');
    }

    const result: any = {};

    // Validate each property against schema
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        // Check if required property is missing
        if (propSchema.required && !(key in data)) {
          throw new Error(`Required property '${key}' is missing`);
        }

        // Only validate if property exists
        if (key in data) {
          result[key] = validateAndSanitize(data[key], propSchema);
        }
      }
    }

    // Remove any unexpected properties (whitelist approach)
    for (const key of Object.keys(data)) {
      if (!schema.properties || !(key in schema.properties)) {
        console.warn(`Removing unexpected property: ${key}`);
        // Don't include unexpected properties in result
      }
    }

    return result;
  }

  if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      throw new Error('Expected array value');
    }

    if (schema.items) {
      return data.map(item => validateAndSanitize(item, schema.items!));
    }

    return data;
  }

  throw new Error(`Unsupported schema type: ${(schema as any).type}`);
}

// Generic validation middleware for API endpoints
export function validateRequestBody(schema: ValidationSchema) {
  return (req: any, res: any, next: any) => {
    try {
      // Validate and sanitize the entire request body
      req.body = validateAndSanitize(req.body, schema);
      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(400).json({ 
        error: SECURITY_MESSAGES.VALIDATION_ERROR,
        details: error instanceof Error ? error.message : 'Invalid input'
      });
    }
  };
}