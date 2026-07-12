import { createClient } from "@/lib/supabase-server";

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
    availabilityStatus: record.availability_status,
    isPublished: record.is_published,
    isLimited: record.is_limited,
    stockQuantity: record.stock_quantity,
    format: record.format,
    includes: record.includes,
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
    availability_status: model.availabilityStatus || "active",
    is_published: model.isPublished ?? false,
    is_limited: model.isLimited ?? false,
    sort_order: model.sortOrder || 0,
    format: model.format || null,
    includes: model.includes || null,
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
    const supabase = await createClient();
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }
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
    const supabase = await createClient();
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
    const supabase = await createClient();
    const { error } = await supabase
      .from("custom_products")
      .delete()
      .eq("id", id);
    if (error) return false;
    return true;
  },
};
