import { createClient } from "@/lib/supabase-server";
import {
  getAuthenticatedUser,
  createResponse,
  createErrorResponse,
} from "@/lib/db-helpers";

const CURRENCIES = [
  "SGD",
  "USD",
  "EUR",
  "RMB",
  "KRW",
  "JPY",
  "IDR",
  "PHP",
  "INR",
];

const SHOP_MODES = ["printful", "custom"];

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("store_currency, shop_mode")
    .eq("id", "default")
    .single();
  return createResponse({
    store_currency: data?.store_currency || "SGD",
    shop_mode: data?.shop_mode || "printful",
  });
}

export async function PUT(request) {
  const user = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const { store_currency, shop_mode } = await request.json();
  if (!CURRENCIES.includes(store_currency)) {
    return createErrorResponse("Invalid currency", 400);
  }
  if (!SHOP_MODES.includes(shop_mode)) {
    return createErrorResponse("Invalid shop mode", 400);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    store_currency,
    shop_mode,
    updated_at: new Date().toISOString(),
  });

  if (error) return createErrorResponse(error.message, 500);
  return createResponse({ store_currency, shop_mode });
}
