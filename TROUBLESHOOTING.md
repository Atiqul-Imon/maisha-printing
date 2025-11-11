# Troubleshooting the "Configuration" Error

## Why the Error Appears

The red "Configuration" warning on the login page usually means:
1. **Server not restarted** - Environment variables only load when the server starts
2. **Cache issue** - Next.js might be using cached configuration
3. **Browser cache** - Old error might be cached

## Step-by-Step Fix

### 1. Stop Your Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running

### 2. Clear Next.js Cache
```bash
rm -rf .next
```

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Hard Refresh Browser
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

### 5. Try Login Again

## Verify Environment Variables

Check that `.env.local` exists and has:
```env
NEXTAUTH_SECRET=m8Ujch4YMK3b7IWfPjwwlrg7G/MPGkwMhv2QjC9dYDI=
NEXTAUTH_URL=http://localhost:3000
```

## Common Issues

### Issue: "Configuration" still showing
**Solution:** Make sure you completely stopped the server before restarting

### Issue: Login not working
**Solution:** Check MongoDB connection and verify admin user exists

### Issue: Environment variables not loading
**Solution:** Ensure `.env.local` is in the project root (same folder as `package.json`)

---

**Remember:** NextAuth doesn't require any external account setup. It uses your MongoDB users!

