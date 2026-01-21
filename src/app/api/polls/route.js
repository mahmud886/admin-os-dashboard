/**
 * Polls API Routes
 * GET /api/polls - Get all polls
 * POST /api/polls - Create a new poll with options
 */

import {
  calculatePollEndDate,
  createErrorResponse,
  createResponse,
  getAuthenticatedUser,
  validateRequiredFields,
} from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

// GET - Fetch all polls
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Query parameters
    const episodeId = searchParams.get('episode_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query with related episode and options
    let query = supabase
      .from('polls')
      .select(
        `
        *,
        episodes(id, title, episode_number, season_number),
        poll_options(*)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // Apply filters
    if (episodeId) {
      query = query.eq('episode_id', episodeId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return createErrorResponse('Failed to fetch polls', 500, error.message);
    }

    return createResponse({
      polls: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

// POST - Create a new poll with options
export async function POST(request) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const body = await request.json();

    // Validate required fields
    const required = ['episode_id', 'title', 'options'];
    const missing = validateRequiredFields(body, required);
    if (missing) {
      return createErrorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Validate options
    if (!Array.isArray(body.options) || body.options.length < 2) {
      return createErrorResponse('Poll must have at least 2 options', 400);
    }

    const supabase = await createClient();

    // Verify episode exists
    const { data: episode, error: episodeError } = await supabase
      .from('episodes')
      .select('id')
      .eq('id', body.episode_id)
      .single();

    if (episodeError || !episode) {
      return createErrorResponse('Episode not found', 404);
    }

    // Calculate dates
    const startsAt = body.starts_at ? new Date(body.starts_at) : new Date();
    const durationDays = parseInt(body.duration_days) || 7;
    const endsAt = body.ends_at ? new Date(body.ends_at) : calculatePollEndDate(startsAt, durationDays);

    // Prepare poll data
    const pollData = {
      episode_id: body.episode_id,
      title: body.title,
      description: body.description || null,
      duration_days: durationDays,
      status: body.status || body.isDraft === false ? 'LIVE' : 'DRAFT',
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      created_by: user.id,
    };

    // Insert poll
    const { data: poll, error: pollError } = await supabase.from('polls').insert([pollData]).select().single();

    if (pollError) {
      return createErrorResponse('Failed to create poll', 500, pollError.message);
    }

    // Prepare poll options
    const pollOptions = body.options.map((option, index) => ({
      poll_id: poll.id,
      name: option.name,
      description: option.description || null,
      vote_count: parseInt(option.count) || parseInt(option.vote_count) || 0,
      display_order: index,
    }));

    // Insert poll options
    const { data: options, error: optionsError } = await supabase.from('poll_options').insert(pollOptions).select();

    if (optionsError) {
      // Rollback: delete the poll if options failed
      await supabase.from('polls').delete().eq('id', poll.id);
      return createErrorResponse('Failed to create poll options', 500, optionsError.message);
    }

    // Fetch complete poll with options
    const { data: completePoll, error: fetchError } = await supabase
      .from('polls')
      .select(
        `
        *,
        episodes(id, title, episode_number, season_number),
        poll_options(*)
      `
      )
      .eq('id', poll.id)
      .single();

    if (fetchError) {
      return createErrorResponse('Poll created but failed to fetch complete data', 201, {
        poll,
        options,
      });
    }

    return createResponse(
      {
        message: 'Poll created successfully',
        poll: completePoll,
      },
      201
    );
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
