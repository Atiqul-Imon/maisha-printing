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
  images: ProductImage[];
  featured: boolean;
  slug: string;
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

