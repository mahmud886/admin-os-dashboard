-- Migration: custom_products table for admin-managed non-Printful products
-- Run this in the Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS custom_products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  price               DECIMAL(10,2) NOT NULL,
  category            TEXT NOT NULL DEFAULT 'Physical',
  image_url           TEXT,
  images              JSONB DEFAULT '[]'::jsonb,
  availability_status TEXT NOT NULL DEFAULT 'active',
  is_published        BOOLEAN NOT NULL DEFAULT false,
  is_limited          BOOLEAN NOT NULL DEFAULT false,
  stock_quantity      INTEGER,
  format              TEXT,
  includes            TEXT,
  shipping_note       TEXT,
  sort_order          INTEGER DEFAULT 0,
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_products_slug         ON custom_products(slug);
CREATE INDEX IF NOT EXISTS idx_custom_products_is_published ON custom_products(is_published);
CREATE INDEX IF NOT EXISTS idx_custom_products_category     ON custom_products(category);
CREATE INDEX IF NOT EXISTS idx_custom_products_sort_order   ON custom_products(sort_order);

ALTER TABLE custom_products ENABLE ROW LEVEL SECURITY;

-- Public: read published, non-archived products only
CREATE POLICY "Public reads published custom products"
  ON custom_products FOR SELECT TO anon
  USING (is_published = true AND availability_status != 'archived');

-- Admin: full CRUD
CREATE POLICY "Authenticated users have full access to custom products"
  ON custom_products FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Storage bucket (run separately or via Supabase dashboard)
-- Dashboard → Storage → New Bucket: name="product-images", Public=true
-- Then add policies:
--   INSERT: authenticated users only
--   SELECT: public (anon)
