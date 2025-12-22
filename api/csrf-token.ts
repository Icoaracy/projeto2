import { CSRFProtection } from './security';

export default function handler(req: any, res: any) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate CSRF token
    const token = CSRFProtection.generateToken();
    
    // Set token in HTTP-only cookie as additional protection
    res.setHeader('Set-Cookie', `csrf-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`);
    
    res.status(200).json({ 
      token: token,
      expires: new Date(Date.now() + 3600000).toISOString()
    });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}