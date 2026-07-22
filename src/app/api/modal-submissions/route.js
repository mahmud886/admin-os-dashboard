import { createClient } from "@/lib/supabase-server";
import { createResponse, createErrorResponse } from "@/lib/db-helpers";

/**
 * GET /api/modal-submissions
 * Reads email-capture form submissions from the NEXUS modal-campaign system
 * (table: "submissions", same Supabase project). Only rows that actually
 * captured an email are returned — non-email modal interactions (polls,
 * click-only forms, etc.) are filtered out.
 */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .not("data->>email", "is", null)
    .order("createdAt", { ascending: false });

  if (error) {
    if (error.code === "42P01") {
      return createResponse({ submissions: [] });
    }
    return createErrorResponse(
      "Failed to fetch modal submissions",
      500,
      error.message,
    );
  }

  return createResponse({ submissions: data || [] });
}
