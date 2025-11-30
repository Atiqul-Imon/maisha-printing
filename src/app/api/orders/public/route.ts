import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders-server';
import { revalidateTag } from 'next/cache';

// Rate limiting map (in-memory, simple implementation)
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(request: NextRequest): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// POST - Create order from public checkout
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
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

    // Validate phone number format (Bangladesh)
    const phoneRegex = /^(\+880|0)?[1-9]\d{9}$/;
    if (!phoneRegex.test(body.customer.phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (body.customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customer.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of body.items) {
      if (!item.productId || !item.productTitle || !item.quantity || !item.unitPrice) {
        return NextResponse.json(
          { success: false, error: 'Invalid item data' },
          { status: 400 }
        );
      }
      if (item.quantity <= 0 || item.quantity > 99) {
        return NextResponse.json(
          { success: false, error: 'Invalid quantity' },
          { status: 400 }
        );
      }
      if (item.unitPrice <= 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid price' },
          { status: 400 }
        );
      }
    }

    // Recalculate totals to prevent tampering
    let subtotal = 0;
    const itemsWithTotals = body.items.map((item: {
      productId: string;
      productTitle: string;
      productSlug: string;
      quantity: number;
      unitPrice: number;
      totalPrice?: number;
    }) => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      return {
        productId: item.productId,
        productTitle: item.productTitle,
        productSlug: item.productSlug,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
      };
    });

    const discount = body.discount || 0;
    const tax = body.tax || 0;
    const shipping = body.shipping || 0;
    const total = subtotal - discount + tax + shipping;

    // Sanitize customer data
    const customer = {
      name: body.customer.name.trim().substring(0, 200),
      phone: body.customer.phone.trim().replace(/\s+/g, '').substring(0, 20),
      email: body.customer.email?.trim().substring(0, 200) || undefined,
      address: body.customer.address?.trim().substring(0, 500) || undefined,
      city: body.customer.city?.trim().substring(0, 100) || undefined,
      postalCode: body.customer.postalCode?.trim().substring(0, 20) || undefined,
      notes: body.customer.notes?.trim().substring(0, 1000) || undefined,
    };

    // Create order
    const order = await createOrder({
      items: itemsWithTotals,
      customer,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      subtotal,
      discount,
      tax,
      shipping,
      total,
      notes: body.notes?.trim().substring(0, 1000) || undefined,
    });

    // Invalidate cache
    revalidateTag('orders');

    return NextResponse.json(
      {
        success: true,
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating public order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

