import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionFromCookie } from '@/lib/auth-custom';
import { revalidateTag } from 'next/cache';
import { generateSlug, generateUniqueSlug } from '@/lib/slug';
import { Product } from '@/types/product';

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

    // Handle slug generation and uniqueness
    let finalSlug = body.slug;
    if (body.slug && body.slug !== existingProduct.slug) {
      // Normalize the slug
      finalSlug = generateSlug(body.slug);
      
      // Ensure slug is unique (excluding current product)
      const checkSlugExists = async (slug: string): Promise<boolean> => {
        const existing = await collection.findOne({ 
          slug,
          _id: { $ne: new ObjectId(params.id) }
        });
        return !!existing;
      };

      finalSlug = await generateUniqueSlug(finalSlug, checkSlugExists);
    } else if (!body.slug && body.title && body.title !== existingProduct.title) {
      // If title changed but no slug provided, generate from new title
      finalSlug = generateSlug(body.title);
      
      // Ensure slug is unique
      const checkSlugExists = async (slug: string): Promise<boolean> => {
        const existing = await collection.findOne({ 
          slug,
          _id: { $ne: new ObjectId(params.id) }
        });
        return !!existing;
      };

      finalSlug = await generateUniqueSlug(finalSlug, checkSlugExists);
    } else {
      // Keep existing slug
      finalSlug = existingProduct.slug;
    }

    // Update product
    const updateData: Partial<Product> & { updatedAt: string } = {
      ...body,
      slug: finalSlug,
      updatedAt: new Date().toISOString(),
    };

    // Handle price field - convert to number or undefined
    if (body.price !== undefined) {
      if (body.price === null || body.price === '') {
        updateData.price = undefined;
      } else {
        const priceValue = parseFloat(body.price);
        updateData.price = isNaN(priceValue) ? undefined : priceValue;
      }
    }

    // Always set currency to BDT
    updateData.currency = 'BDT';

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

    // Revalidate cache after updating product
    revalidateTag('products');
    if (updatedProduct.slug) {
      revalidateTag(`product-${updatedProduct.slug}`);
    }
    // Also revalidate old slug if it changed
    if (existingProduct.slug && existingProduct.slug !== updatedProduct.slug) {
      revalidateTag(`product-${existingProduct.slug}`);
    }

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

    // Revalidate cache after deleting product
    revalidateTag('products');

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

