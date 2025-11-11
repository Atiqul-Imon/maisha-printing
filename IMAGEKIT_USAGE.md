# ImageKit Integration Guide

This project uses ImageKit for optimized image delivery and transformation.

## Configuration

ImageKit is configured with the following credentials:
- **URL Endpoint**: `https://ik.imagekit.io/dtqqmnmqo`
- **Public Key**: `3rFwnAaqLowbj9kSg+js94pt7s4=`
- **ImageKit ID**: `dtqqmnmqo`

## Usage

### Using ImageKitImage Component

The `ImageKitImage` component is a wrapper around Next.js Image component that automatically uses ImageKit for image optimization:

```tsx
import ImageKitImage from '@/components/ImageKitImage';

// Basic usage
<ImageKitImage
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// With custom quality and format
<ImageKitImage
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  quality={90}
  format="webp"
/>

// Fill container (responsive)
<ImageKitImage
  src="/path/to/image.jpg"
  alt="Description"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Priority loading for above-the-fold images
<ImageKitImage
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
/>
```

### Using ImageKit Utility Functions

You can also use the utility functions directly:

```tsx
import { getImageKitUrl } from '@/lib/imagekit';

// Get optimized ImageKit URL
const imageUrl = getImageKitUrl('/path/to/image.jpg', {
  width: 800,
  height: 600,
  quality: 80,
  format: 'auto'
});

// For responsive images
import { getImageKitSrcSet } from '@/lib/imagekit';

const srcSet = getImageKitSrcSet('/path/to/image.jpg', [400, 800, 1200]);
```

## ImageKit Transformations

The ImageKit integration supports various transformations:

- **width**: Resize width
- **height**: Resize height
- **quality**: Image quality (0-100)
- **format**: Image format ('auto', 'webp', 'jpg', 'png')
- **blur**: Apply blur effect

## Best Practices

1. **Use ImageKitImage component** for all images to ensure optimization
2. **Set appropriate sizes** for responsive images
3. **Use `priority` prop** for above-the-fold images
4. **Use `quality={80}`** for good balance between size and quality
5. **Use `format="auto"`** to let ImageKit choose the best format

## Image Paths

Images should be referenced using paths relative to your ImageKit media library:

- ✅ `/products/t-shirt.jpg` - Correct
- ✅ `products/t-shirt.jpg` - Correct (leading slash optional)
- ✅ `https://ik.imagekit.io/dtqqmnmqo/products/t-shirt.jpg` - Already ImageKit URL
- ❌ `./images/t-shirt.jpg` - Use absolute path instead

## External Images

You can also proxy external images through ImageKit:

```tsx
<ImageKitImage
  src="https://example.com/image.jpg"
  alt="External image"
  width={800}
  height={600}
/>
```

## Next.js Configuration

ImageKit domain is already configured in `next.config.ts` to work with Next.js Image component.

## Uploading Images

For uploading images to ImageKit, you'll need to use the ImageKit API with your private key. This should be done server-side for security.

---

**ImageKit Documentation**: https://docs.imagekit.io/

