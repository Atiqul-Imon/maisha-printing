import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products-server';

// GET - Fetch product by slug (with caching)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  try {
    // Use cached server-side function for better performance
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Return with cache headers
    return NextResponse.json(
      { success: true, data: product },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

