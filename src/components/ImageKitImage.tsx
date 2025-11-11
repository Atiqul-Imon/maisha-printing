'use client';

import Image from 'next/image';
import { getImageKitUrl } from '@/lib/imagekit';
import { useState } from 'react';

interface ImageKitImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function ImageKitImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  format = 'auto',
  className = '',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  loading = 'lazy',
  objectFit = 'cover',
}: ImageKitImageProps) {
  const [error, setError] = useState(false);

  // Generate ImageKit URL with transformations
  // For responsive images, Next.js will handle srcset automatically
  const imageKitUrl = getImageKitUrl(src, {
    width: width,
    height: height,
    quality,
    format,
  });

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

  if (fill) {
    return (
      <Image
        src={imageKitUrl}
        alt={alt}
        fill
        className={className}
        quality={quality}
        sizes={sizes}
        priority={priority}
        loading={loading}
        style={{ objectFit }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={imageKitUrl}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      quality={quality}
      sizes={sizes}
      priority={priority}
      loading={loading}
      style={{ objectFit }}
      onError={() => setError(true)}
    />
  );
}

