import { createErrorResponse, createResponse, validateRequiredFields } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase.from('secret_drops').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (email) {
      query = query.eq('email', email);
    }
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      if (error.code === '42P01') {
        return createResponse({ secret_drops: [], total: 0, limit, offset });
      }
      return createErrorResponse('Failed to fetch secret drops', 500, error.message);
    }

    return createResponse({
      secret_drops: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const requiredMissing = validateRequiredFields(body, ['name', 'email', 'message']);
    if (requiredMissing) {
      return createErrorResponse(`Missing required fields: ${requiredMissing.join(', ')}`, 400);
    }

    const insertData = {
      name: body.name,
      email: body.email,
      message: body.message,
    };

    const { data, error } = await supabase.from('secret_drops').insert([insertData]).select().single();
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return createResponse(
          {
            message: 'Secret drop captured (table not yet created)',
            secret_drop: insertData,
          },
          201
        );
      }
      return createErrorResponse('Failed to create secret drop', 500, error.message);
    }

    return createResponse(
      {
        message: 'Secret drop created successfully',
        secret_drop: data,
      },
      201
    );
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
