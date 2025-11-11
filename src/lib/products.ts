/**
 * Client-side Product Data Layer - API Integration
 * This file is for client components only
 */

import { Product } from '@/types/product';

/**
 * Client-side fetch all products from API
 */
export async function getAllProducts(): Promise<Product[]> {
  return getAllProductsClient();
}

/**
 * Client-side fetch from API (for client components)
 */
export async function getAllProductsClient(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

/**
 * Client-side fetch product by slug
 */
export async function getProductBySlugClient(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/by-slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching product by slug from API:', error);
    return null;
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.featured);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(
    (product) => product.category === category || product.subcategory === category
  );
}

