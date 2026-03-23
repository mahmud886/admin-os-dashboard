-- Add tax, shipping, and subtotal columns to ecommerce_orders table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE ecommerce_orders 
ADD COLUMN IF NOT EXISTS tax DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS shipping DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0.00;
