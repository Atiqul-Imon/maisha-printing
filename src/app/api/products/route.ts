import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';
import { Product } from '@/types/product';

// GET - Fetch all products
export async function GET() {
  try {
    const collection = await getProductsCollection();
    if (!collection) {
      // MongoDB not configured, use fallback
      const { getAllProducts } = await import('@/data/products');
      const products = getAllProducts();
      return NextResponse.json({ success: true, data: products });
    }
    
    // Sort by order (ascending), then by createdAt if order is not set
    const products = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
    
    // Convert MongoDB _id to string id
    const formattedProducts = products.map((product: Record<string, unknown> & { _id: { toString: () => string } }) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    })) as unknown as Product[];

    return NextResponse.json({ success: true, data: formattedProducts });
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
    const collection = await getProductsCollection();
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }
    
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.shortDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await collection.findOne({ slug: body.slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Get the highest order number to set for new product
    const lastProduct = await collection.findOne({}, { sort: { order: -1 } });
    const nextOrder = lastProduct && lastProduct.order ? lastProduct.order + 1 : 1;

    // Create product object
    const product: Omit<Product, 'id'> = {
      title: body.title,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription || '',
      category: body.category || 'service',
      subcategory: body.subcategory || '',
      slug: body.slug,
      featured: body.featured || false,
      images: body.images || [],
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      order: body.order !== undefined ? body.order : nextOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert into database
    const result = await collection.insertOne(product);

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

