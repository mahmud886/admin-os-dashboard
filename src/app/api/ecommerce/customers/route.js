import { createErrorResponse, createResponse } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = supabase
      .from('ecommerce_customers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
      return createErrorResponse('Failed to fetch customers', 500, error.message);
    }

    return createResponse({
      customers: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Internal error fetching customers:', error);
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
