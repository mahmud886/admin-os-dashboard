/**
 * Analytics Dashboard API Route
 * GET /api/analytics/dashboard?timeframe=7
 * Returns aggregated analytics data for the dashboard
 *
 * Supports both poll_shares and social_media_clicks table structures
 */

import { createErrorResponse, createResponse } from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Supabase/PostgREST silently caps any unbounded .select() at 1000 rows.
// This pages through with .range() until exhausted, so callers get the
// TRUE full result set instead of a silently-truncated sample.
async function fetchAllRows(buildQuery, pageSize = 1000) {
  const rows = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await buildQuery().range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return rows;
}

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const timeframe = parseInt(searchParams.get("timeframe") || "7");

    // Calculate date range
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - timeframe);
    const endDate = new Date();
    const startDate = new Date(daysAgo);

    // Get total polls count (more efficient than fetching all)
    const { count: totalPolls, error: pollsCountError } = await supabase
      .from("polls")
      .select("*", { count: "exact", head: true });

    if (pollsCountError) {
      return createErrorResponse(
        "Failed to fetch polls count",
        500,
        pollsCountError.message,
      );
    }

    // Get total votes count from poll_options (more efficient)
    const { data: allOptions, error: optionsError } = await supabase
      .from("poll_options")
      .select("vote_count");

    if (optionsError) {
      return createErrorResponse(
        "Failed to fetch poll options",
        500,
        optionsError.message,
      );
    }

    const totalVotes =
      (allOptions || []).reduce(
        (sum, option) => sum + (option.vote_count || 0),
        0,
      ) || 0;

    // Try to detect which table exists: poll_shares or social_media_clicks
    let tableName = null;
    let dateField = null;
    let allShares = [];
    let recentShares = [];
    let totalShares = 0;
    let recentSharesCount = 0;

    // Try social_media_clicks first (clicked_at field) - PREFERRED
    try {
      const { data: testShares, error: testError } = await supabase
        .from("social_media_clicks")
        .select("id, clicked_at")
        .limit(1);

      if (!testError) {
        tableName = "social_media_clicks";
        dateField = "clicked_at";
      }
    } catch (e) {
      // Table doesn't exist, try next one
    }

    // Try poll_shares second (created_at field) - FALLBACK
    if (!tableName) {
      try {
        const { data: testShares, error: testError } = await supabase
          .from("poll_shares")
          .select("id, created_at")
          .limit(1);

        if (!testError) {
          tableName = "poll_shares";
          dateField = "created_at";
        }
      } catch (e) {
        // Table doesn't exist
      }
    }

    // Exact all-time counts — total_visits/total_shares must reflect the
    // real table size, not a row-capped sample.
    let exactTotalVisits = null;
    let exactTotalShares = null;

    // If table exists, fetch data
    if (tableName && dateField) {
      try {
        const [{ count: visitsCount }, { count: sharesCount }] = await Promise.all([
          supabase
            .from(tableName)
            .select("*", { count: "exact", head: true })
            .eq("platform", "page_view"),
          supabase
            .from(tableName)
            .select("*", { count: "exact", head: true })
            .neq("platform", "page_view"),
        ]);
        exactTotalVisits = visitsCount;
        exactTotalShares = sharesCount;
      } catch (e) {
        console.warn("Exact count query failed:", e.message);
      }

      try {
        // Full all-time dataset (platform + user_agent + date only, to keep
        // the payload light) — paginated in parallel since we already know
        // the row count, so this never silently truncates like a single
        // unbounded/hard-limited query would.
        const totalRowCount = (exactTotalVisits ?? 0) + (exactTotalShares ?? 0);
        const pageSize = 1000;
        const pageCount = Math.max(1, Math.ceil(totalRowCount / pageSize));
        const pages = await Promise.all(
          Array.from({ length: pageCount }, (_, i) =>
            supabase
              .from(tableName)
              .select(`platform, user_agent, ${dateField}`)
              .range(i * pageSize, i * pageSize + pageSize - 1),
          ),
        );
        for (const { data, error } of pages) {
          if (error) {
            if (error.code !== "42P01") console.error("Error fetching all shares page:", error.message);
            continue;
          }
          if (data) allShares.push(...data);
        }

        // Full dataset within the selected timeframe (needed for daily
        // shares, UTM sources, referrers) — paginated so a busy window
        // (e.g. >1000 events in 7 days) isn't silently truncated either.
        recentShares = await fetchAllRows(() =>
          supabase
            .from(tableName)
            .select("*")
            .gte(dateField, startDate.toISOString())
            .lte(dateField, endDate.toISOString())
            .order(dateField, { ascending: false }),
        );
      } catch (tableError) {
        // Table might not exist yet
        if (tableError.code !== "42P01") {
          console.warn("Shares table error:", tableError.message);
        }
      }
    } else {
      console.log(
        "⚠️ No shares table found. Available tables: poll_shares or social_media_clicks",
      );
      console.log(
        "💡 Run migration: supabase/migrations/create_shares_table.sql",
      );
    }

    // Process Visitor Stats (Page Views vs Social Shares)
    const pageViews = allShares.filter((s) => s.platform === "page_view");
    const socialShares = allShares.filter((s) => s.platform !== "page_view");

    // Update total shares to only count actual shares, not page views —
    // prefer the exact DB-side count over the capped sample's length.
    totalShares = exactTotalShares ?? socialShares.length;

    // Update recent shares count (filtered)
    recentSharesCount = recentShares.filter(
      (s) => s.platform !== "page_view",
    ).length;

    // Calculate Visitor Stats — prefer the exact DB-side count over the
    // capped sample's length (see comment above the count queries).
    const totalVisits = exactTotalVisits ?? pageViews.length;
    const uniqueUAs = new Set(pageViews.map((s) => s.user_agent));
    const uniqueVisitors = uniqueUAs.size;

    // Active Users (last 30 mins)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeUsers = new Set(
      allShares
        .filter((s) => {
          const dateStr = s[dateField] || s.created_at || s.clicked_at;
          return dateStr && new Date(dateStr) > thirtyMinutesAgo;
        })
        .map((s) => s.user_agent),
    ).size;

    // Calculate daily shares (from recent shares within timeframe)
    const dailySharesMap = {};
    // Use recentShares but filter out page_views if we only want "Daily Shares" chart to show shares
    // Or keep them if we want "Daily Activity". Frontend usually shows "Recent Shares".
    const recentSocialShares = recentShares.filter(
      (s) => s.platform !== "page_view",
    );

    recentSocialShares.forEach((share) => {
      const dateValue =
        share[dateField] || share.created_at || share.clicked_at;
      if (dateValue) {
        const date = new Date(dateValue).toISOString().split("T")[0];
        dailySharesMap[date] = (dailySharesMap[date] || 0) + 1;
      }
    });

    // Fill missing dates with 0
    const dailySharesArray = [];
    for (let i = timeframe - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailySharesArray.push({
        date: dateStr,
        count: dailySharesMap[dateStr] || 0,
      });
    }

    // Platform statistics (from ALL shares - all-time data)
    // We include page_view here if we want to see it in the list, or exclude it?
    // Frontend includes it (icon: 👁️). Let's include it.
    const platformMap = {};
    allShares.forEach((share) => {
      const platform = share.platform || "unknown";
      platformMap[platform] = (platformMap[platform] || 0) + 1;
    });
    const platformStats = Object.entries(platformMap)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);

    // UTM Sources (from recent shares for timeframe context)
    const utmMap = {};
    recentShares.forEach((share) => {
      const source = share.utm_source || "direct";
      if (!utmMap[source]) {
        utmMap[source] = {
          source: source,
          clicks: 0,
          campaigns: new Set(),
        };
      }
      utmMap[source].clicks++;
      if (share.utm_campaign) {
        utmMap[source].campaigns.add(share.utm_campaign);
      }
    });
    const utmSources = Object.values(utmMap)
      .map((utm) => ({
        source: utm.source,
        clicks: utm.clicks,
        campaigns: utm.campaigns.size,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Referrers (from recent shares, extract domain from URL)
    const referrerMap = {};
    recentShares.forEach((share) => {
      const referrer = share.referrer;
      let domain = "direct";
      try {
        if (referrer && referrer !== "direct") {
          domain = new URL(referrer).hostname.replace("www.", "");
        }
      } catch (e) {
        // Invalid URL, use as-is or default to direct
        domain = referrer || "direct";
      }
      referrerMap[domain] = (referrerMap[domain] || 0) + 1;
    });
    const referrers = Object.entries(referrerMap)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    // Get top polls by votes
    const { data: topPollsByVotes, error: topPollsError } = await supabase
      .from("polls")
      .select(
        `
        id,
        title,
        created_at,
        poll_options (
          vote_count
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (topPollsError) {
      return createErrorResponse(
        "Failed to fetch top polls",
        500,
        topPollsError.message,
      );
    }

    // Calculate votes per poll
    const pollsWithVotes = (topPollsByVotes || []).map((poll) => {
      const totalVotes =
        poll.poll_options?.reduce(
          (sum, option) => sum + (option.vote_count || 0),
          0,
        ) || 0;
      return {
        id: poll.id,
        question: poll.title || "Untitled Poll",
        created_at: poll.created_at,
        total_votes: totalVotes,
      };
    });

    // Sort by votes
    const topPolls = pollsWithVotes
      .sort((a, b) => b.total_votes - a.total_votes)
      .slice(0, 10);

    // Prepare response
    const response = {
      overview: {
        totalPolls: totalPolls || 0,
        totalVotes: totalVotes || 0,
        totalShares: totalShares || 0,
        recentShares: recentSharesCount || 0,
        // Added visitor stats
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitors || 0,
        activeUsers: activeUsers || 0,
      },
      dailyShares:
        dailySharesArray.length > 0
          ? dailySharesArray
          : generateEmptyDailyShares(timeframe),
      platformStats: platformStats.length > 0 ? platformStats : [],
      utmSources: utmSources.length > 0 ? utmSources : [],
      referrers: referrers.length > 0 ? referrers : [],
      topPolls,
      timeframe: parseInt(timeframe),
    };

    return createResponse(response);
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}

// Helper function to generate empty daily shares array
function generateEmptyDailyShares(days) {
  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    result.push({
      date: date.toISOString().split("T")[0],
      count: 0,
    });
  }
  return result;
}
