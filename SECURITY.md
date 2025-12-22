# Security Guidelines

## 🚨 Critical Security Rules

### 1. NEVER expose secrets on the client-side
- ❌ **NEVER** prefix private API keys with `VITE_` - Vite will bundle them into client code
- ❌ **NEVER** commit `.env` files with secrets to version control
- ❌ **NEVER** store secrets in frontend code
- ✅ **ALWAYS** use server-side API endpoints for any operation requiring secrets

### 2. Content Security Policy (CSP) - ✅ ENHANCED
- ✅ Strict CSP headers implemented in both development and production
- ✅ Removed `'unsafe-eval'` from development CSP for better security
- ✅ Prevents XSS attacks by controlling which resources can be loaded
- ✅ Configured in `vite.config.ts` for development
- ✅ Configured in `vercel.json` for production
- ✅ Includes `frame-ancestors 'none'` to prevent clickjacking

### 3. API Security Architecture - ✅ ENHANCED
- ✅ All sensitive operations go through `/api/*` serverless functions
- ✅ Frontend only communicates with your backend APIs
- ✅ Backend handles all secret API keys, database connections, etc.
- ✅ **NEW**: Enhanced rate limiting with proper cleanup and persistence
- ✅ **NEW**: Robust CSRF protection with signed tokens and expiration
- ✅ **NEW**: Comprehensive input validation and sanitization
- ✅ **NEW**: Constant-time comparisons to prevent timing attacks
- ✅ **NEW**: Generic error messages to prevent information disclosure
- ✅ **NEW**: CSRF token generation endpoint for secure token management
- ✅ **NEW**: Rate limit status endpoint for real-time monitoring

### 4. Input Validation & Sanitization - ✅ ENHANCED
- ✅ Client-side validation for immediate user feedback
- ✅ Server-side validation as the authoritative source
- ✅ Enhanced HTML sanitization to prevent XSS attacks
- ✅ Strict email format validation with RFC compliance
- ✅ Length limits on all input fields
- ✅ Character restrictions where appropriate
- ✅ Prevention of JavaScript, data, and VBScript injection

### 5. Rate Limiting - ✅ ENHANCED
- ✅ 5 requests per minute per IP address with proper cleanup
- ✅ Prevents brute force attacks and spam
- ✅ Implemented in `/api/contact.ts` endpoint
- ✅ Automatic cleanup of expired entries
- ✅ Remaining requests tracking for better UX
- ✅ **NEW**: Real-time rate limit status endpoint
- ✅ **NEW**: Client-side rate limit awareness and prevention

### 6. CSRF Protection - ✅ ENHANCED
- ✅ Cryptographically secure signed tokens with HMAC
- ✅ Server-side token validation with expiration
- ✅ Automatic token management in API client
- ✅ Constant-time comparison to prevent timing attacks
- ✅ **NEW**: Dedicated CSRF token generation endpoint
- ✅ **NEW**: Secure cookie-based token storage
- ✅ **NEW**: Client-side security hook for token management

## 📁 Secure File Structure

```
├── api/                    # Serverless functions (server-side only)
│   ├── contact.ts         # ✅ Enhanced with robust security measures
│   ├── csrf.ts            # ✅ NEW: CSRF token generation endpoint
│   ├── rate-limit.ts      # ✅ NEW: Rate limit status endpoint
│   ├── security.ts        # ✅ Server-side security utilities
│   └── health.ts          # API health check
├── src/
│   ├── components/
│   │   └── security-status.ts # ✅ NEW: Security status component
│   ├── hooks/
│   │   └── use-security.ts    # ✅ NEW: Security management hook
│   ├── lib/
│   │   ├── api.ts         # ✅ Enhanced with CSRF and rate limit management
│   │   └── security.ts    # ✅ Client-side security utilities
│   └── pages/
│       └── Index.tsx      # ✅ Enhanced with security status and validation
├── vite.config.ts         # ✅ Stricter CSP headers for development
├── vercel.json           # ✅ CSP headers for production
└── SECURITY.md           # This documentation
```

## 🔐 Implementation Checklist

- [x] ✅ Content Security Policy (CSP) headers implemented
- [x] ✅ Enhanced rate limiting with proper cleanup
- [x] ✅ Robust CSRF protection with signed tokens
- [x] ✅ Comprehensive input validation and sanitization
- [x] ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] ✅ Client-side form validation
- [x] ✅ Server-side form validation
- [x] ✅ Generic error messages to prevent information disclosure
- [x] ✅ Constant-time comparisons to prevent timing attacks
- [x] ✅ Reliable IP detection for rate limiting
- [x] ✅ Separation of client and server security utilities
- [x] ✅ **NEW**: CSRF token generation endpoint
- [x] ✅ **NEW**: Rate limit status endpoint
- [x] ✅ **NEW**: Security status component
- [x] ✅ **NEW**: Security management hook
- [x] ✅ **NEW**: Real-time rate limit awareness

## 🛡️ Security Features Implemented

### Content Security Policy
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none';
```

### Additional Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Enhanced Rate Limiting
- 5 requests per minute per IP address
- Automatic cleanup of expired entries
- Remaining requests tracking
- Configurable window and request limits
- **NEW**: Real-time status endpoint
- **NEW**: Client-side awareness and prevention

### Robust CSRF Protection
- HMAC-signed tokens with expiration
- Server-side token validation
- Constant-time comparison
- Automatic token management
- **NEW**: Dedicated token generation endpoint
- **NEW**: Secure cookie-based storage
- **NEW**: Client-side management hook

### Enhanced Input Validation
- Client-side validation for UX
- Server-side validation for security
- Comprehensive HTML sanitization
- RFC-compliant email validation
- Length and character restrictions
- Prevention of injection attacks

### Timing Attack Prevention
- Consistent processing times for all responses
- Constant-time string comparisons
- Random delays for error cases

### **NEW**: Security Status Monitoring
- Real-time rate limit status display
- CSRF protection status indicator
- User-friendly security feedback
- Automatic status updates

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
   - Consider using Redis for distributed rate limiting

6. **Advanced Security Features**
   - Implement JWT-based authentication
   - Add API key management
   - Set up security audit logging
   - Implement automated security scanning

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
6. **Timing Attacks**: Measure response times for different scenarios
7. **NEW**: Test CSRF token generation and validation
8. **NEW**: Test rate limit status endpoint
9. **NEW**: Test security status component updates

## 🚨 Incident Response

If a security incident is detected:

1. Immediately review server logs
2. Check for unusual patterns in API usage
3. Verify rate limiting is working
4. Monitor for successful XSS attempts
5. Document and report the incident
6. Implement additional mitigations if needed

## 🔄 Recent Security Improvements

1. **Separated Client/Server Security**: Moved Node.js-specific code to server-side only
2. **Enhanced Rate Limiting**: Implemented proper cleanup and persistence
3. **Robust CSRF Protection**: Added signed tokens with expiration
4. **Generic Error Messages**: Prevent information disclosure
5. **Timing Attack Prevention**: Constant-time comparisons and delays
6. **Stricter CSP**: Removed unnecessary `'unsafe-eval'` from development
7. **Enhanced Input Sanitization**: Comprehensive XSS prevention
8. **Reliable IP Detection**: Improved IP address extraction logic
9. **NEW**: CSRF Token Generation Endpoint**: Secure token management
10. **NEW**: Rate Limit Status Endpoint**: Real-time monitoring
11. **NEW**: Security Status Component**: User-friendly security feedback
12. **NEW**: Security Management Hook**: Centralized security state management