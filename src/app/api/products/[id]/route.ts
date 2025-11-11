import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }
    
    const product = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const formattedProduct = {
      ...product,
      id: product._id.toString(),
      _id: undefined,
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }
    
    const body = await request.json();

    // Check if product exists
    const existingProduct = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug exists
    if (body.slug && body.slug !== existingProduct.slug) {
      const slugExists = await collection.findOne({ 
        slug: body.slug,
        _id: { $ne: new ObjectId(params.id) }
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update product
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    const updatedProduct = await collection.findOne({ _id: new ObjectId(params.id) });
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found after update' },
        { status: 404 }
      );
    }

    const formattedProduct = {
      ...updatedProduct,
      id: updatedProduct._id.toString(),
      _id: undefined,
    };

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: formattedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

