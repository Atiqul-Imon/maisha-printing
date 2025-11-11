# Authentication Setup Guide

## Overview

The admin panel is now protected with industry-grade authentication using NextAuth.js v5. This provides secure, robust access control to your CMS.

## Features

✅ **Secure Authentication**
- JWT-based session management
- Password hashing with bcrypt
- MongoDB user management
- Session-based access control

✅ **Security Features**
- Protected admin routes via middleware
- Automatic redirect to login
- Secure password storage (bcrypt hashing)
- Session expiration (30 days)
- CSRF protection (built into NextAuth)

✅ **User Experience**
- Clean login interface
- User info display in admin panel
- Logout functionality
- Automatic redirects

## Setup Instructions

### 1. Create Admin User

Run the following command to create your first admin user:

```bash
npm run create-admin
```

This will create a default admin user with:
- **Email**: `admin@maishaprinting.com`
- **Password**: `Admin@123`

⚠️ **IMPORTANT**: Change these credentials after first login!

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

For production, use a strong random secret:
```bash
# Generate a random secret
openssl rand -base64 32
```

### 3. Custom Admin Credentials

To create an admin user with custom credentials, set environment variables:

```bash
ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=YourSecurePassword123! npm run create-admin
```

Or modify `scripts/create-admin-user.ts` before running.

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` - you'll be redirected to `/admin/login`
2. Enter your credentials
3. After successful login, you'll be redirected to `/admin`

### Default Credentials (Development)

If MongoDB is not configured, you can use:
- **Email**: `admin@maishaprinting.com`
- **Password**: `admin123`

⚠️ **Do not use these in production!**

## Security Best Practices

### 1. Strong Passwords
- Use complex passwords (min 12 characters)
- Include uppercase, lowercase, numbers, and symbols
- Don't reuse passwords

### 2. Environment Variables
- Never commit `.env.local` to version control
- Use strong, random `NEXTAUTH_SECRET`
- Rotate secrets regularly

### 3. User Management
- Limit admin users to trusted personnel only
- Regularly review and remove unused accounts
- Use different passwords for different environments

### 4. HTTPS in Production
- Always use HTTPS in production
- Set `NEXTAUTH_URL` to your production domain
- Configure secure cookies (NextAuth does this automatically)

## Files Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   ├── page.tsx      # Login page
│   │   │   └── layout.tsx    # Login layout (no header/footer)
│   │   ├── layout.tsx        # Admin layout (no header/footer)
│   │   └── page.tsx          # Admin panel (protected)
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts  # NextAuth API routes
├── lib/
│   ├── auth.ts               # Auth configuration
│   └── mongodb.ts            # MongoDB connection (includes users collection)
├── middleware.ts             # Route protection
└── types/
    └── next-auth.d.ts        # NextAuth TypeScript types

scripts/
└── create-admin-user.ts      # Admin user creation script
```

## Adding New Users

To add additional admin users, modify `scripts/create-admin-user.ts` or create a new script. Users are stored in MongoDB in the `users` collection with the following structure:

```typescript
{
  email: string;
  password: string; // bcrypt hashed
  name?: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

## Troubleshooting

### Login Not Working

1. Check MongoDB connection
2. Verify user exists in database
3. Check environment variables (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
4. Check browser console for errors

### Middleware Issues

If middleware is blocking access incorrectly:
1. Check `src/middleware.ts` configuration
2. Verify `NEXTAUTH_SECRET` matches in middleware and auth config
3. Clear browser cookies and try again

### Password Not Working

If you forgot your password:
1. Use the `create-admin-user` script with a new password
2. Or manually update the password hash in MongoDB
3. Or delete the user and create a new one

## Production Checklist

- [ ] Change default admin credentials
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure `NEXTAUTH_URL` for production domain
- [ ] Enable HTTPS
- [ ] Review and limit admin users
- [ ] Set up monitoring/alerting for failed login attempts
- [ ] Regularly update dependencies
- [ ] Backup user database

## Support

For issues or questions:
- Check NextAuth.js documentation: https://next-auth.js.org
- Review error logs in console
- Verify MongoDB connection

---

**Security Note**: This authentication system is production-ready but requires proper configuration and strong credentials. Always follow security best practices!

