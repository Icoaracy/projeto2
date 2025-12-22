import { RateLimiter, CSRFProtection, validateRequestBody, SCHEMAS, SECURITY_MESSAGES, addRandomJitter } from './security';

// Initialize rate limiter: 10 requests per minute per IP (more permissive for AI features)
const rateLimiter = new RateLimiter(10, 60000);

// Apply schema validation middleware
const validateImproveTextData = validateRequestBody(SCHEMAS.improveText);

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
    // Get client IP for rate limiting
    const clientIP = req.connection?.remoteAddress || 
                    req.socket?.remoteAddress || 
                    req.info?.remoteAddress || 
                    'unknown';

    // Apply rate limiting
    const isAllowed = await rateLimiter.isAllowed(clientIP);
    if (!isAllowed) {
      const status = await rateLimiter.getStatus(clientIP);
      
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      res.setHeader('X-RateLimit-Limit', '10');
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

    // Validate

<dyad-write path="api/improve-text.ts" description="Creating improve-text endpoint with proper validation">
import { RateLimiter, CSRFProtection, validateRequestBody, SCHEMAS, SECURITY_MESSAGES, addRandomJitter } from './security';

// Initialize rate limiter: 10 requests per minute per IP (more permissive for AI features)
const rateLimiter = new RateLimiter(10, 60000);

// Apply schema validation middleware
const validateImproveTextData = validateRequestBody(SCHEMAS.improveText);

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
    // Get client IP for rate limiting
    const clientIP = req.connection?.remoteAddress || 
                    req.socket?.remoteAddress || 
                    req.info?.remoteAddress || 
                    'unknown';

    // Apply rate limiting
    const isAllowed = await rateLimiter.isAllowed(clientIP);
    if (!isAllowed) {
      const status = await rateLimiter.getStatus(clientIP);
      
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      res.setHeader('X-RateLimit-Limit', '10');
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
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      setTimeout(() => {
        res.status(403).json({ error: SECURITY_MESSAGES.INVALID_TOKEN });
      }, remainingDelay);
      return;
    }

    // Apply schema validation (this will also sanitize data)
    validateImproveTextData(req, res, () => {
      const { text, context } = req.body;

      // Log security-relevant information (without sensitive data)
      console.log('Improve text request:', { 
        timestamp: new Date().toISOString(),
        ip: clientIP,
        textLength: text.length,
        hasContext: !!context
      });
      
      // Here you would typically:
      // 1. Call an AI service (OpenAI, etc.) with proper API key management
      // 2. Process the text improvement
      // 3. Return the improved text
      
      // For now, return a simple improvement as placeholder
      const improvedText = `Texto melhorado: ${text.replace(/\b(e|o|a|os|as)\b/gi, (match) => match.toUpperCase())}`;
      
      const processingTime = addRandomJitter(500);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, processingTime - elapsed);
      
      setTimeout(() => {
        res.status(200).json({ 
          success: true, 
          improvedText: improvedText
        });
      }, remainingDelay);
    });

  } catch (error) {
    console.error('Improve text error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
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