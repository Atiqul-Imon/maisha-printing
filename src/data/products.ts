/**
 * Products and Services Data
 */

import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    title: 'T-Shirt Printing',
    shortDescription: 'High-quality custom t-shirt printing with various techniques for all your branding needs.',
    longDescription: 'We specialize in professional t-shirt printing services using the latest technology and high-quality materials. Whether you need custom designs for your business, event, or organization, we deliver durable and vibrant prints that last.',
    category: 'service',
    subcategory: 'Apparel Printing',
    slug: 't-shirt-printing',
    featured: true,
    images: [
      { url: '/products/t-shirt-1.jpg', alt: 'Custom printed t-shirt front view' },
      { url: '/products/t-shirt-2.jpg', alt: 'Custom printed t-shirt back view' },
      { url: '/products/t-shirt-3.jpg', alt: 'Different t-shirt printing styles' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '2',
    title: 'Glass Printing',
    shortDescription: 'Professional glass printing for windows, doors, and display units with stunning clarity.',
    longDescription: 'Transform your windows and glass surfaces with our professional glass printing services. Perfect for retail stores, offices, and homes. We use advanced techniques to ensure durability and visual appeal.',
    category: 'service',
    subcategory: 'Specialty Printing',
    slug: 'glass-printing',
    featured: true,
    images: [
      { url: '/products/glass-1.jpg', alt: 'Glass window printing example' },
      { url: '/products/glass-2.jpg', alt: 'Glass door printing design' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '3',
    title: 'Calendar Printing',
    shortDescription: 'Custom calendar printing for businesses and organizations with your branding.',
    longDescription: 'Create stunning custom calendars for your business or organization. Available in various sizes and formats, perfect for promotional giveaways or internal use.',
    category: 'service',
    subcategory: 'Document Printing',
    slug: 'calendar-printing',
    featured: true,
    images: [
      { url: '/products/calendar-1.jpg', alt: 'Custom printed calendar design' },
      { url: '/products/calendar-2.jpg', alt: 'Different calendar sizes and formats' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '4',
    title: 'ID Card Printing',
    shortDescription: 'Professional ID card printing with security features and custom designs.',
    longDescription: 'High-quality ID card printing services for businesses, schools, and organizations. We offer various security features including holograms, barcodes, and custom designs.',
    category: 'service',
    subcategory: 'Security Printing',
    slug: 'id-card-printing',
    featured: true,
    images: [
      { url: '/products/id-card-1.jpg', alt: 'Professional ID card sample' },
      { url: '/products/id-card-2.jpg', alt: 'ID card with security features' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '5',
    title: 'Ribbon Printing',
    shortDescription: 'Custom ribbon printing for events, celebrations, and promotional purposes.',
    longDescription: 'Add elegance to your events with custom printed ribbons. Perfect for gift wrapping, awards, and promotional materials.',
    category: 'service',
    subcategory: 'Specialty Printing',
    slug: 'ribbon-printing',
    featured: false,
    images: [
      { url: '/products/ribbon-1.jpg', alt: 'Custom printed ribbon samples' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '6',
    title: 'Sticker Printing',
    shortDescription: 'Durable sticker printing for branding, decoration, and promotional campaigns.',
    longDescription: 'High-quality sticker printing services for all your branding needs. Waterproof and weather-resistant options available.',
    category: 'service',
    subcategory: 'Label Printing',
    slug: 'sticker-printing',
    featured: false,
    images: [
      { url: '/products/sticker-1.jpg', alt: 'Custom sticker designs' },
      { url: '/products/sticker-2.jpg', alt: 'Various sticker shapes and sizes' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '7',
    title: 'Visiting Card',
    shortDescription: 'Professional business card printing with premium finishes and custom designs.',
    longDescription: 'Make a lasting impression with our premium business card printing services. Various paper stocks and finishes available including matte, glossy, and textured options.',
    category: 'service',
    subcategory: 'Document Printing',
    slug: 'visiting-card',
    featured: true,
    images: [
      { url: '/products/visiting-card-1.jpg', alt: 'Premium business card designs' },
      { url: '/products/visiting-card-2.jpg', alt: 'Different card finishes and styles' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
  {
    id: '8',
    title: 'Flyer & Brochure',
    shortDescription: 'Marketing materials and promotional printing for effective brand communication.',
    longDescription: 'Professional flyer and brochure printing services to help promote your business. Various sizes, folds, and paper options available.',
    category: 'service',
    subcategory: 'Marketing Materials',
    slug: 'flyer-brochure',
    featured: false,
    images: [
      { url: '/products/flyer-1.jpg', alt: 'Professional flyer designs' },
      { url: '/products/brochure-1.jpg', alt: 'Tri-fold brochure examples' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-02',
  },
];

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category || product.subcategory === category);
}

