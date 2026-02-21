import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { type = 'page_view', page_path, referrer, utm_source, utm_medium, utm_campaign, poll_id } = body;

    const userAgent = request.headers.get('user-agent');

    // Try to get location from Vercel/Netlify headers
    let country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    let city = request.headers.get('x-vercel-ip-city') || 'Unknown';

    let targetPollId = poll_id;

    // Fallback: if no poll_id is provided, try to find the first available poll
    // because the database has a NOT NULL constraint on poll_id
    if (!targetPollId) {
      const { data: firstPoll } = await supabase.from('polls').select('id').limit(1).single();

      if (firstPoll) {
        targetPollId = firstPoll.id;
      }
    }

    // If we still don't have a poll_id, we can't track if the DB enforces it
    if (!targetPollId) {
      console.warn('Cannot track page view: No polls found in database to link to.');
      return NextResponse.json({ success: true, warning: 'No polls found' });
    }

    const trackData = {
      poll_id: targetPollId,
      platform: type === 'page_view' ? 'page_view' : body.platform,
      user_agent: userAgent,
      referrer: referrer || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: page_path || null,
      clicked_at: new Date().toISOString(),
    };

    // Try social_media_clicks first
    let { error } = await supabase.from('social_media_clicks').insert(trackData);

    // Fallback to poll_shares if social_media_clicks doesn't exist
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      console.warn('social_media_clicks table not found, falling back to poll_shares');
      // Map clicked_at to created_at for poll_shares
      const pollSharesData = {
        ...trackData,
        created_at: trackData.clicked_at,
      };
      delete pollSharesData.clicked_at;

      const { error: fallbackError } = await supabase.from('poll_shares').insert(pollSharesData);
      error = fallbackError;
    }

    if (error) {
      console.error('Error tracking:', error);
      // If it fails because of missing columns, we still want the request to succeed for the client
    }

    return NextResponse.json({ success: true, location: { country, city } });
  } catch (error) {
    console.error('Error in tracking route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
