'use client';

import Image from 'next/image';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { useState, useMemo, useEffect } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  quality = 'auto',
  format = 'auto',
  className = '',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  loading = 'lazy',
  objectFit = 'cover',
}: CloudinaryImageProps) {
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Generate Cloudinary URL with transformations - memoize to prevent hydration mismatches
  const cloudinaryUrl = useMemo(() => {
    if (!mounted) {
      // Return a placeholder during SSR to prevent hydration mismatch
      return src;
    }
    return getCloudinaryUrl(src, {
      width: width,
      height: height,
      quality,
      format,
      crop: width && height ? 'fill' : 'limit',
    });
  }, [src, width, height, quality, format, mounted]);

  // Set mounted flag on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback if image fails to load
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  // Cloudinary already handles optimization, so we use unoptimized for direct Cloudinary URLs
  // This prevents Next.js from trying to optimize already-optimized images
  const isCloudinaryUrl = cloudinaryUrl.includes('res.cloudinary.com');
  
  // Prepare image props - can't use both priority and loading
  const baseProps = {
    src: cloudinaryUrl,
    alt,
    className,
    quality: typeof quality === 'number' ? quality : 80,
    sizes,
    style: { objectFit: objectFit as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' },
    onError: () => setError(true),
    unoptimized: isCloudinaryUrl, // Cloudinary handles optimization
  };

  // Only set priority or loading, not both
  if (priority) {
    if (fill) {
      return <Image {...baseProps} fill priority />;
    }
    return <Image {...baseProps} width={width || 800} height={height || 600} priority />;
  } else {
    if (fill) {
      return <Image {...baseProps} fill loading={loading} />;
    }
    return <Image {...baseProps} width={width || 800} height={height || 600} loading={loading} />;
  }
}

