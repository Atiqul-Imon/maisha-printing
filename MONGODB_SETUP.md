# MongoDB Atlas Setup Guide

This project uses MongoDB Atlas for storing products and services data.

## Prerequisites

- MongoDB Atlas account
- Connection string (already provided)

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 2. Database Structure

The database uses:
- **Database Name**: `maisha_printing`
- **Collection Name**: `products`

### 3. Initial Setup

#### Option A: Seed Database with Initial Data

Run the seed script to populate your database with initial products:

```bash
npm run seed
```

This will:
- Connect to MongoDB Atlas
- Create the `maisha_printing` database (if it doesn't exist)
- Create the `products` collection
- Insert initial product data from `src/data/products.ts`

#### Option B: Start Fresh

If you prefer to start with an empty database, just start the application. The database and collection will be created automatically when you first use the CMS.

## Using the CMS

1. **Access Admin Panel**: Navigate to `/admin`
2. **Add Products**: Click "Add Product" button
3. **Edit Products**: Click "Edit" on any product card
4. **Delete Products**: Click the trash icon

All changes are automatically saved to MongoDB Atlas.

## Database Schema

### Product Document Structure

```typescript
{
  _id: ObjectId,              // MongoDB generated ID
  title: string,              // Product/service title
  shortDescription: string,   // Brief description (shown on cards)
  longDescription: string,    // Full description (detail page)
  category: 'service' | 'product',
  subcategory?: string,       // Optional subcategory
  slug: string,               // URL-friendly identifier (unique)
  featured: boolean,          // Show in featured section
  images: Array<{
    url: string,              // ImageKit URL
    alt: string               // Alt text
  }>,
  metaTitle?: string,         // SEO meta title
  metaDescription?: string,   // SEO meta description
  createdAt: string,         // ISO date string
  updatedAt: string           // ISO date string
}
```

## API Endpoints

### GET `/api/products`
Fetch all products

**Response:**
```json
{
  "success": true,
  "data": [/* array of products */]
}
```

### GET `/api/products/[id]`
Fetch single product by ID

### GET `/api/products/by-slug/[slug]`
Fetch product by slug

### POST `/api/products`
Create new product

**Body:**
```json
{
  "title": "Product Title",
  "slug": "product-slug",
  "shortDescription": "Brief description",
  "longDescription": "Full description",
  "category": "service",
  "subcategory": "Printing",
  "featured": true,
  "images": [
    {
      "url": "https://ik.imagekit.io/...",
      "alt": "Image description"
    }
  ]
}
```

### PUT `/api/products/[id]`
Update existing product

### DELETE `/api/products/[id]`
Delete product

## MongoDB Atlas Connection

**Connection String:**
```
mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0
```

**Database:** `maisha_printing`  
**Collection:** `products`

## Troubleshooting

### Connection Issues

1. **Check IP Whitelist**: Make sure your IP is whitelisted in MongoDB Atlas
   - Go to MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` for all IPs (development only)

2. **Check Connection String**: Verify the connection string in `.env.local`

3. **Check Network**: Ensure you have internet connectivity

### Database Not Found

The database and collection are created automatically on first use. If you see errors:

1. Ensure the connection string is correct
2. Check MongoDB Atlas dashboard for the database
3. Verify user permissions

### Seed Script Issues

If the seed script fails:

```bash
# Make sure tsx is installed
npm install --save-dev tsx

# Run seed script
npm run seed
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **IP Whitelisting**: Restrict IP access in production
3. **User Permissions**: Use least-privilege database users
4. **Connection String**: Rotate credentials regularly

## Production Deployment

For production (e.g., Vercel):

1. Add `MONGODB_URI` to environment variables in your hosting platform
2. Ensure MongoDB Atlas allows connections from your hosting provider's IPs
3. Consider using MongoDB Atlas IP Access List for security

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

