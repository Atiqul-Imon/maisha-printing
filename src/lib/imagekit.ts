/**
 * ImageKit Configuration and Utility Functions
 */

// ImageKit Configuration
export const IMAGEKIT_CONFIG = {
  urlEndpoint: 'https://ik.imagekit.io/dtqqmnmqo',
  publicKey: '3rFwnAaqLowbj9kSg+js94pt7s4=',
  privateKey: 'CELMONWRfc5WrCRuwKsW3raUqw=', // Keep confidential - only for server-side operations
  imageKitId: 'dtqqmnmqo',
} as const;

/**
 * Generate ImageKit URL with optional transformations
 * @param src - Image path or URL
 * @param transformations - Optional ImageKit transformation parameters
 * @returns Optimized ImageKit URL
 */
export function getImageKitUrl(
  src: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    blur?: number;
    [key: string]: string | number | undefined;
  }
): string {
  // If already an ImageKit URL, return as is (but we can still apply transformations)
  if (src.startsWith(IMAGEKIT_CONFIG.urlEndpoint)) {
    // Extract the path from existing ImageKit URL
    const urlParts = src.replace(IMAGEKIT_CONFIG.urlEndpoint, '').split('/');
    const path = urlParts[urlParts.length - 1];
    
    if (transformations && Object.keys(transformations).length > 0) {
      const transformString = buildTransformString(transformations);
      return `${IMAGEKIT_CONFIG.urlEndpoint}/tr:${transformString}/${path}`;
    }
    return src;
  }

  // If it's an external URL, proxy it through ImageKit
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const transformString = transformations
      ? buildTransformString(transformations)
      : '';
    const encodedUrl = encodeURIComponent(src);
    return `${IMAGEKIT_CONFIG.urlEndpoint}${transformString ? `/tr:${transformString}` : ''}/external:${encodedUrl}`;
  }

  // Build the transformation string
  const transformString = transformations
    ? buildTransformString(transformations)
    : '';

  // Construct ImageKit URL
  // Path should not start with / for ImageKit
  const path = src.startsWith('/') ? src.substring(1) : src;
  return `${IMAGEKIT_CONFIG.urlEndpoint}${transformString ? `/tr:${transformString}` : ''}/${path}`;
}

/**
 * Build ImageKit transformation string
 */
function buildTransformString(
  transformations: Record<string, string | number | undefined>
): string {
  const params: string[] = [];

  if (transformations.width) params.push(`w-${transformations.width}`);
  if (transformations.height) params.push(`h-${transformations.height}`);
  if (transformations.quality) params.push(`q-${transformations.quality}`);
  if (transformations.format) params.push(`f-${transformations.format}`);
  if (transformations.blur) params.push(`bl-${transformations.blur}`);

  // Add any other transformation parameters
  Object.entries(transformations).forEach(([key, value]) => {
    if (
      value &&
      !['width', 'height', 'quality', 'format', 'blur'].includes(key)
    ) {
      params.push(`${key}-${value}`);
    }
  });

  return params.join(',');
}

/**
 * Generate responsive ImageKit srcset
 */
export function getImageKitSrcSet(
  src: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  return sizes
    .map(
      (size) =>
        `${getImageKitUrl(src, { width: size, quality: 80, format: 'auto' })} ${size}w`
    )
    .join(', ');
}

