import { RateLimiter, CSRFProtection, sanitizeHtml, validateEmail, SECURITY_MESSAGES, addRandomJitter } from './security';

// Initialize rate limiter: 5 requests per minute per IP
const rateLimiter = new RateLimiter(5, 60000);

export default async function handler(req: any, res: any) {
  // Set comprehensive security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: SECURITY_MESSAGES.GENERIC_ERROR });
  }

  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting (use most reliable source)
    const clientIP = req.connection?.remoteAddress || 
                    req.socket?.remoteAddress || 
                    req.info?.remoteAddress || 
                    'unknown';

    // Apply persistent rate limiting
    const isAllowed = await rateLimiter.isAllowed(clientIP);
    if (!isAllowed) {
      // Get rate limit status for response headers
      const status = await rateLimiter.getStatus(clientIP);
      
      // Add consistent timing for rate limit response
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', '5');
      res.setHeader('X-RateLimit-Remaining', status.remaining.toString());
      res.setHeader('X-RateLimit-Reset', new Date(status.resetTime).toISOString());
      
      setTimeout(() => {
        res.status(429).json({ 
          error: SECURITY_MESSAGES.RATE_LIMIT,
          retryAfter: Math.ceil((status.resetTime - Date.now()) / 1000)
        });
      }, remainingDelay);
      return;
    }

    // Validate CSRF token
    const csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken || !CSRFProtection.validateToken(csrfToken)) {
      // Add consistent timing for invalid CSRF response
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      setTimeout(() => {
        res.status(403).json({ error: SECURITY_MESSAGES.INVALID_TOKEN });
      }, remainingDelay);
      return;
    }

    const { name, email, message } = req.body;

    // Comprehensive input validation
    if (!name || !email || !message) {
      // Add consistent timing for validation error
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      setTimeout(() => {
        res.status(400).json({ error: SECURITY_MESSAGES.VALIDATION_ERROR });
      }, remainingDelay);
      return;
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      setTimeout(() => {
        res.status(400).json({ error: SECURITY_MESSAGES.VALIDATION_ERROR });
      }, addRandomJitter(500));
      return;
    }

    // Strict email validation
    if (!validateEmail(email)) {
      setTimeout(() => {
        res.status(400).json({ error: SECURITY_MESSAGES.VALIDATION_ERROR });
      }, addRandomJitter(500));
      return;
    }

    // Sanitize all inputs to prevent XSS
    const sanitizedName = sanitizeHtml(name.trim());
    const sanitizedMessage = sanitizeHtml(message.trim());

    // Additional validation after sanitization
    if (sanitizedName.length === 0 || sanitizedMessage.length === 0) {
      setTimeout(() => {
        res.status(400).json({ error: SECURITY_MESSAGES.VALIDATION_ERROR });
      }, addRandomJitter(500));
      return;
    }

    // Log security-relevant information (without sensitive data)
    console.log('Contact form submission:', { 
      timestamp: new Date().toISOString(),
      ip: clientIP,
      userAgent: req.headers['user-agent'] ? '[REDACTED]' : 'none',
      nameLength: sanitizedName.length, 
      emailDomain: email.split('@')[1] || 'invalid',
      messageLength: sanitizedMessage.length
    });
    
    // Here you would typically:
    // 1. Send email using a service like SendGrid (API key stored in Vercel env)
    // 2. Save to database with proper escaping
    // 3. Send to CRM, etc.
    
    // Add consistent timing to prevent timing attacks
    const processingTime = addRandomJitter(500);
    const elapsed = Date.now() - startTime;
    const remainingDelay = Math.max(0, processingTime - elapsed);
    
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
    }, remainingDelay);

  } catch (error) {
    console.error('Contact form error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Add consistent timing for server errors
    const processingTime = addRandomJitter(500);
    const elapsed = Date.now() - startTime;
    const remainingDelay = Math.max(0, processingTime - elapsed);
    
    setTimeout(() => {
      res.status(500).json({ 
        error: SECURITY_MESSAGES.SERVER_ERROR 
      });
    }, remainingDelay);
  }
}