import { createClient } from "@supabase/supabase-js";
import { createErrorResponse, createResponse } from "@/lib/db-helpers";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { password } = await request.json();

    if (!password) {
      return createErrorResponse("Password is required", 400);
    }

    // Use Service Role to bypass RLS and read password
    // Ensure SUPABASE_SERVICE_ROLE_KEY is set in your .env.local
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data: episode, error } = await supabase
      .from("episodes")
      .select("password")
      .eq("id", id)
      .single();

    if (error || !episode) {
      return createErrorResponse("Episode not found", 404);
    }

    // Simple string comparison for now (assuming plain text password as per user request context)
    // Ideally this should be hashed, but for simple "password protection" often plain text is used in these scenarios.
    if (episode.password === password) {
      return createResponse({ success: true });
    } else {
      return createErrorResponse("Invalid password", 401);
    }
  } catch (error) {
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
