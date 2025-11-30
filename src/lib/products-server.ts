/**
 * Server-side Product Data Layer - MongoDB Integration
 * This file should ONLY be imported in Server Components or API routes
 */

import { Product } from '@/types/product';
import { getProductsCollection } from './mongodb';
import { unstable_cache } from 'next/cache';

/**
 * Internal function to fetch all products from MongoDB (uncached)
 */
async function _getAllProductsUncached(): Promise<Product[]> {
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      // MongoDB not configured, use fallback
      const { getAllProducts: getLocalProducts } = await import('@/data/products');
      return getLocalProducts();
    }
    
    // Sort by order (ascending), then by createdAt if order is not set
    // Use projection to exclude _id field after conversion (slightly more efficient)
    const products = await collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    
    // Convert MongoDB _id to string id
    return products.map((product: Record<string, unknown> & { _id: { toString: () => string } }) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    })) as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error);
    // Fallback to local data
    const { getAllProducts: getLocalProducts } = await import('@/data/products');
    return getLocalProducts();
  }
}

/**
 * Get all products from MongoDB (Server-side only)
 * Cached for 30 seconds to improve performance and ensure fresh data
 */
export async function getAllProducts(): Promise<Product[]> {
  return unstable_cache(
    async () => _getAllProductsUncached(),
    ['all-products'],
    {
      revalidate: 30, // Revalidate every 30 seconds for fresher data
      tags: ['products'],
    }
  )();
}

/**
 * Internal function to fetch product by slug (uncached)
 */
async function _getProductBySlugUncached(slug: string): Promise<Product | null> {
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      // MongoDB not configured, use fallback
      const { getProductBySlug: getLocalProduct } = await import('@/data/products');
      return getLocalProduct(slug) || null;
    }
    
    const product = await collection.findOne({ slug });

    if (!product) {
      // Fallback to local data
      const { getProductBySlug: getLocalProduct } = await import('@/data/products');
      return getLocalProduct(slug) || null;
    }

    return {
      ...product,
      id: product._id.toString(),
      _id: undefined,
    } as unknown as Product;
  } catch (error) {
    console.error('Error fetching product by slug from MongoDB:', error);
    // Fallback to local data
    const { getProductBySlug: getLocalProduct } = await import('@/data/products');
    return getLocalProduct(slug) || null;
  }
}

/**
 * Get product by slug from MongoDB (Server-side only)
 * Cached for 60 seconds to improve performance
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return unstable_cache(
    async () => _getProductBySlugUncached(slug),
    [`product-${slug}`],
    {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['products', `product-${slug}`],
    }
  )();
}

/**
 * Get featured products
 * Uses cached getAllProducts for better performance
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.featured);
}

/**
 * Get products by category
 * Uses cached getAllProducts for better performance
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(
    (product) => product.category === category || product.subcategory === category
  );
}

/**
 * Get related products (excluding current product)
 * Optimized to use cached getAllProducts
 */
export async function getRelatedProducts(
  excludeProductId: string,
  limit: number = 4
): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((product) => product.id !== excludeProductId)
    .slice(0, limit);
}

