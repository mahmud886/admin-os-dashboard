import { createErrorResponse, createResponse, getAuthenticatedUser, validateRequiredFields } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase.from('secret_drops').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse('Secret drop not found', 404);
      }
      if (error.code === '42P01') {
        return createErrorResponse('Secret drops table not found', 404);
      }
      return createErrorResponse('Failed to fetch secret drop', 500, error.message);
    }

    return createResponse({ secret_drop: data });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['name', 'email', 'message'];
    const hasAnyAllowed = allowedFields.some((f) => body[f] !== undefined);
    if (!hasAnyAllowed) {
      return createErrorResponse('No updatable fields provided', 400);
    }

    const updateData = {};
    allowedFields.forEach((f) => {
      if (body[f] !== undefined) updateData[f] = body[f];
    });

    const { data, error } = await supabase.from('secret_drops').update(updateData).eq('id', id).select().single();
    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse('Secret drop not found', 404);
      }
      if (error.code === '42P01') {
        return createErrorResponse('Secret drops table not found', 404);
      }
      return createErrorResponse('Failed to update secret drop', 500, error.message);
    }

    return createResponse({ message: 'Secret drop updated successfully', secret_drop: data });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const supabase = await createClient();
    const { id } = await params;

    const { data: existing, error: fetchError } = await supabase
      .from('secret_drops')
      .select('id')
      .eq('id', id)
      .single();
    if (fetchError || !existing) {
      return createErrorResponse('Secret drop not found', 404);
    }

    const { error } = await supabase.from('secret_drops').delete().eq('id', id);
    if (error) {
      if (error.code === '42P01') {
        return createErrorResponse('Secret drops table not found', 404);
      }
      return createErrorResponse('Failed to delete secret drop', 500, error.message);
    }

    return createResponse({ message: 'Secret drop deleted successfully' });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
