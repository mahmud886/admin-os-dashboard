-- Shares/Tracking Table for Analytics
-- Run this in Supabase Dashboard → SQL Editor
-- Or use Supabase CLI: supabase db execute --file supabase/migrations/create_shares_table.sql

-- Poll Shares Table (tracks social media shares and UTM data)
CREATE TABLE IF NOT EXISTS poll_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- facebook, twitter, linkedin, etc.
  referrer TEXT, -- Where the share came from
  utm_source TEXT, -- UTM tracking parameter
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_poll_shares_poll_id ON poll_shares(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_shares_platform ON poll_shares(platform);
CREATE INDEX IF NOT EXISTS idx_poll_shares_created_at ON poll_shares(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poll_shares_utm_source ON poll_shares(utm_source);
CREATE INDEX IF NOT EXISTS idx_poll_shares_referrer ON poll_shares(referrer);

-- Enable Row Level Security (RLS)
ALTER TABLE poll_shares ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read poll shares"
  ON poll_shares FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create poll shares"
  ON poll_shares FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create poll shares"
  ON poll_shares FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON poll_shares TO authenticated;
GRANT INSERT, SELECT ON poll_shares TO anon;
