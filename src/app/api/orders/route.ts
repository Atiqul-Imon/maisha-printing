import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth-custom';
import { getAllOrders, createOrder, getOrderSummary } from '@/lib/orders-server';
import { revalidateTag } from 'next/cache';
import { OrderFilters } from '@/types/order';

// GET - Fetch all orders (with caching and filters)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters: OrderFilters = {};
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as OrderFilters['status'];
    }
    
    if (searchParams.get('paymentStatus')) {
      filters.paymentStatus = searchParams.get('paymentStatus') as OrderFilters['paymentStatus'];
    }
    
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search') || undefined;
    }
    
    if (searchParams.get('dateFrom')) {
      filters.dateFrom = searchParams.get('dateFrom') || undefined;
    }
    
    if (searchParams.get('dateTo')) {
      filters.dateTo = searchParams.get('dateTo') || undefined;
    }
    
    if (searchParams.get('limit')) {
      filters.limit = parseInt(searchParams.get('limit') || '50', 10);
    }
    
    if (searchParams.get('skip')) {
      filters.skip = parseInt(searchParams.get('skip') || '0', 10);
    }
    
    // Get orders
    const orders = await getAllOrders(filters);
    
    // If summary requested
    if (searchParams.get('summary') === 'true') {
      const summary = await getOrderSummary();
      return NextResponse.json(
        { success: true, data: orders, summary },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        }
      );
    }
    
    // Return with cache headers
    return NextResponse.json(
      { success: true, data: orders },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one order item is required' },
        { status: 400 }
      );
    }
    
    if (!body.customer || !body.customer.name || !body.customer.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone are required' },
        { status: 400 }
      );
    }
    
    // Calculate totals
    let subtotal = 0;
    const itemsWithTotals = body.items.map((item: { quantity: number; unitPrice: number; totalPrice?: number }) => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      return {
        ...item,
        totalPrice,
      };
    });
    
    const discount = body.discount || 0;
    const tax = body.tax || 0;
    const shipping = body.shipping || 0;
    const total = subtotal - discount + tax + shipping;
    
    // Create order
    const order = await createOrder({
      items: itemsWithTotals,
      customer: body.customer,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'pending',
      paymentMethod: body.paymentMethod,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      notes: body.notes,
      estimatedDelivery: body.estimatedDelivery,
      createdBy: session.user.id,
    });
    
    // Invalidate cache
    revalidateTag('orders');
    
    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

