import { createErrorResponse, createResponse } from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { error } = await supabase
    .from("supporter_donations")
    .delete()
    .eq("id", id);

  if (error)
    return createErrorResponse("Failed to delete donation", 500, error.message);

  return createResponse({ message: "Donation deleted successfully" });
}
