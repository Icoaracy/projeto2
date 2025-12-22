# Security Guidelines

## 🚨 Critical Security Rules

### 1. NEVER expose secrets on the client-side
- ❌ **NEVER** prefix private API keys with `VITE_` - Vite will bundle them into client code
- ❌ **NEVER** commit `.env` files with secrets to version control
- ❌ **NEVER** store secrets in frontend code
- ✅ **ALWAYS** use server-side API endpoints for any operation requiring secrets

### 2. Content Security Policy (CSP) - ✅ IMPLEMENTED
- ✅ Strict CSP headers implemented in both development and production
- ✅ Prevents XSS attacks by controlling which resources can be loaded
- ✅ Configured in `vite.config.ts` for development
- ✅ Configured in `vercel.json` for production
- ✅ Includes `frame-ancestors 'none'` to prevent clickjacking

### 3. API Security Architecture - ✅ ENHANCED
- ✅ All sensitive operations go through `/api/*` serverless functions
- ✅ Frontend only communicates with your backend APIs
- ✅ Backend handles all secret API keys, database connections, etc.
- ✅ **NEW**: Rate limiting implemented (5 requests per minute per IP)
- ✅ **NEW**: CSRF protection for state-changing operations
- ✅ **NEW**: Comprehensive input validation and sanitization
- ✅ **NEW**: Enhanced error handling and logging

### 4. Input Validation & Sanitization - ✅ IMPLEMENTED
- ✅ Client-side validation for immediate user feedback
- ✅ Server-side validation as the authoritative source
- ✅ HTML sanitization to prevent XSS attacks
- ✅ Email format validation with strict regex
- ✅ Length limits on all input fields
- ✅ Character restrictions where appropriate

### 5. Rate Limiting - ✅ IMPLEMENTED
- ✅ 5 requests per minute per IP address
- ✅ Prevents brute force attacks and spam
- ✅ Implemented in `/api/contact.ts` endpoint
- ✅ Configurable limits for different endpoints

### 6. CSRF Protection - ✅ IMPLEMENTED
- ✅ CSRF tokens generated for state-changing requests
- ✅ Tokens validated on the server-side
- ✅ Automatic token management in API client

## 📁 Secure File Structure

```
├── api/                    # Serverless functions (server-side only)
│   ├── contact.ts         # ✅ Enhanced with rate limiting, CSRF, validation
│   └── health.ts          # API health check
├── src/
│   ├── lib/
│   │   ├── api.ts         # ✅ Enhanced with CSRF protection
│   │   └── security.ts    # ✅ NEW: Security utilities
│   └── pages/
│       └── Index.tsx      # ✅ Enhanced with client-side validation
├── vite.config.ts         # ✅ CSP headers for development
├── vercel.json           # ✅ CSP headers for production
└── SECURITY.md           # This documentation
```

## 🔐 Implementation Checklist

- [x] ✅ Content Security Policy (CSP) headers implemented
- [x] ✅ Rate limiting on API endpoints
- [x] ✅ CSRF protection for state-changing operations
- [x] ✅ Input validation and sanitization
- [x] ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] ✅ Client-side form validation
- [x] ✅ Server-side form validation
- [x] ✅ Error handling and logging
- [x] ✅ Security utilities and helper functions
- [x] ✅ Enhanced API client with security features

## 🛡️ Security Features Implemented

### Content Security Policy
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none';
```

### Additional Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Rate Limiting
- 5 requests per minute per IP address
- Configurable window and request limits
- IP-based identification with fallbacks

### CSRF Protection
- Cryptographically secure token generation
- Server-side token validation
- Automatic token management

### Input Validation
- Client-side validation for UX
- Server-side validation for security
- HTML sanitization to prevent XSS
- Email format validation
- Length and character restrictions

## 🚀 Next Steps for Production

1. **Email Service Integration**
   - Add SendGrid or Resend for email notifications
   - Store API keys in Vercel environment variables
   - Implement email templates

2. **Database Integration**
   - Add PostgreSQL or MongoDB for form submissions
   - Store connection strings in Vercel environment
   - Implement proper database indexing

3. **Enhanced Monitoring**
   - Add error tracking (Sentry, LogRocket)
   - Implement security event logging
   - Set up alerts for suspicious activity

4. **Authentication System**
   - Add user authentication if needed
   - Implement session management
   - Add role-based access control

5. **Additional Security Measures**
   - Implement IP whitelisting if needed
   - Add CAPTCHA for form submissions
   - Set up Web Application Firewall (WAF)

## 📞 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://csp-evaluator.withgoogle.com/)
- [Vercel Security Documentation](https://vercel.com/docs/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## 🔍 Security Testing

To test the implemented security measures:

1. **CSP Testing**: Try to inject inline scripts or load external resources
2. **Rate Limiting**: Submit the form rapidly to test rate limits
3. **Input Validation**: Try submitting malicious HTML or JavaScript
4. **CSRF Protection**: Test requests without proper CSRF tokens
5. **Header Testing**: Verify all security headers are present

## 🚨 Incident Response

If a security incident is detected:

1. Immediately review server logs
2. Check for unusual patterns in API usage
3. Verify rate limiting is working
4. Monitor for successful XSS attempts
5. Document and report the incident
6. Implement additional mitigations if needed