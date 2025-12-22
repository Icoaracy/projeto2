import { CSRFProtection } from './security';

export default function handler(req: any, res: any) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Only allow GET method for token generation
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Request failed' });
  }

  try {
    // Generate a new CSRF token
    const token = CSRFProtection.generateToken();
    
    // Set the token in a secure, HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `csrf-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`
    ]);
    
    // Also return the token for client-side usage
    res.status(200).json({ 
      success: true,
      token: token
    });
  } catch (error) {
    console.error('CSRF token generation error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    res.status(500).json({ 
      error: 'Request failed' 
    });
  }
}