import { createResponse, createErrorResponse } from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("supporter_donations")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return createResponse({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    return createErrorResponse("Failed to delete donation", 500, error.message);
  }
}
