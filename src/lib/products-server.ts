/**
 * Server-side Product Data Layer - MongoDB Integration
 * This file should ONLY be imported in Server Components or API routes
 */

import { Product } from '@/types/product';
import { getProductsCollection } from './mongodb';

/**
 * Get all products from MongoDB (Server-side only)
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      // MongoDB not configured, use fallback
      const { getAllProducts: getLocalProducts } = await import('@/data/products');
      return getLocalProducts();
    }
    
    // Sort by order (ascending), then by createdAt if order is not set
    const products = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
    
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
 * Get product by slug from MongoDB (Server-side only)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
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

