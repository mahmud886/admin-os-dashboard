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

    // specific stats
    const { count: archivistCount } = await supabase
      .from("supporter_donations")
      .select("*", { count: "exact", head: true })
      .eq("tier_id", "archivist");

    const { count: emblemCount } = await supabase
      .from("supporter_donations")
      .select("*", { count: "exact", head: true })
      .eq("tier_id", "emblem");

    const { count: patronCount } = await supabase
      .from("supporter_donations")
      .select("*", { count: "exact", head: true })
      .eq("tier_id", "patron");

    const { count: donationCount } = await supabase
      .from("supporter_donations")
      .select("*", { count: "exact", head: true })
      .eq("tier_id", "support-universe");

    return createResponse({
      donations: data || [],
      total: count || 0,
      stats: {
        archivist: archivistCount || 0,
        emblem: emblemCount || 0,
        patron: patronCount || 0,
        donation: donationCount || 0,
      },
      limit,
      offset,
    });
  } catch (error) {
    console.error("Internal error fetching donations:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
