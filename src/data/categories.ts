/**
 * Category definitions for the product catalog
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
}

export const categories: Category[] = [
  {
    id: 'id-card-accessories',
    name: 'ID Card Accessories',
    slug: 'id-card-accessories',
    description: 'Premium accessories for ID cards including clips, holders, and more',
    order: 1,
  },
  {
    id: 'id-card-holder',
    name: 'ID Card Holder',
    slug: 'id-card-holder',
    description: 'Durable and stylish ID card holders for professional use',
    order: 2,
  },
  {
    id: 'uv-id-card',
    name: 'UV ID Card',
    slug: 'uv-id-card',
    description: 'Ultra-durable UV-protected ID cards with advanced security features',
    order: 3,
  },
  {
    id: 'id-card-ribbon-lanyard',
    name: 'ID Card Ribbon-Lanyard',
    slug: 'id-card-ribbon-lanyard',
    description: 'Professional lanyards and ribbons for ID card display',
    order: 4,
  },
  {
    id: 'products',
    name: 'Products',
    slug: 'products',
    description: 'Our wide range of printing products',
    order: 5,
  },
  {
    id: 'digital-offset-printing',
    name: 'Digital Offset Printing',
    slug: 'digital-offset-printing',
    description: 'High-quality digital and offset printing services',
    order: 6,
  },
];

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

/**
 * Get all categories sorted by order
 */
export function getAllCategories(): Category[] {
  return [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
}

