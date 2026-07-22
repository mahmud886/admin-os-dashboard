import { createClient } from "@supabase/supabase-js";
import {
  getAuthenticatedUser,
  createResponse,
  createErrorResponse,
} from "@/lib/db-helpers";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * DELETE /api/modal-submissions/[id]
 * Deletes a row from the NEXUS "submissions" table. Uses the service-role
 * client (same pattern as /api/settings) since this table has no RLS policy
 * for the admin's authenticated session.
 */
export async function DELETE(request, { params }) {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const { id } = await params;
  const { error } = await adminClient()
    .from("submissions")
    .delete()
    .eq("id", id);
  if (error) return createErrorResponse(error.message, 500);

  return createResponse({ success: true });
}
