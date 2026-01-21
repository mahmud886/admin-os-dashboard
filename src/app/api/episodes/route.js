/**
 * Episodes API Routes
 * GET /api/episodes - Get all episodes
 * POST /api/episodes - Create a new episode
 */

import { createErrorResponse, createResponse, getAuthenticatedUser, validateRequiredFields } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

// GET - Fetch all episodes
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Query parameters
    const visibility = searchParams.get('visibility');
    const accessLevel = searchParams.get('access_level');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase.from('episodes').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    // Apply filters
    if (visibility) {
      query = query.eq('visibility', visibility);
    }
    if (accessLevel) {
      query = query.eq('access_level', accessLevel);
    }
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return createErrorResponse('Failed to fetch episodes', 500, error.message);
    }

    return createResponse({
      episodes: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

// POST - Create a new episode
export async function POST(request) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const body = await request.json();

    // Validate required fields
    const required = ['title', 'episode_number', 'season_number', 'unique_episode_id'];
    const missing = validateRequiredFields(body, required);
    if (missing) {
      return createErrorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const supabase = await createClient();

    // Prepare episode data
    const episodeData = {
      title: body.title,
      description: body.description || null,
      episode_number: parseInt(body.episode_number),
      season_number: parseInt(body.season_number),
      runtime: body.runtime || null,
      unique_episode_id: body.unique_episode_id,
      visibility: body.visibility || 'DRAFT',
      access_level: body.access_level || 'free',
      release_datetime: body.release_datetime || null,
      clearance_level: parseInt(body.clearance_level) || 1,
      notify: body.notify || false,
      age_restricted: body.age_restricted || false,
      thumb_image_url: body.thumb_image_url || null,
      banner_image_url: body.banner_image_url || null,
      video_url: body.video_url || null,
      audio_url: body.audio_url || null,
      additional_background_image_url: body.additional_background_image_url || null,
      tags: body.tags && Array.isArray(body.tags) ? body.tags.filter((tag) => tag.trim() !== '') : [],
      primary_genre: body.primary_genre || null,
      secondary_genre: body.secondary_genre || null,
      status: body.status || body.isDraft === false ? 'PUBLISHED' : 'DRAFT',
      created_by: user.id,
    };

    // Insert episode
    const { data, error } = await supabase.from('episodes').insert([episodeData]).select().single();

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return createErrorResponse('Episode with this unique ID already exists', 409, error.message);
      }
      return createErrorResponse('Failed to create episode', 500, error.message);
    }

    return createResponse(
      {
        message: 'Episode created successfully',
        episode: data,
      },
      201
    );
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
