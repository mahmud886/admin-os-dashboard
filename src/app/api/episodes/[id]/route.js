/**
 * Episode by ID API Routes
 * GET /api/episodes/[id] - Get a single episode
 * PUT /api/episodes/[id] - Update an episode
 * DELETE /api/episodes/[id] - Delete an episode
 */

import { createErrorResponse, createResponse, getAuthenticatedUser } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

// GET - Fetch a single episode by ID
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase.from('episodes').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse('Episode not found', 404);
      }
      return createErrorResponse('Failed to fetch episode', 500, error.message);
    }

    return createResponse({ episode: data });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

// PUT - Update an episode
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const { id } = await params;
    const body = await request.json();

    const supabase = await createClient();

    // Check if episode exists
    const { data: existing, error: fetchError } = await supabase
      .from('episodes')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return createErrorResponse('Episode not found', 404, `Episode with ID ${id} does not exist`);
      }
      return createErrorResponse('Failed to fetch episode', 500, fetchError.message);
    }

    if (!existing) {
      return createErrorResponse('Episode not found', 404, `Episode with ID ${id} does not exist`);
    }

    // Prepare update data (only include provided fields)
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    // Update only provided fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.episode_number !== undefined) updateData.episode_number = parseInt(body.episode_number);
    if (body.season_number !== undefined) updateData.season_number = parseInt(body.season_number);
    if (body.runtime !== undefined) updateData.runtime = body.runtime;
    if (body.unique_episode_id !== undefined) updateData.unique_episode_id = body.unique_episode_id;
    if (body.visibility !== undefined) updateData.visibility = body.visibility;
    if (body.access_level !== undefined) updateData.access_level = body.access_level;
    if (body.release_datetime !== undefined) updateData.release_datetime = body.release_datetime;
    if (body.clearance_level !== undefined) updateData.clearance_level = parseInt(body.clearance_level);
    if (body.notify !== undefined) updateData.notify = body.notify;
    if (body.age_restricted !== undefined) updateData.age_restricted = body.age_restricted;
    if (body.thumb_image_url !== undefined) updateData.thumb_image_url = body.thumb_image_url;
    if (body.banner_image_url !== undefined) updateData.banner_image_url = body.banner_image_url;
    if (body.video_url !== undefined) updateData.video_url = body.video_url;
    if (body.audio_url !== undefined) updateData.audio_url = body.audio_url;
    if (body.additional_background_image_url !== undefined)
      updateData.additional_background_image_url = body.additional_background_image_url;
    if (body.tags !== undefined)
      updateData.tags = Array.isArray(body.tags) ? body.tags.filter((tag) => tag.trim() !== '') : [];
    if (body.primary_genre !== undefined) updateData.primary_genre = body.primary_genre;
    if (body.secondary_genre !== undefined) updateData.secondary_genre = body.secondary_genre;
    if (body.status !== undefined || body.isDraft !== undefined) {
      updateData.status = body.status || (body.isDraft === false ? 'PUBLISHED' : 'DRAFT');
    }

    // Update episode
    const { data, error } = await supabase.from('episodes').update(updateData).eq('id', id).select().single();

    if (error) {
      if (error.code === '23505') {
        return createErrorResponse('Episode with this unique ID already exists', 409, error.message);
      }
      return createErrorResponse('Failed to update episode', 500, error.message);
    }

    return createResponse({
      message: 'Episode updated successfully',
      episode: data,
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

// DELETE - Delete an episode
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const { id } = await params;
    const supabase = await createClient();

    // Check if episode exists
    const { data: existing, error: fetchError } = await supabase.from('episodes').select('id').eq('id', id).single();

    if (fetchError || !existing) {
      return createErrorResponse('Episode not found', 404);
    }

    // Delete episode (cascade will delete related polls)
    const { error } = await supabase.from('episodes').delete().eq('id', id);

    if (error) {
      return createErrorResponse('Failed to delete episode', 500, error.message);
    }

    return createResponse({
      message: 'Episode deleted successfully',
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
