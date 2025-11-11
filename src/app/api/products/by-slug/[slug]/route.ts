import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';

// GET - Fetch product by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      // MongoDB not configured, use fallback
      const { getProductBySlug } = await import('@/data/products');
      const product = getProductBySlug(params.slug);
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: product });
    }
    
    const product = await collection.findOne({ slug: params.slug });

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
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

