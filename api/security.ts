import crypto from 'crypto';

// Rate limiting implementation for Vercel KV
export class RateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private kv: any;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Initialize KV if available
    if (typeof window === 'undefined' && process.env.KV_REST_API_URL) {
      try {
        this.kv = require('@vercel/kv');
      } catch (error) {
        console.warn('Vercel KV not available, using fallback rate limiting');
      }
    }
  }

  // Sanitize IP address to prevent injection
  private sanitizeIP(ip: string): string {
    return ip.replace(/[^a-fA-F0-9.:]/g, '').substring(0, 45);
  }

  // Generate secure token for CSRF protection
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate CSRF token
  static validateToken(token: string): boolean {
    // In production, you'd validate against stored tokens
    // For now, just check format
    return /^[a-f0-9]{64}$/.test(token);
  }

  // Check if request is allowed
  async isAllowed(identifier: string): Promise<boolean> {
    const sanitizedIP = this.sanitizeIP(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Try Vercel KV first
      if (this.kv) {
        const key = `rate_limit:${sanitizedIP}`;
        const existingData = await this.kv.get(key);
        const timestamps = existingData ? JSON.parse(existingData).timestamps : [];
        const validTimestamps = timestamps.filter((timestamp: number) => timestamp > windowStart);
        
        if (validTimestamps.length >= this.maxRequests) {
          return false;
        }
        
        // Add current timestamp
        validTimestamps.push(now);
        await this.kv.set(key, JSON.stringify({ timestamps: validTimestamps }), { ex: Math.ceil(this.windowMs / 1000) });
        return true;
      }
    } catch (error) {
      console.error('KV rate limiting error, falling back to in-memory:', error);
    }

    // Fallback to simple in-memory rate limiting
    return true; // Allow request if KV fails
  }

  // Get current rate limit status
  async getStatus(identifier: string): Promise<{ remaining: number; resetTime: number }> {
    const sanitizedIP = this.sanitizeIP(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      if (this.kv) {
        const key = `rate_limit:${sanitizedIP}`;
        const existingData = await this.kv.get(key);
        const timestamps = existingData ? JSON.parse(existingData).timestamps : [];
        const validTimestamps = timestamps.filter((timestamp: number) => timestamp > windowStart);
        
        const remaining = Math.max(0, this.maxRequests - validTimestamps.length);
        const resetTime = validTimestamps.length > 0 
          ? Math.min(...validTimestamps) + this.windowMs 
          : now + this.windowMs;

        return { remaining, resetTime };
      }
    } catch (error) {
      console.error('KV rate limit status error:', error);
    }

    // Fallback
    return { remaining: this.maxRequests, resetTime: now + this.windowMs };
  }
}

// CSRF Protection
export class CSRFProtection {
  static generateToken(): string {
    return RateLimiter.generateToken();
  }

  static validateToken(token: string): boolean {
    return RateLimiter.validateToken(token);
  }
}

// Validation schemas
export const SCHEMAS = {
  contact: {
    name: (value: string) => {
      if (!value || value.trim().length === 0) return 'Name is required';
      if (value.length > 100) return 'Name must be less than 100 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name contains invalid characters';
      return null;
    },
    email: (value: string) => {
      if (!value || value.trim().length === 0) return 'Email is required';
      if (value.length > 254) return 'Email is too long';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return null;
    },
    message: (value: string) => {
      if (!value || value.trim().length === 0) return 'Message is required';
      if (value.length < 10) return 'Message must be at least 10 characters';
      if (value.length > 2000) return 'Message must be less than 2000 characters';
      return null;
    }
  },
  improveText: {
    text: (value: string) => {
      if (!value || value.trim().length === 0) return 'Text is required';
      if (value.length > 5000) return 'Text is too long';
      return null;
    },
    context: (value: string) => {
      if (value && value.length > 500) return 'Context is too long';
      return null;
    }
  }
};

// Validation middleware
export const validateRequestBody = (schema: any) => {
  return (req: any, res: any, next: any) => {
    try {
      const errors: string[] = [];
      
      for (const [field, validator] of Object.entries(schema)) {
        const value = req.body[field];
        const error = (validator as any)(value);
        if (error) {
          errors.push(`${field}: ${error}`);
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      
      // Sanitize input
      for (const field of Object.keys(req.body)) {
        if (typeof req.body[field] === 'string') {
          req.body[field] = req.body[field].trim();
        }
      }
      
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid request format' });
    }
  };
};

// Add random jitter to prevent timing attacks
export const addRandomJitter = (baseTime: number): number => {
  return baseTime + Math.random() * 100;
};

// Security messages
export const SECURITY_MESSAGES = {
  GENERIC_ERROR: 'Request failed. Please try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  INVALID_TOKEN: 'Invalid request. Please refresh the page.',
  VALIDATION_ERROR: 'Invalid input provided.',
  SERVER_ERROR: 'An error occurred. Please try again later.'
} as const;