-- Migration: color variants for custom_products
-- Run this in the Supabase SQL Editor

ALTER TABLE custom_products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- Shape of each element in the variants array:
-- { "id": "uuid", "color": "Red", "image": "https://...", "stockQuantity": 5 }
-- "image" and "stockQuantity" are optional (null allowed).
