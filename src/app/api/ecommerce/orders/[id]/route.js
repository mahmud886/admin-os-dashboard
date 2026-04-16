import { createErrorResponse, createResponse } from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: order, error } = await supabase
      .from("ecommerce_orders")
      .select("*, ecommerce_customers(*), ecommerce_order_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return createErrorResponse("Failed to fetch order", 404, error.message);
    }

    return createResponse({ order });
  } catch (error) {
    console.error("Internal error fetching order:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from("ecommerce_orders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting order:", error);
      return createErrorResponse("Failed to delete order", 500, error.message);
    }

    return createResponse({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Internal error deleting order:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
