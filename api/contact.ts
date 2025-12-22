import { RateLimiter, CSRFProtection, sanitizeHtml, validateEmail, getClientIP, constantTimeCompare } from './security';

// Initialize rate limiter: 5 requests per minute per IP
const rateLimiter = new RateLimiter(5, 60000);

export default function handler(req: any, res: any) {
  // Set comprehensive security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Request failed' });
  }

  const startTime = Date.now();

  try {
    // Get reliable client IP for rate limiting
    const clientIP = getClientIP(req);

    // Apply rate limiting
    if (!rateLimiter.isAllowed(clientIP)) {
      // Add consistent delay to prevent timing attacks
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(429).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Validate CSRF token if provided
    const csrfToken = req.headers['x-csrf-token'];
    if (csrfToken && !CSRFProtection.validateToken(csrfToken)) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(403).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    const { name, email, message } = req.body;

    // Comprehensive input validation
    if (!name || !email || !message) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Strict email validation
    if (!validateEmail(email)) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Sanitize all inputs to prevent XSS
    const sanitizedName = sanitizeHtml(name.trim());
    const sanitizedMessage = sanitizeHtml(message.trim());

    // Additional validation after sanitization
    if (sanitizedName.length === 0 || sanitizedMessage.length === 0) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Log security-relevant information (without sensitive data)
    console.log('Contact form submission:', { 
      timestamp: new Date().toISOString(),
      ip: clientIP,
      userAgent: req.headers['user-agent'],
      nameLength: sanitizedName.length, 
      emailDomain: email.split('@')[1], 
      messageLength: sanitizedMessage.length,
      remainingRequests: rateLimiter.getRemainingRequests(clientIP)
    });
    
    // Here you would typically:
    // 1. Send email using a service like SendGrid (API key stored in Vercel env)
    // 2. Save to database with proper escaping
    // 3. Send to CRM, etc.
    
    // Apply consistent processing time to prevent timing attacks
    const processingTime = 500 - (Date.now() - startTime);
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
    }, Math.max(0, processingTime));

  } catch (error) {
    console.error('Contact form error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Apply consistent processing time even for errors
    const processingTime = 500 - (Date.now() - startTime);
    setTimeout(() => {
      res.status(500).json({ 
        error: 'Request failed' 
      });
    }, Math.max(0, processingTime));
  }
}