import { RateLimiter, CSRFProtection, sanitizeHtml, validateEmail } from '../src/lib/security';

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection?.remoteAddress || 
                    'unknown';

    // Apply rate limiting
    if (!rateLimiter.isAllowed(clientIP)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    // Validate CSRF token if provided
    const csrfToken = req.headers['x-csrf-token'];
    if (csrfToken && !CSRFProtection.validateToken(csrfToken)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    const { name, email, message } = req.body;

    // Comprehensive input validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      return res.status(400).json({ error: 'Input exceeds maximum length' });
    }

    // Strict email validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Sanitize all inputs to prevent XSS
    const sanitizedName = sanitizeHtml(name.trim());
    const sanitizedMessage = sanitizeHtml(message.trim());

    // Additional validation after sanitization
    if (sanitizedName.length === 0 || sanitizedMessage.length === 0) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Log security-relevant information
    console.log('Contact form submission:', { 
      timestamp: new Date().toISOString(),
      ip: clientIP,
      userAgent: req.headers['user-agent'],
      name: sanitizedName, 
      email, 
      messageLength: sanitizedMessage.length
    });
    
    // Here you would typically:
    // 1. Send email using a service like SendGrid (API key stored in Vercel env)
    // 2. Save to database with proper escaping
    // 3. Send to CRM, etc.
    
    // Simulate processing time to prevent timing attacks
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
    }, 500);

  } catch (error) {
    console.error('Contact form error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again later.' 
    });
  }
}