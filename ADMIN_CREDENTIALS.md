# Admin Credentials for Maisha Printing CMS

## ✅ Admin User Created Successfully

Your admin user has been created in MongoDB Atlas database.

### Login Credentials

**Email:** `admin@maishaprintingbd.com`  
**Password:** `SkS^!$osN^333oIJ`

### Access URLs

**Local Development:**
- Login: http://localhost:3000/admin/login
- Admin Panel: http://localhost:3000/admin

**Production:**
- Login: https://maishaprintingbd.com/admin/login
- Admin Panel: https://maishaprintingbd.com/admin

## Security Information

- **User ID:** `6914860a2289847f0e7761dd`
- **Role:** Admin
- **Database:** `maisha_printing`
- **Collection:** `users`
- **Password:** Hashed with bcrypt (10 salt rounds)

## First Login Steps

1. Navigate to `/admin/login`
2. Enter the credentials above
3. **IMPORTANT:** Change the password after first login for security
4. Start managing your products and services!

## Password Change Recommendation

⚠️ **Security Best Practice:**
After logging in for the first time, consider updating the password to something more personal and secure.

You can update the password by:
1. Modifying `scripts/create-admin-user.ts` with a new password
2. Running the script again (it will update existing user)
3. Or manually updating in MongoDB Atlas

## Database Details

- **MongoDB URI:** Configured in environment variables
- **Database Name:** `maisha_printing`
- **Collection:** `users`
- **Status:** ✅ Active and ready to use

## Troubleshooting

### Can't Login?
- Verify MongoDB connection is working
- Check that `.env.local` has `MONGODB_URI` set correctly
- Ensure `NEXTAUTH_SECRET` is configured
- Check browser console for errors

### User Not Found?
- Verify user exists in MongoDB Atlas
- Check database name is `maisha_printing`
- Verify collection name is `users`

## Support

If you need to reset the password or create additional admin users, use the script:

```bash
ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=YourPassword123! npm run create-admin
```

---

**⚠️ KEEP THESE CREDENTIALS SECURE!**
Do not share or commit this file to version control.

