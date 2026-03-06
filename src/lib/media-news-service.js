import { createClient } from '@/lib/supabase-server';

function mapToModel(record) {
  if (!record) return null;
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content: record.content,
    coverImage: record.cover_image,
    source: record.source,
    sourceUrl: record.source_url,
    tags: record.tags || [],
    author: record.author,
    publishedAt: record.published_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapToDB(model) {
  return {
    slug: model.slug,
    title: model.title,
    excerpt: model.excerpt,
    content: model.content,
    cover_image: model.coverImage,
    source: model.source,
    source_url: model.sourceUrl,
    tags: model.tags,
    author: model.author,
  };
}

export const mediaNewsService = {
  getAll: async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('media_news').select('*').order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching media news:', error);
      return [];
    }
    return data.map(mapToModel);
  },

  getById: async (id) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('media_news').select('*').eq('id', id).single();

    if (error) return null;
    return mapToModel(data);
  },

  getBySlug: async (slug) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('media_news').select('*').eq('slug', slug).single();

    if (error) return null;
    return mapToModel(data);
  },

  create: async (newsData) => {
    const supabase = await createClient();
    const dbData = mapToDB(newsData);

    if (newsData.publishedAt) {
      dbData.published_at = newsData.publishedAt;
    }

    const { data, error } = await supabase.from('media_news').insert(dbData).select().single();

    if (error) throw error;
    return mapToModel(data);
  },

  update: async (id, newsData) => {
    const supabase = await createClient();
    const dbData = mapToDB(newsData);

    // Update published_at to current time on edit
    dbData.published_at = new Date().toISOString();

    const { data, error } = await supabase.from('media_news').update(dbData).eq('id', id).select().single();

    if (error) throw error;
    return mapToModel(data);
  },

  delete: async (id) => {
    const supabase = await createClient();
    const { error } = await supabase.from('media_news').delete().eq('id', id);

    if (error) return false;
    return true;
  },
};
