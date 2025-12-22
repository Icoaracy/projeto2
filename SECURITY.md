# Security Guidelines

## 🚨 Critical Security Rules

### 1. NEVER expose secrets on the client-side
- ❌ **NEVER** prefix private API keys with `VITE_` - Vite will bundle them into client code
- ❌ **NEVER** commit `.env` files with secrets to version control
- ✅ **ALWAYS** use server-side API endpoints for any operation requiring secrets

### 2. API Security Architecture
- ✅ All sensitive operations go through `/api/*` serverless functions
- ✅ Frontend only communicates with your backend APIs
- ✅ Backend handles all secret API keys, database connections, etc.
- ✅ Implement proper validation and error handling on the server

### 3. Environment Variables
```bash
# ❌ WRONG - Will be exposed to client
VITE_API_KEY=secret_key

# ✅ CORRECT - Only available on server
API_KEY=secret_key
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=SG....
```

### 4. Vercel Environment Variables
- **Production**: Set in Vercel dashboard under Project Settings → Environment Variables
- **Preview/Development**: Set appropriate environment variables for each environment
- **Never** commit secrets to code repository

## 📁 Secure File Structure

```
├── api/                    # Serverless functions (server-side only)
│   ├── contact.ts         # Secure contact form handler
│   └── health.ts          # API health check
├── src/
│   ├── lib/
│   │   └── api.ts         # Client-side API client (no secrets)
│   └── pages/
│       └── Index.tsx      # Frontend components
└── vercel.json            # Proper API routing configuration
```

## 🔐 Implementation Checklist

- [x] Serverless functions created for sensitive operations
- [x] Client-side API client implemented
- [x] Vercel routing configured for `/api/*` endpoints
- [x] No `VITE_` prefixed secrets in codebase
- [x] Frontend uses secure API endpoints only
- [x] Proper error handling implemented
- [x] Input validation on server-side

## 🚀 Next Steps for Production

1. Add real email service integration (SendGrid, Resend, etc.)
2. Implement rate limiting on API endpoints
3. Add CSRF protection
4. Set up monitoring and logging
5. Implement proper authentication if needed
6. Add database integration for form submissions

## 📞 Support

For security questions or concerns, review Vercel's security documentation:
https://vercel.com/docs/security