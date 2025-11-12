import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth-custom';
import { getOrderSummary } from '@/lib/orders-server';

// GET - Get order summary statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const summary = await getOrderSummary();
    
    return NextResponse.json(
      { success: true, data: summary },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching order summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order summary' },
      { status: 500 }
    );
  }
}

