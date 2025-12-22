import { RateLimiter, CSRFProtection, sanitizeHtml, getClientIP, constantTimeCompare } from './security';

// Initialize rate limiter: 10 requests per minute per IP for AI service
const rateLimiter = new RateLimiter(10, 60000);

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

    const { text, context } = req.body;

    // Comprehensive input validation
    if (!text || typeof text !== 'string') {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Validate text length
    if (text.length < 10 || text.length > 5000) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Sanitize input to prevent XSS
    const sanitizedText = sanitizeHtml(text.trim());
    const sanitizedContext = context ? sanitizeHtml(context.trim()) : '';

    // Additional validation after sanitization
    if (sanitizedText.length === 0) {
      const processingTime = 500 - (Date.now() - startTime);
      setTimeout(() => {
        res.status(400).json({ error: 'Request failed' });
      }, Math.max(0, processingTime));
      return;
    }

    // Log security-relevant information (without sensitive data)
    console.log('Text improvement request:', { 
      timestamp: new Date().toISOString(),
      ip: clientIP,
      userAgent: req.headers['user-agent'],
      textLength: sanitizedText.length,
      contextLength: sanitizedContext.length,
      remainingRequests: rateLimiter.getRemainingRequests(clientIP)
    });

    // Simulate AI text improvement (in a real implementation, you would call an AI service here)
    // For demonstration, we'll improve the text with basic transformations
    let improvedText = sanitizedText;

    // Basic text improvements
    improvedText = improvedText
      // Capitalize first letter of each sentence
      .replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase())
      // Add proper spacing after punctuation
      .replace(/([.!?])(?=\S)/g, '$1 ')
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      // Remove leading/trailing spaces
      .trim();

    // Add context-specific improvements if provided
    if (sanitizedContext && sanitizedContext.toLowerCase().includes('licitação')) {
      // Add formal language improvements for procurement context
      improvedText = improvedText
        .replace(/\bprecisa\b/gi, 'necessita')
        .replace(/\bquer\b/gi, 'deseja')
        .replace(/\bter\b/gi, 'possuir')
        .replace(/\bfazer\b/gi, 'realizar')
        .replace(/\bpegar\b/gi, 'adquirir')
        .replace(/\bcomprar\b/gi, 'adquirir');
    }

    // Apply consistent processing time to prevent timing attacks
    const processingTime = 500 - (Date.now() - startTime);
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        improvedText: improvedText
      });
    }, Math.max(0, processingTime));

  } catch (error) {
    console.error('Text improvement error:', {
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