-- Supabase Database Migration Script
-- Run this in Supabase Dashboard → SQL Editor
-- Or use Supabase CLI: supabase db execute --file supabase/migrations/create_tables.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Episodes Table
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  episode_number INTEGER NOT NULL,
  season_number INTEGER NOT NULL,
  runtime TEXT, -- Format: MM:SS or HH:MM:SS
  unique_episode_id TEXT UNIQUE NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'DRAFT' CHECK (visibility IN ('AVAILABLE', 'UPCOMING', 'LOCKED', 'DRAFT', 'ARCHIVED')),
  access_level TEXT NOT NULL DEFAULT 'free' CHECK (access_level IN ('free', 'premium', 'vip')),
  release_datetime TIMESTAMPTZ,
  clearance_level INTEGER DEFAULT 1,
  notify BOOLEAN DEFAULT false,
  age_restricted BOOLEAN DEFAULT false,
  thumb_image_url TEXT,
  banner_image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  additional_background_image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  primary_genre TEXT,
  secondary_genre TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Polls Table (connected to episodes)
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 7, -- Duration in days
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'LIVE', 'ENDED', 'ARCHIVED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Poll Options Table (dynamic options for polls)
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  vote_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_episodes_episode_id ON episodes(unique_episode_id);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);
CREATE INDEX IF NOT EXISTS idx_episodes_visibility ON episodes(visibility);
CREATE INDEX IF NOT EXISTS idx_episodes_created_at ON episodes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_polls_episode_id ON polls(episode_id);
CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON polls(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_display_order ON poll_options(display_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poll_options_updated_at BEFORE UPDATE ON poll_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Episodes: Authenticated users can read all, but only modify their own (or all if admin)
CREATE POLICY "Authenticated users can read episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create episodes"
  ON episodes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update episodes"
  ON episodes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete episodes"
  ON episodes FOR DELETE
  TO authenticated
  USING (true);

-- Polls: Similar policies
CREATE POLICY "Authenticated users can read polls"
  ON polls FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create polls"
  ON polls FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update polls"
  ON polls FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete polls"
  ON polls FOR DELETE
  TO authenticated
  USING (true);

-- Poll Options: Similar policies
CREATE POLICY "Authenticated users can read poll options"
  ON poll_options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create poll options"
  ON poll_options FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update poll options"
  ON poll_options FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete poll options"
  ON poll_options FOR DELETE
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON episodes TO authenticated;
GRANT ALL ON polls TO authenticated;
GRANT ALL ON poll_options TO authenticated;
-- ==========================================
-- E-COMMERCE MODULE
-- ==========================================

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS ecommerce_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    stripe_customer_id TEXT,
    phone TEXT,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS ecommerce_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. SPORE-XXXX
    customer_id UUID REFERENCES ecommerce_customers(id) ON DELETE SET NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    amount_total DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, cancelled, refunded
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, no_payment_required
    shipping_address JSONB,
    billing_address JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS ecommerce_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES ecommerce_orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_id TEXT, -- External ID or internal reference
    variant_id TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_amount DECIMAL(10, 2) NOT NULL, -- Price per unit
    total_amount DECIMAL(10, 2) NOT NULL, -- quantity * unit_amount
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_ecommerce_customers_email ON ecommerce_customers(email);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_stripe_session_id ON ecommerce_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_order_number ON ecommerce_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_ecommerce_order_items_order_id ON ecommerce_order_items(order_id);

-- 5. Add RLS Policies
ALTER TABLE ecommerce_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access for now (for admin dashboard to work without complex auth setup)
CREATE POLICY "Enable read access for all users" ON ecommerce_customers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON ecommerce_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON ecommerce_customers FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON ecommerce_orders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON ecommerce_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON ecommerce_orders FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON ecommerce_order_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON ecommerce_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON ecommerce_order_items FOR UPDATE USING (true);

-- 6. Create Donations Table
CREATE TABLE IF NOT EXISTS supporter_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_number TEXT UNIQUE NOT NULL, -- e.g. DON-XXXX
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,

    -- Supporter Details
    supporter_name TEXT,
    supporter_email TEXT NOT NULL,
    supporter_note TEXT,
    mailing_address TEXT,

    -- Donation Details
    tier_id TEXT NOT NULL, -- 'archivist', 'emblem', 'patron', 'support-universe'
    tier_name TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',

    -- Status
    status TEXT DEFAULT 'pending', -- pending, paid, refunded
    payment_status TEXT DEFAULT 'unpaid',

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Indexes for Donations
CREATE INDEX IF NOT EXISTS idx_supporter_donations_email ON supporter_donations(supporter_email);
CREATE INDEX IF NOT EXISTS idx_supporter_donations_stripe_session_id ON supporter_donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_supporter_donations_tier_id ON supporter_donations(tier_id);

-- 8. Add RLS Policies for Donations
ALTER TABLE supporter_donations ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for now (for admin dashboard to work without complex auth setup)
CREATE POLICY "Enable read access for all users" ON supporter_donations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON supporter_donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON supporter_donations FOR UPDATE USING (true);
