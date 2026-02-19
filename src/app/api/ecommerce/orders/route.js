import { createErrorResponse, createResponse } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const payment_status = searchParams.get('payment_status');

    let query = supabase
      .from('ecommerce_orders')
      .select('*, ecommerce_customers(*), ecommerce_order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (payment_status) {
      query = query.eq('payment_status', payment_status);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return createErrorResponse('Failed to fetch orders', 500, error.message);
    }

    return createResponse({
      orders: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Internal error fetching orders:', error);
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
