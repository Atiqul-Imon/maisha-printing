/**
 * Product/Service Types
 */

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: 'service' | 'product';
  subcategory?: string;
  categorySlug?: string; // Link to a category page (e.g., 'id-card-accessories')
  images: ProductImage[];
  featured: boolean;
  slug: string;
  price?: number; // Product price in BDT
  currency?: string; // Currency code (default: 'BDT')
  metaTitle?: string;
  metaDescription?: string;
  order?: number; // For drag-and-drop reordering
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

