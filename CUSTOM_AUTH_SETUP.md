# Custom Authentication System Setup

## Overview

This project now uses a **custom authentication system** instead of NextAuth. The system uses JWT tokens stored in HTTP-only cookies for secure authentication.

## Architecture

### Components

1. **Auth Utilities** (`src/lib/auth-custom.ts`)
   - Credential verification
   - JWT token creation and verification
   - Session management

2. **Middleware Auth** (`src/lib/auth-middleware.ts`)
   - Edge runtime compatible
   - Token verification in middleware

3. **API Routes**
   - `/api/auth/login` - Login endpoint
   - `/api/auth/logout` - Logout endpoint
   - `/api/auth/session` - Session check endpoint

4. **Middleware** (`src/middleware.ts`)
   - Protects admin routes
   - Redirects unauthenticated users
   - Redirects authenticated users away from login

## Environment Variables

### Required for Production (Vercel)

1. **AUTH_SECRET** (or NEXTAUTH_SECRET for backward compatibility)
   - Secret key for JWT signing
   - Should be at least 32 characters
   - Generate with: `openssl rand -base64 32`
   - Example: `m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=`

2. **MONGODB_URI**
   - MongoDB connection string
   - Required for user authentication
   - Example: `mongodb+srv://user:password@cluster.mongodb.net/`

### Optional

- **NEXTAUTH_SECRET** - Can be used instead of AUTH_SECRET (for backward compatibility)

## Vercel Environment Variables

Set these in **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

### For Production:
```
AUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
MONGODB_URI=mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0
```

**Note**: You can use `NEXTAUTH_SECRET` instead of `AUTH_SECRET` if you prefer (for backward compatibility).

## How It Works

### Login Flow

1. User submits email and password on `/admin/login`
2. Client sends POST request to `/api/auth/login`
3. Server verifies credentials against MongoDB
4. Server creates JWT token with user data
5. Server sets HTTP-only cookie with token
6. Client redirects to `/admin` dashboard

### Session Check

1. Client makes GET request to `/api/auth/session`
2. Server reads `auth-token` cookie
3. Server verifies JWT token
4. Server returns user data or null

### Logout Flow

1. User clicks logout
2. Client sends POST request to `/api/auth/logout`
3. Server deletes `auth-token` cookie
4. Client redirects to `/admin/login`

### Route Protection

1. Middleware checks for `auth-token` cookie on `/admin/*` routes
2. If no token, redirects to `/admin/login`
3. If token is valid, allows access
4. If token is invalid/expired, redirects to login

## Security Features

✅ **HTTP-only Cookies** - Prevents XSS attacks
✅ **Secure Cookies** - HTTPS only in production
✅ **JWT Tokens** - Secure token-based authentication
✅ **Password Hashing** - bcrypt with salt rounds
✅ **Route Protection** - Middleware protects admin routes
✅ **Session Expiration** - 30-day token expiration

## Login Credentials

**Email**: `admin@maishaprintingbd.com`  
**Password**: `MaishaAdmin@2024!`

## API Endpoints

### POST `/api/auth/login`
Login with credentials.

**Request:**
```json
{
  "email": "admin@maishaprintingbd.com",
  "password": "MaishaAdmin@2024!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "6907cb81e4daea9276b77392",
    "email": "admin@maishaprintingbd.com",
    "name": "Administrator",
    "role": "admin"
  }
}
```

### POST `/api/auth/logout`
Logout and clear session.

**Response:**
```json
{
  "success": true
}
```

### GET `/api/auth/session`
Check current session.

**Response:**
```json
{
  "user": {
    "id": "6907cb81e4daea9276b77392",
    "email": "admin@maishaprintingbd.com",
    "name": "Administrator",
    "role": "admin"
  },
  "expires": "2024-02-15T10:30:00.000Z"
}
```

Or if not authenticated:
```json
{
  "user": null
}
```

## Advantages Over NextAuth

1. **Simpler** - No external dependencies, easier to understand
2. **More Control** - Full control over authentication flow
3. **Fewer Dependencies** - Smaller bundle size
4. **No Redirect Loops** - Simpler session management
5. **Easier Debugging** - Clear authentication flow

## Migration from NextAuth

- ✅ Removed NextAuth dependencies
- ✅ Created custom auth system
- ✅ Updated login page
- ✅ Updated admin page
- ✅ Updated middleware
- ✅ Removed SessionProvider
- ✅ Created API endpoints

## Troubleshooting

### Login Not Working

1. **Check Environment Variables**
   - Verify `AUTH_SECRET` is set in Vercel
   - Verify `MONGODB_URI` is set correctly

2. **Check MongoDB Connection**
   - Verify MongoDB is accessible
   - Check IP whitelist in MongoDB Atlas
   - Verify credentials are correct

3. **Check Browser Console**
   - Look for error messages
   - Check Network tab for failed requests

4. **Check Vercel Logs**
   - Look for authentication errors
   - Check if API endpoints are working

### Session Not Persisting

1. **Check Cookie Settings**
   - Verify `secure` flag is set in production
   - Check `sameSite` setting
   - Verify cookie domain matches your site

2. **Check Token Expiration**
   - Tokens expire after 30 days
   - User needs to login again after expiration

### Redirect Loops

1. **Clear Browser Cookies**
   - Delete `auth-token` cookie
   - Clear all cookies for the site

2. **Check Middleware**
   - Verify middleware is correctly checking tokens
   - Check for conflicting redirects

## Testing

### Test Login

```bash
curl -X POST https://www.maishaprinting.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maishaprintingbd.com","password":"MaishaAdmin@2024!"}'
```

### Test Session

```bash
curl https://www.maishaprinting.com/api/auth/session \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

## Next Steps

1. **Set Environment Variables in Vercel**
   - Add `AUTH_SECRET` (or use `NEXTAUTH_SECRET`)
   - Add `MONGODB_URI`

2. **Redeploy**
   - Deploy the updated code to Vercel
   - Environment variables apply to new deployments

3. **Test Login**
   - Visit `/admin/login`
   - Login with credentials
   - Verify redirect to `/admin` works

4. **Verify Session**
   - Check that session persists
   - Verify logout works
   - Test route protection

---

**The custom authentication system is now ready to use!** 🎉

