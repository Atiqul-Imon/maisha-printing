import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth-custom';
import { getOrderById, updateOrder, deleteOrder } from '@/lib/orders-server';
import { revalidateTag } from 'next/cache';
import { ObjectId } from 'mongodb';

// GET - Fetch single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const order = await getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: order },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // If items are updated, recalculate totals
    if (body.items && Array.isArray(body.items)) {
      let subtotal = 0;
      const updatedItems = body.items.map((item: { quantity: number; unitPrice: number; totalPrice?: number }) => {
        const totalPrice = item.quantity * item.unitPrice;
        subtotal += totalPrice;
        return {
          ...item,
          totalPrice,
        };
      });
      
      body.items = updatedItems;
      body.subtotal = subtotal;
      const discount = body.discount || 0;
      const tax = body.tax || 0;
      const shipping = body.shipping || 0;
      body.total = subtotal - discount + tax + shipping;
    }
    
    const order = await updateOrder(id, body);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Invalidate cache
    revalidateTag('orders');
    revalidateTag(`order-${id}`);
    
    return NextResponse.json(
      { success: true, data: order }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    const deleted = await deleteOrder(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Invalidate cache
    revalidateTag('orders');
    revalidateTag(`order-${id}`);
    
    return NextResponse.json(
      { success: true, message: 'Order deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

