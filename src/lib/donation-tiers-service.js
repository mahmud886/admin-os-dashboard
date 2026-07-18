import { createClient } from "@/lib/supabase-server";

function mapToModel(record) {
  if (!record) return null;
  return {
    id: record.id,
    tierId: record.tier_id,
    label: record.label,
    heading: record.heading,
    description: record.description,
    price: record.price,
    currency: record.currency,
    isCustomAmount: record.is_custom_amount || false,
    minAmount: record.min_amount,
    buttonText: record.button_text,
    footerText: record.footer_text,
    bulletPoints: record.bullet_points || [],
    note: record.note,
    isFeatured: record.is_featured || false,
    badgeText: record.badge_text,
    badgeSubtext: record.badge_subtext,
    isPublished: record.is_published || false,
    sortOrder: record.sort_order || 0,
    isSubscription: record.is_subscription || false,
    hasDigitalDownload: record.has_digital_download || false,
    digitalFilePath: record.digital_file_path || null,
    imageUrl: record.image_url || null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapToDB(model) {
  return {
    tier_id: model.tierId,
    label: model.label,
    heading: model.heading,
    description: model.description,
    price: model.price || null,
    currency: model.currency || "usd",
    is_custom_amount: model.isCustomAmount || false,
    min_amount: model.minAmount || null,
    button_text: model.buttonText,
    footer_text: model.footerText,
    bullet_points: model.bulletPoints || [],
    note: model.note || null,
    is_featured: model.isFeatured || false,
    badge_text: model.badgeText || null,
    badge_subtext: model.badgeSubtext || null,
    is_published: model.isPublished || false,
    sort_order: model.sortOrder || 0,
    is_subscription: model.isSubscription || false,
    has_digital_download: model.hasDigitalDownload || false,
    digital_file_path: model.digitalFilePath || null,
    image_url: model.imageUrl || null,
  };
}

export const donationTiersService = {
  getAll: async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("donation_tiers")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching donation tiers:", error);
      return [];
    }
    return data.map(mapToModel);
  },

  getById: async (id) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("donation_tiers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return mapToModel(data);
  },

  create: async (tierData) => {
    const supabase = await createClient();
    const dbData = mapToDB(tierData);

    const { data, error } = await supabase
      .from("donation_tiers")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return mapToModel(data);
  },

  update: async (id, tierData) => {
    const supabase = await createClient();
    const dbData = mapToDB(tierData);

    const { data, error } = await supabase
      .from("donation_tiers")
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
      .from("donation_tiers")
      .delete()
      .eq("id", id);

    if (error) return false;
    return true;
  },
};
