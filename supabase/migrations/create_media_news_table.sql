-- Create Media News Table
-- Run this in Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS media_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  source TEXT, -- e.g., "TechCrunch", "BBC"
  source_url TEXT, -- Link to original article if applicable
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_media_news_slug ON media_news(slug);
CREATE INDEX IF NOT EXISTS idx_media_news_published_at ON media_news(published_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_media_news_updated_at BEFORE UPDATE ON media_news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE media_news ENABLE ROW LEVEL SECURITY;

-- Policies (Adjust as needed, currently allowing public read, auth write)
CREATE POLICY "Public media_news are viewable by everyone"
ON media_news FOR SELECT USING (true);

CREATE POLICY "Users can insert media_news"
ON media_news FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update media_news"
ON media_news FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete media_news"
ON media_news FOR DELETE USING (auth.role() = 'authenticated');
