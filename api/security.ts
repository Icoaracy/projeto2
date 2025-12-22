// ... (keep all existing code) ...

  // Method to get current rate limit status
  async getStatus(identifier: string): Promise<{ remaining: number; resetTime: number }> {
    const sanitizedIP = this.sanitizeIP(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Try Vercel KV first
      const key = `rate_limit:${sanitizedIP}`;
      const existingData = await kv.get<{ timestamps: number[] }>(key);
      const timestamps = existingData?.timestamps || [];
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      
      const remaining = Math.max(0, this.maxRequests - validTimestamps.length);
      const resetTime = validTimestamps.length > 0 
        ? Math.min(...validTimestamps) + this.windowMs 
        : now + this.windowMs;

      return { remaining, resetTime };
    } catch (error) {
      console.error('KV rate limit status error, falling back to in-memory:', error);
      
      // Fallback to in-memory rate limiter
      return this.fallbackLimiter.getStatus(sanitizedIP, this.maxRequests, this.windowMs);
    }
  }