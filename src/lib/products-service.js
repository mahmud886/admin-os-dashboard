import { createClient } from "@/lib/supabase-server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";

// Writes use the service-role client so they aren't intermittently blocked
// by the authenticated-role RLS policy on custom_products depending on the
// caller's session/token state — same pattern as settings/route.js,
// donation-tiers/upload-image, and episodes/verify-password. Route handlers
// still gate access via getAuthenticatedUser() before calling these.
function serviceRoleClient() {
  return createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function mapToModel(record) {
  if (!record) return null;
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    price: record.price,
    category: record.category,
    imageUrl: record.image_url,
    images: record.images || [],
    variants: Array.isArray(record.variants) ? record.variants : [],
    availabilityStatus: record.availability_status,
    isPublished: record.is_published,
    isLimited: record.is_limited,
    stockQuantity: record.stock_quantity,
    format: record.format,
    includes: record.includes,
    sku: record.sku || null,
    currency: record.currency || "SGD",
    shippingNote: record.shipping_note,
    sortOrder: record.sort_order,
    metadata: record.metadata || {},
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapToDB(model) {
  const db = {
    name: model.name,
    slug: model.slug,
    description: model.description || null,
    price: parseFloat(model.price),
    category: model.category || "Physical",
    image_url: model.imageUrl || null,
    images: model.images || [],
    variants: model.variants || [],
    availability_status: model.availabilityStatus || "active",
    is_published: model.isPublished ?? false,
    is_limited: model.isLimited ?? false,
    sort_order: model.sortOrder || 0,
    format: model.format || null,
    includes: model.includes || null,
    sku: model.sku || null,
    currency: "SGD",
    shipping_note: model.shippingNote || null,
    metadata: model.metadata || {},
  };
  if (model.stockQuantity !== undefined) {
    db.stock_quantity = model.stockQuantity || null;
  }
  return db;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const productsService = {
  getAll: async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("custom_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data.map(mapToModel);
  },

  getById: async (id) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("custom_products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return mapToModel(data);
  },

  create: async (productData) => {
    const supabase = serviceRoleClient();
    const baseSlug = productData.slug || generateSlug(productData.name);

    // Slug has a UNIQUE constraint — auto-suffix on collision instead of
    // letting a duplicate product name hard-fail the save.
    let slug = baseSlug;
    for (let attempt = 2; ; attempt++) {
      const { data: existing } = await supabase
        .from("custom_products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${attempt}`;
    }
    productData.slug = slug;

    const dbData = mapToDB(productData);
    const { data, error } = await supabase
      .from("custom_products")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return mapToModel(data);
  },

  update: async (id, productData) => {
    const supabase = serviceRoleClient();
    const dbData = mapToDB(productData);
    dbData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("custom_products")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapToModel(data);
  },

  delete: async (id) => {
    const supabase = serviceRoleClient();
    const { error } = await supabase
      .from("custom_products")
      .delete()
      .eq("id", id);
    if (error) return false;
    return true;
  },
};
