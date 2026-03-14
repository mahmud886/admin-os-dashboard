-- Add video_url column to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS video_url TEXT;
