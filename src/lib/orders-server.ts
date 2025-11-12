/**
 * Server-side Order Data Layer - MongoDB Integration
 * This file should ONLY be imported in Server Components or API routes
 */

import { Order, OrderFilters, OrderSummary } from '@/types/order';
import { getOrdersCollection } from './mongodb';
import { unstable_cache } from 'next/cache';
import { ObjectId } from 'mongodb';

/**
 * Generate unique order number
 * Format: ORD-YYYY-XXXXX (e.g., ORD-2024-00001)
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORD-${year}-${random}`;
}

/**
 * Internal function to fetch all orders from MongoDB (uncached)
 */
async function _getAllOrdersUncached(filters?: OrderFilters): Promise<Order[]> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      return [];
    }
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }
    
    if (filters?.search) {
      const searchRegex = { $regex: filters.search, $options: 'i' };
      query.$or = [
        { orderNumber: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
        { 'customer.email': searchRegex },
      ];
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      const dateQuery: Record<string, string> = {};
      if (filters.dateFrom) {
        dateQuery.$gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        dateQuery.$lte = filters.dateTo;
      }
      query.createdAt = dateQuery;
    }
    
    // Build sort
    const sort: Record<string, 1 | -1> = { createdAt: -1 }; // Newest first
    
    // Build options
    const options: { limit?: number; skip?: number } = {};
    if (filters?.limit) {
      options.limit = filters.limit;
    }
    if (filters?.skip) {
      options.skip = filters.skip;
    }
    
    const orders = await collection.find(query).sort(sort).limit(options.limit || 0).skip(options.skip || 0).toArray();
    
    // Convert MongoDB _id to string id
    return orders.map((order: Record<string, unknown> & { _id: { toString: () => string } }) => ({
      ...order,
      id: order._id.toString(),
      _id: undefined,
    })) as unknown as Order[];
  } catch (error) {
    console.error('Error fetching orders from MongoDB:', error);
    return [];
  }
}

/**
 * Get all orders from MongoDB (Server-side only)
 * Cached for 30 seconds to improve performance
 */
export async function getAllOrders(filters?: OrderFilters): Promise<Order[]> {
  const cacheKey = filters 
    ? `orders-${JSON.stringify(filters)}`
    : 'all-orders';
  
  return unstable_cache(
    async () => _getAllOrdersUncached(filters),
    [cacheKey],
    {
      revalidate: 30, // Revalidate every 30 seconds
      tags: ['orders'],
    }
  )();
}

/**
 * Internal function to fetch order by ID (uncached)
 */
async function _getOrderByIdUncached(orderId: string): Promise<Order | null> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      return null;
    }
    
    const order = await collection.findOne({ _id: new ObjectId(orderId) });
    
    if (!order) {
      return null;
    }
    
    return {
      ...order,
      id: order._id.toString(),
      _id: undefined,
    } as unknown as Order;
  } catch (error) {
    console.error('Error fetching order by ID from MongoDB:', error);
    return null;
  }
}

/**
 * Get order by ID from MongoDB (Server-side only)
 * Cached for 30 seconds
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  return unstable_cache(
    async () => _getOrderByIdUncached(orderId),
    [`order-${orderId}`],
    {
      revalidate: 30,
      tags: ['orders', `order-${orderId}`],
    }
  )();
}

/**
 * Get order by order number
 */
export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      return null;
    }
    
    const order = await collection.findOne({ orderNumber });
    
    if (!order) {
      return null;
    }
    
    return {
      ...order,
      id: order._id.toString(),
      _id: undefined,
    } as unknown as Order;
  } catch (error) {
    console.error('Error fetching order by order number from MongoDB:', error);
    return null;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      throw new Error('MongoDB not configured');
    }
    
    // Generate order number
    let orderNumber = generateOrderNumber();
    
    // Ensure order number is unique
    let exists = await collection.findOne({ orderNumber });
    let attempts = 0;
    while (exists && attempts < 10) {
      orderNumber = generateOrderNumber();
      exists = await collection.findOne({ orderNumber });
      attempts++;
    }
    
    if (exists) {
      throw new Error('Failed to generate unique order number');
    }
    
    const now = new Date().toISOString();
    const order: Omit<Order, 'id'> = {
      ...orderData,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await collection.insertOne(order);
    
    return {
      ...order,
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Update an order
 */
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      throw new Error('MongoDB not configured');
    }
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Remove id and _id from update data
    delete (updateData as { id?: string }).id;
    delete (updateData as { _id?: unknown })._id;
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return null;
    }
    
    return {
      ...result,
      id: result._id.toString(),
      _id: undefined,
    } as unknown as Order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Delete an order
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      throw new Error('MongoDB not configured');
    }
    
    const result = await collection.deleteOne({ _id: new ObjectId(orderId) });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

/**
 * Get order summary statistics
 */
export async function getOrderSummary(): Promise<OrderSummary> {
  try {
    const collection = await getOrdersCollection();
    if (!collection) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        inProgressOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
      };
    }
    
    const [
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      revenueData,
      pendingRevenueData,
    ] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ status: 'pending' }),
      collection.countDocuments({ status: 'in_progress' }),
      collection.countDocuments({ status: 'completed' }),
      collection.aggregate([
        { $match: { status: 'completed', paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]).toArray(),
      collection.aggregate([
        { $match: { $or: [{ status: 'pending' }, { status: 'confirmed' }, { status: 'in_progress' }] } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]).toArray(),
    ]);
    
    const totalRevenue = revenueData[0]?.total || 0;
    const pendingRevenue = pendingRevenueData[0]?.total || 0;
    
    return {
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalRevenue,
      pendingRevenue,
    };
  } catch (error) {
    console.error('Error getting order summary:', error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      pendingRevenue: 0,
    };
  }
}

