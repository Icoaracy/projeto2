import { RateLimiter } from './security';
import { getClientIP } from './security';

// Initialize rate limiter: 5 requests per minute per IP
const rateLimiter = new RateLimiter(5, 60000);

export default function handler(req: any, res: any) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Request failed' });
  }

  try {
    const clientIP = getClientIP(req);
    const remainingRequests = rateLimiter.getRemainingRequests(clientIP);
    
    res.status(200).json({ 
      success: true,
      remainingRequests: remainingRequests,
      maxRequests: 5,
      windowMs: 60000
    });
  } catch (error) {
    console.error('Rate limit check error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    res.status(500).json({ 
      error: 'Request failed' 
    });
  }
}