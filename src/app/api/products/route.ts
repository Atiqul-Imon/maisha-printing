import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';
import { Product } from '@/types/product';
import { getSessionFromCookie } from '@/lib/auth-custom';
import { getAllProducts } from '@/lib/products-server';
import { revalidateTag } from 'next/cache';
import { generateSlug, generateUniqueSlug } from '@/lib/slug';

// GET - Fetch all products (with caching)
export async function GET(request: NextRequest) {
  try {
    // Use cached server-side function for better performance
    let products = await getAllProducts();
    
    // Optional query parameters for optimization
    const searchParams = request.nextUrl.searchParams;
    const excludeId = searchParams.get('exclude');
    const limit = searchParams.get('limit');
    const categorySlug = searchParams.get('category');
    
    // Filter by category if specified
    if (categorySlug) {
      products = products.filter((p) => p.categorySlug === categorySlug);
    }
    
    // Filter out excluded product if specified
    if (excludeId) {
      products = products.filter((p) => p.id !== excludeId);
    }
    
    // Apply limit if specified (for related products)
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        products = products.slice(0, limitNum);
      }
    }
    
    // Return with cache headers
    return NextResponse.json(
      { success: true, data: products },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!body.title || !body.shortDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title and shortDescription are required)' },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    let finalSlug = body.slug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = generateSlug(body.title);
    } else {
      // Normalize provided slug
      finalSlug = generateSlug(finalSlug);
    }

    // Ensure slug is unique
    const checkSlugExists = async (slug: string): Promise<boolean> => {
      const existing = await collection.findOne({ slug });
      return !!existing;
    };

    finalSlug = await generateUniqueSlug(finalSlug, checkSlugExists);

    // Get the highest order number to set for new product
    // Use projection to only fetch the order field (more efficient)
    const lastProduct = await collection.findOne(
      {},
      { sort: { order: -1 }, projection: { order: 1 } }
    );
    const nextOrder = lastProduct && lastProduct.order ? lastProduct.order + 1 : 1;

    // Create product object
    const product: Omit<Product, 'id'> = {
      title: body.title,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription || '',
      category: body.category || 'service',
      subcategory: body.subcategory || '',
      categorySlug: body.categorySlug || undefined,
      slug: finalSlug,
      featured: body.featured || false,
      images: body.images || [],
      price: body.price !== undefined && body.price !== null && body.price !== '' ? parseFloat(body.price) : undefined,
      currency: body.currency || 'BDT',
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      order: body.order !== undefined ? body.order : nextOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert into database
    const result = await collection.insertOne(product);

    // Revalidate cache after creating product
    revalidateTag('products');

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: { ...product, id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

