import { createErrorResponse, createResponse } from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const tier = searchParams.get("tier");

    let query = supabase
      .from("supporter_donations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (tier) {
      query = query.eq("tier_id", tier);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching donations:", error);
      return createErrorResponse(
        "Failed to fetch donations",
        500,
        error.message,
      );
    }

    // Dynamic stats from donation_tiers table
    const { data: tiers } = await supabase
      .from("donation_tiers")
      .select("tier_id")
      .order("sort_order", { ascending: true });

    const stats = {};
    for (const tier of tiers || []) {
      const { count: tierCount } = await supabase
        .from("supporter_donations")
        .select("*", { count: "exact", head: true })
        .eq("tier_id", tier.tier_id);
      stats[tier.tier_id] = tierCount || 0;
    }

    return createResponse({
      donations: data || [],
      total: count || 0,
      stats,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Internal error fetching donations:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
