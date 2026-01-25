-- Social Media Clicks Table for Analytics
-- Alternative table name: social_media_clicks (if you prefer this name over poll_shares)
-- Run this in Supabase Dashboard → SQL Editor
-- Or use Supabase CLI: supabase db execute --file supabase/migrations/create_social_media_clicks_table.sql

-- Social Media Clicks Table (tracks social media shares and UTM data)
CREATE TABLE IF NOT EXISTS social_media_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- facebook, twitter, linkedin, etc.
  referrer TEXT, -- Where the share came from
  utm_source TEXT, -- UTM tracking parameter
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW() -- Note: uses clicked_at instead of created_at
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_media_clicks_poll_id ON social_media_clicks(poll_id);
CREATE INDEX IF NOT EXISTS idx_social_media_clicks_platform ON social_media_clicks(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_clicks_clicked_at ON social_media_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_media_clicks_utm_source ON social_media_clicks(utm_source);
CREATE INDEX IF NOT EXISTS idx_social_media_clicks_referrer ON social_media_clicks(referrer);

-- Enable Row Level Security (RLS)
ALTER TABLE social_media_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read social media clicks"
  ON social_media_clicks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create social media clicks"
  ON social_media_clicks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create social media clicks"
  ON social_media_clicks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON social_media_clicks TO authenticated;
GRANT INSERT, SELECT ON social_media_clicks TO anon;
