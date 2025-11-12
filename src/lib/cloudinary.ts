/**
 * Cloudinary Configuration and Utility Functions
 */

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dtlei66pd',
  apiKey: process.env.CLOUDINARY_API_KEY || '377298682877756',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '3x6gozmjju_-6G8plxKO2S9GwmM',
} as const;

// Initialize Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  api_key: CLOUDINARY_CONFIG.apiKey,
  api_secret: CLOUDINARY_CONFIG.apiSecret,
  secure: true,
});

export default cloudinary;

/**
 * Generate Cloudinary URL with optional transformations
 * @param publicId - Image public ID or URL
 * @param transformations - Optional Cloudinary transformation parameters
 * @returns Optimized Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: string;
    [key: string]: string | number | undefined;
  }
): string {
  // If already a Cloudinary URL, extract public ID and apply transformations
  if (publicId.includes('res.cloudinary.com')) {
    try {
      // Extract public ID from URL (format: .../upload/v1234567/folder/image.jpg)
      const urlParts = publicId.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex > 0 && uploadIndex < urlParts.length - 1) {
        // Get everything after 'upload' (skip version if present)
        const afterUpload = urlParts.slice(uploadIndex + 1);
        // Remove version number if present (starts with 'v' followed by digits)
        const withoutVersion = afterUpload[0]?.match(/^v\d+$/) 
          ? afterUpload.slice(1) 
          : afterUpload;
        // Join to get public ID and remove file extension
        const extractedPublicId = withoutVersion.join('/').split('.')[0];
        
        // Build transformation options
        const transformOptions: {
          secure: boolean;
          width?: number;
          height?: number;
          quality?: number | 'auto';
          format?: string;
          fetch_format?: string;
          crop?: string;
        } = {
          secure: true,
        };
        
        if (transformations) {
          if (transformations.width) transformOptions.width = transformations.width;
          if (transformations.height) transformOptions.height = transformations.height;
          if (transformations.quality && transformations.quality !== 'auto') {
            transformOptions.quality = transformations.quality;
          } else if (transformations.quality === 'auto') {
            transformOptions.quality = 'auto';
          }
          if (transformations.format && transformations.format !== 'auto') {
            transformOptions.format = transformations.format;
          } else if (transformations.format === 'auto') {
            transformOptions.fetch_format = 'auto';
          }
          if (transformations.crop) transformOptions.crop = transformations.crop;
        }
        
        return cloudinary.url(extractedPublicId, transformOptions);
      }
    } catch (error) {
      console.error('Error parsing Cloudinary URL:', error);
    }
    // If extraction fails, return original URL
    return publicId;
  }

  // If it's an external URL, use fetch transformation
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    const transformOptions: {
      type: 'fetch';
      secure: boolean;
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    } = {
      type: 'fetch',
      secure: true,
    };
    
    if (transformations) {
      if (transformations.width) transformOptions.width = transformations.width;
      if (transformations.height) transformOptions.height = transformations.height;
      if (transformations.quality && transformations.quality !== 'auto') {
        transformOptions.quality = transformations.quality;
      }
      if (transformations.format && transformations.format !== 'auto') {
        transformOptions.format = transformations.format;
      }
    }
    
    return cloudinary.url(publicId, transformOptions);
  }

  // Use as public ID directly
  const transformOptions: {
    secure: boolean;
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  } = {
    secure: true,
  };
  
  if (transformations) {
    if (transformations.width) transformOptions.width = transformations.width;
    if (transformations.height) transformOptions.height = transformations.height;
    if (transformations.quality && transformations.quality !== 'auto') {
      transformOptions.quality = transformations.quality;
    }
    if (transformations.format && transformations.format !== 'auto') {
      transformOptions.format = transformations.format;
    }
    if (transformations.crop) transformOptions.crop = transformations.crop;
  }
  
  return cloudinary.url(publicId, transformOptions);
}

/**
 * Generate responsive Cloudinary srcset
 */
export function getCloudinarySrcSet(
  publicId: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  return sizes
    .map(
      (size) =>
        `${getCloudinaryUrl(publicId, { width: size, quality: 'auto', format: 'auto' })} ${size}w`
    )
    .join(', ');
}

