import { randomBytes } from 'crypto';

// Server-side rate limiting using in-memory storage with proper cleanup
export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const existing = this.requests.get(identifier);
    
    if (!existing || now > existing.resetTime) {
      // New window or expired window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }
    
    if (existing.count >= this.maxRequests) {
      return false;
    }
    
    existing.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const existing = this.requests.get(identifier);
    
    if (!existing || now > existing.resetTime) {
      return this.maxRequests;
    }
    
    return Math.max(0, this.maxRequests - existing.count);
  }
}

// Enhanced CSRF protection using signed tokens
export class CSRFProtection {
  private static readonly SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');
  private static readonly TOKEN_EXPIRY = 3600000; // 1 hour

  static generateToken(): string {
    const timestamp = Date.now();
    const data = `${timestamp}.${randomBytes(16).toString('hex')}`;
    const signature = this.sign(data);
    return `${data}.${signature}`;
  }

  static validateToken(token: string): boolean {
    try {
      const [timestamp, random, signature] = token.split('.');
      
      // Check token format
      if (!timestamp || !random || !signature) {
        return false;
      }

      // Check token expiry
      const tokenTime = parseInt(timestamp);
      if (Date.now() - tokenTime > this.TOKEN_EXPIRY) {
        return false;
      }

      // Verify signature
      const data = `${timestamp}.${random}`;
      const expectedSignature = this.sign(data);
      
      return this.constantTimeCompare(signature, expectedSignature);
    } catch {
      return false;
    }
  }

  private static sign(data: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', this.SECRET).update(data).digest('hex');
  }

  private static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
}

// Enhanced HTML sanitization for server-side
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
    .replace(/vbscript:/gi, '')
    // Remove potential script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\bon\w+\s*=/gi, '');
}

// Enhanced email validation for server-side
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  
  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) return false;
  if (domain.length > 253) return false;
  
  return true;
}

// Get reliable client IP
export function getClientIP(req: any): string {
  // Try to get the most reliable IP address
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    const ips = forwarded.split(',').map((ip: string) => ip.trim());
    return ips[0];
  }
  
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }
  
  return req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.ip || 
         'unknown';
}

// Constant-time comparison to prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}