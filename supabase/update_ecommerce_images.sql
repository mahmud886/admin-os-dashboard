-- Update existing ecommerce order items with sample images
-- Run this in your Supabase SQL Editor

UPDATE ecommerce_order_items
SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
WHERE product_name = 'Neural Link Tee';

UPDATE ecommerce_order_items
SET image_url = 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80'
WHERE product_name = 'Spore Sticker Pack';

UPDATE ecommerce_order_items
SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80'
WHERE product_name = 'Neon Wristband';

UPDATE ecommerce_order_items
SET image_url = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'
WHERE product_name = 'Resistance Hoodie';

UPDATE ecommerce_order_items
SET image_url = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=800&q=80'
WHERE product_name = 'Limited Edition Vinyl';
