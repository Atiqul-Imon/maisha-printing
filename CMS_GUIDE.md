# CMS Guide - Product/Service Management

This guide explains how to use the CMS admin panel to manage products and services on your website.

## Accessing the CMS

Navigate to: **`/admin`**

Example: `https://yoursite.com/admin`

## Features

### 1. **Product/Service Cards Display**
- View all products and services in a grid layout
- See thumbnail images, titles, categories, and featured status
- Quick access buttons for viewing, editing, and deleting

### 2. **Adding New Products**
1. Click the **"Add Product"** button in the header
2. Fill in the required fields:
   - **Title**: Product/service name
   - **Slug**: URL-friendly identifier (auto-generated from title)
   - **Short Description**: Brief overview (shown on cards)
   - **Long Description**: Detailed information (shown on detail page)
   - **Category**: Service or Product
   - **Subcategory**: Optional classification
   - **Featured**: Toggle to show in featured section
   - **Images**: Add multiple images with URLs and alt text
3. Click **"Save Product"**

### 3. **Editing Products**
1. Click the **"Edit"** button on any product card
2. Modify the fields as needed
3. Click **"Save Product"** to update

### 4. **Deleting Products**
1. Click the **"Delete"** button (trash icon) on any product card
2. Confirm the deletion

### 5. **Image Management**
- Add multiple images per product
- Each image requires:
  - **URL**: ImageKit URL or external image URL
  - **Alt Text**: Descriptive text for accessibility
- Remove images by clicking the trash icon
- First image is used as the main/thumbnail image

## ImageKit Integration

All images are optimized through ImageKit:
- Use ImageKit URLs: `https://ik.imagekit.io/dtqqmnmqo/path/to/image.jpg`
- Images are automatically optimized for web delivery
- Support for transformations (size, quality, format)

### Uploading Images to ImageKit

1. Log in to your ImageKit dashboard
2. Upload images to your media library
3. Copy the image URL
4. Paste into the CMS form

## Product Detail Pages

Each product has its own detail page accessible at:
`/products/[slug]`

Features:
- Main image gallery with thumbnails
- Multiple image views
- Full product description
- Category badges
- Service features list
- Contact buttons (phone & email)
- Related products section

## Data Structure

Products are stored in: `src/data/products.ts`

### Product Model:
```typescript
{
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: 'service' | 'product';
  subcategory?: string;
  slug: string;
  featured: boolean;
  images: Array<{
    url: string;
    alt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### GET `/api/products`
Returns all products

### POST `/api/products`
Creates a new product (requires product data in body)

## Future Enhancements

For production use, consider:
1. **Database Integration**: Replace file-based storage with a database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add login system for admin panel
3. **Image Upload**: Direct upload to ImageKit from CMS
4. **Bulk Operations**: Import/export products
5. **Version History**: Track changes to products
6. **Rich Text Editor**: WYSIWYG editor for descriptions
7. **SEO Fields**: Meta titles, descriptions, keywords
8. **Pricing**: Add pricing information
9. **Inventory**: Track stock levels
10. **Analytics**: Track product views and clicks

## Current Limitations

- Changes are saved to memory only (refresh will reset)
- No authentication (anyone can access `/admin`)
- No image upload (requires manual ImageKit URL)
- No persistent storage (data in code)

## Recommended Setup for Production

1. **Add Authentication**:
   ```bash
   npm install next-auth
   ```

2. **Add Database**:
   ```bash
   npm install @prisma/client prisma
   # or
   npm install mongoose
   ```

3. **Add Image Upload**:
   ```bash
   npm install imagekit-nodejs
   ```

4. **Environment Variables**:
   ```env
   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=your_endpoint
   DATABASE_URL=your_database_url
   ```

---

**Note**: The current implementation uses in-memory storage for demo purposes. For production, implement database persistence.

