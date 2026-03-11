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
    tags: record.tags || [],
    author: record.author,
    isPasswordProtected: record.is_password_protected || false,
    accessPassword: record.access_password || '',
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
    tags: model.tags,
    author: model.author,
    is_password_protected: model.isPasswordProtected,
    access_password: model.accessPassword,
    // published_at is usually handled by default or specific logic
  };
}

export const blogsService = {
  getAll: async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('blogs').select('*').order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
    return data.map(mapToModel);
  },

  getById: async (id) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();

    if (error) return null;
    return mapToModel(data);
  },

  getBySlug: async (slug) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();

    if (error) return null;
    return mapToModel(data);
  },

  create: async (blogData) => {
    const supabase = await createClient();
    const dbData = mapToDB(blogData);

    // published_at defaults to now() in DB, but if provided use it
    if (blogData.publishedAt) {
      dbData.published_at = blogData.publishedAt;
    }

    const { data, error } = await supabase.from('blogs').insert(dbData).select().single();

    if (error) throw error;
    return mapToModel(data);
  },

  update: async (id, blogData) => {
    const supabase = await createClient();
    const dbData = mapToDB(blogData);

    const { data, error } = await supabase.from('blogs').update(dbData).eq('id', id).select().single();

    if (error) throw error;
    return mapToModel(data);
  },

  delete: async (id) => {
    const supabase = await createClient();
    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) return false;
    return true;
  },
};
