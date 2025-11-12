import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionFromCookie } from '@/lib/auth-custom';
import { revalidateTag } from 'next/cache';

// PUT - Update product orders in bulk
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const collection = await getProductsCollection();
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'MongoDB not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update all products in bulk
    const updatePromises = products.map((product: { id: string; order: number }) => {
      return collection.updateOne(
        { _id: new ObjectId(product.id) },
        { $set: { order: product.order, updatedAt: new Date().toISOString() } }
      );
    });

    await Promise.all(updatePromises);

    // Revalidate cache after reordering products
    revalidateTag('products');

    return NextResponse.json({
      success: true,
      message: 'Product order updated successfully',
    });
  } catch (error) {
    console.error('Error updating product order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product order' },
      { status: 500 }
    );
  }
}

