/**
 * Poll by ID API Routes
 * GET /api/polls/[id] - Get a single poll with options
 * PUT /api/polls/[id] - Update a poll
 * DELETE /api/polls/[id] - Delete a poll
 */

import { calculatePollEndDate, createErrorResponse, createResponse, getAuthenticatedUser } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

// GET - Fetch a single poll by ID with options
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('polls')
      .select(
        `
        *,
        episodes(id, title, episode_number, season_number),
        poll_options(*)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse('Poll not found', 404);
      }
      return createErrorResponse('Failed to fetch poll', 500, error.message);
    }

    return createResponse({ poll: data });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

// PUT - Update a poll
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // Check if poll exists
    const { data: existing, error: fetchError } = await supabase
      .from('polls')
      .select('id, created_by, status')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return createErrorResponse('Poll not found', 404);
    }

    // Determine if this is a voting request or admin update
    // Voting: only updates vote_count in options, no poll metadata changes
    // Admin: updates poll metadata (title, description, status, etc.)
    const isVotingRequest =
      body.options &&
      Array.isArray(body.options) &&
      !body.title &&
      !body.description &&
      !body.status &&
      !body.isDraft &&
      !body.episode_id &&
      !body.duration_days &&
      !body.starts_at &&
      !body.ends_at;

    // If it's an admin update, require authentication
    if (!isVotingRequest) {
      const { user, error: authError } = await getAuthenticatedUser();
      if (authError || !user) {
        return createErrorResponse('Unauthorized', 401, 'Authentication required for admin updates');
      }
    }

    // If it's a voting request, only update vote counts
    if (isVotingRequest) {
      // Validate that poll is LIVE (can't vote on ended/draft polls)
      if (existing.status !== 'LIVE') {
        return createErrorResponse('Poll is not active for voting', 400, `Poll status is ${existing.status}`);
      }

      // Update vote counts for each option
      const updatePromises = body.options.map(async (option) => {
        if (option.id && option.vote_count !== undefined) {
          return supabase
            .from('poll_options')
            .update({ vote_count: parseInt(option.vote_count) || 0 })
            .eq('id', option.id)
            .eq('poll_id', id);
        }
        return { error: null };
      });

      await Promise.all(updatePromises);

      // Fetch complete poll with updated options
      const { data: completePoll, error: fetchError2 } = await supabase
        .from('polls')
        .select(
          `
          *,
          episodes(id, title, episode_number, season_number),
          poll_options(*)
        `
        )
        .eq('id', id)
        .single();

      if (fetchError2) {
        return createErrorResponse('Failed to fetch updated poll', 500, fetchError2.message);
      }

      return createResponse({
        message: 'Vote recorded successfully',
        poll: completePoll,
      });
    }

    // Admin update: Update poll metadata
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    // Update only provided fields
    if (body.episode_id !== undefined) updateData.episode_id = body.episode_id;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.duration_days !== undefined) {
      updateData.duration_days = parseInt(body.duration_days);
      // Recalculate end date if duration changed
      if (!body.ends_at) {
        const startsAt = body.starts_at || existing.starts_at;
        updateData.ends_at = calculatePollEndDate(startsAt, body.duration_days);
      }
    }
    if (body.status !== undefined || body.isDraft !== undefined) {
      updateData.status = body.status || (body.isDraft === false ? 'LIVE' : 'DRAFT');
    }
    if (body.starts_at !== undefined) updateData.starts_at = body.starts_at;
    if (body.ends_at !== undefined) updateData.ends_at = body.ends_at;

    // Update poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (pollError) {
      return createErrorResponse('Failed to update poll', 500, pollError.message);
    }

    // Update options if provided (admin can replace all options)
    if (body.options && Array.isArray(body.options)) {
      // Delete existing options
      const { error: deleteError } = await supabase.from('poll_options').delete().eq('poll_id', id);

      if (deleteError) {
        return createErrorResponse('Failed to update poll options', 500, deleteError.message);
      }

      // Insert new options
      const pollOptions = body.options.map((option, index) => ({
        poll_id: id,
        name: option.name,
        description: option.description || null,
        vote_count: parseInt(option.count) || parseInt(option.vote_count) || 0,
        display_order: index,
      }));

      const { error: optionsError } = await supabase.from('poll_options').insert(pollOptions);

      if (optionsError) {
        return createErrorResponse('Failed to update poll options', 500, optionsError.message);
      }
    }

    // Fetch complete poll with options
    const { data: completePoll, error: fetchError2 } = await supabase
      .from('polls')
      .select(
        `
        *,
        episodes(id, title, episode_number, season_number),
        poll_options(*)
      `
      )
      .eq('id', id)
      .single();

    return createResponse({
      message: 'Poll updated successfully',
      poll: completePoll || poll,
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

// DELETE - Delete a poll (cascade will delete options)
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401, 'Authentication required');
    }

    const { id } = await params;
    const supabase = await createClient();

    // Check if poll exists
    const { data: existing, error: fetchError } = await supabase.from('polls').select('id').eq('id', id).single();

    if (fetchError || !existing) {
      return createErrorResponse('Poll not found', 404);
    }

    // Delete poll (cascade will delete related options)
    const { error } = await supabase.from('polls').delete().eq('id', id);

    if (error) {
      return createErrorResponse('Failed to delete poll', 500, error.message);
    }

    return createResponse({
      message: 'Poll deleted successfully',
    });
  } catch (error) {
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
