# Production Setup for maishaprintingbd.com

## Domain Configuration

Your production domain: **maishaprintingbd.com**

## Vercel Environment Variables Setup

### Required Environment Variables

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables for **Production** environment:

#### 1. NextAuth Configuration
```
NEXTAUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
NEXTAUTH_URL=https://maishaprintingbd.com
```

#### 2. MongoDB
```
MONGODB_URI=mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0
```

#### 3. ImageKit
```
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/dtqqmnmqo
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_3rFwnAaqLowbj9kSg+js94pt7s4=
IMAGEKIT_PRIVATE_KEY=CELMONWRfc5WrCRuwKsW3raUqw=
```

## Using Vercel CLI

Alternatively, you can set them via command line:

```bash
# Set NextAuth Secret
vercel env add NEXTAUTH_SECRET production
# Paste: m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=

# Set NextAuth URL
vercel env add NEXTAUTH_URL production
# Enter: https://maishaprintingbd.com

# Set MongoDB URI
vercel env add MONGODB_URI production
# Paste: mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0

# Set ImageKit variables
vercel env add NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT production
vercel env add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY production
vercel env add IMAGEKIT_PRIVATE_KEY production
```

## Important Notes

⚠️ **Critical Settings:**
- `NEXTAUTH_URL` **must** be `https://maishaprintingbd.com` (with https)
- Use the **same** `NEXTAUTH_SECRET` for all environments (local, preview, production)
- All environment variables should be set for **Production** environment
- Consider setting them for **Preview** and **Development** too if needed

## After Setup

1. **Redeploy** your project in Vercel
2. **Verify** the domain is connected in Vercel
3. **Test** the admin login at: `https://maishaprintingbd.com/admin/login`
4. **Check** that HTTPS is working (Vercel provides this automatically)

## Domain Verification Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records configured correctly
- [ ] SSL certificate issued (automatic with Vercel)
- [ ] `NEXTAUTH_URL` set to `https://maishaprintingbd.com`
- [ ] All environment variables configured
- [ ] Project redeployed
- [ ] Admin login tested
- [ ] HTTPS working correctly

## Troubleshooting

### "Invalid redirect URI" Error
- Ensure `NEXTAUTH_URL` is exactly `https://maishaprintingbd.com` (no trailing slash)
- Check it matches your actual domain in Vercel

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set correctly
- Check that all environment variables are set for Production
- Ensure the project was redeployed after adding variables

### Domain Not Resolving
- Check DNS configuration in your domain registrar
- Verify domain is added in Vercel
- Wait for DNS propagation (can take up to 48 hours)

---

**Your Production URL**: https://maishaprintingbd.com
**Admin Login**: https://maishaprintingbd.com/admin/login

