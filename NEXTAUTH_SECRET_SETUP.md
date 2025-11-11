# How to Set NextAuth Secret

## Quick Setup

### 1. Generate a Secure Secret

Run this command in your terminal to generate a random secret:

```bash
openssl rand -base64 32
```

This will output something like: `m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=`

### 2. Add to .env.local File

Create or edit `.env.local` in the root of your project and add:

```env
NEXTAUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
NEXTAUTH_URL=http://localhost:3000
```

**For Local Development:**
```env
NEXTAUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
NEXTAUTH_URL=http://localhost:3000
```

**For Production (Vercel/Other):**
```env
NEXTAUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
NEXTAUTH_URL=https://maishaprintingbd.com
```

## Step-by-Step Instructions

### Option 1: Manual Creation

1. **Create `.env.local` file** in the project root:
   ```
   /home/atiqul-islam/Maisha Printing Main/.env.local
   ```

2. **Add these lines:**
   ```env
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your-mongodb-uri
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Option 2: Using Terminal

Run these commands:

```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local (replace YOUR_SECRET with the generated value)
echo "NEXTAUTH_SECRET=YOUR_SECRET" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
```

## For Production (Vercel)

### 1. Add Environment Variables in Vercel Dashboard

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: Your generated secret (same one from local)
   - **Environment**: Production, Preview, Development

4. Add:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://maishaprintingbd.com`
   - **Environment**: Production

### 2. Or use Vercel CLI

```bash
vercel env add NEXTAUTH_SECRET
# Paste your secret when prompted

vercel env add NEXTAUTH_URL
# Enter: https://your-domain.vercel.app
```

## Alternative: Generate Secret Online

If you don't have `openssl` installed, you can use:

1. **Online Generator**: https://generate-secret.vercel.app/32
2. **Node.js Command**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

## Important Notes

⚠️ **Security Requirements:**
- **Never commit `.env.local`** to Git (it's already in `.gitignore`)
- Use a **different secret** for production than development
- The secret should be **at least 32 characters**
- Keep it **private** - never share it publicly

⚠️ **Best Practices:**
- Use different secrets for development, staging, and production
- Rotate secrets periodically (every 6-12 months)
- Never hardcode secrets in your source code
- Use environment-specific secrets

## Verify It's Working

After setting up:

1. Restart your dev server: `npm run dev`
2. Try logging in at `/admin/login`
3. Check console for any errors (should be none)

## Troubleshooting

### "Secret is missing" Error

- Make sure `.env.local` exists in the project root
- Check the variable name is exactly `NEXTAUTH_SECRET`
- Restart your development server after adding

### "Invalid secret" Error

- Make sure your secret is properly base64 encoded
- Check for extra spaces or quotes around the value
- Try generating a new secret

### Production Issues

- Verify environment variables are set in Vercel/dashboard
- Ensure `NEXTAUTH_URL` matches your production domain
- Check that secrets are set for the correct environment

## Example .env.local File

```env
# NextAuth Configuration
NEXTAUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/dtqqmnmqo
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_3rFwnAaqLowbj9kSg+js94pt7s4=
IMAGEKIT_PRIVATE_KEY=CELMONWRfc5WrCRuwKsW3raUqw=
```

---

**Remember**: Always keep your secrets secure and never commit them to version control!

