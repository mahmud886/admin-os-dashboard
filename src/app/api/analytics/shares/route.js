/**
 * Poll Shares API Route
 * POST /api/analytics/shares
 * Track a poll share event
 */

import { createErrorResponse, createResponse } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Extract data from request
    const { poll_id, platform, referrer, utm_source, utm_medium, utm_campaign, ip_address, user_agent } = body;

    // Validate required fields
    if (!poll_id || !platform) {
      return createErrorResponse('poll_id and platform are required', 400);
    }

    // Verify poll exists
    const { data: poll, error: pollError } = await supabase.from('polls').select('id').eq('id', poll_id).single();

    if (pollError || !poll) {
      return createErrorResponse('Poll not found', 404);
    }

    // Try to detect which table exists: poll_shares or social_media_clicks
    let tableName = null;
    let shareData = {
      poll_id,
      platform: platform.toLowerCase(),
      referrer: referrer || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      ip_address: ip_address || null,
      user_agent: user_agent || null,
    };

    // Try poll_shares first
    let share = null;
    let shareError = null;

    const { data: pollSharesData, error: pollSharesError } = await supabase
      .from('poll_shares')
      .insert([shareData])
      .select()
      .single();

    if (!pollSharesError) {
      share = pollSharesData;
      tableName = 'poll_shares';
    } else if (pollSharesError.message?.includes('does not exist') || pollSharesError.code === '42P01') {
      // Try social_media_clicks if poll_shares doesn't exist
      const { data: socialClicksData, error: socialClicksError } = await supabase
        .from('social_media_clicks')
        .insert([shareData])
        .select()
        .single();

      if (!socialClicksError) {
        share = socialClicksData;
        tableName = 'social_media_clicks';
      } else {
        shareError = socialClicksError;
      }
    } else {
      shareError = pollSharesError;
    }

    if (shareError) {
      // If table doesn't exist, return success but log warning
      if (shareError.message?.includes('does not exist') || shareError.code === '42P01') {
        console.warn(
          'Shares table does not exist. Run migration: supabase/migrations/create_shares_table.sql or create_social_media_clicks_table.sql'
        );
        return createResponse(
          {
            message: 'Share tracked (table not yet created)',
            share: shareData,
          },
          201
        );
      }
      return createErrorResponse('Failed to track share', 500, shareError.message);
    }

    return createResponse(
      {
        message: 'Share tracked successfully',
        share,
      },
      201
    );
  } catch (error) {
    console.error('Share tracking error:', error);
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
