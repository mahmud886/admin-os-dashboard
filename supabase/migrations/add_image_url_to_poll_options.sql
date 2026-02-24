-- Add image_url column to poll_options table
ALTER TABLE poll_options
ADD COLUMN IF NOT EXISTS image_url TEXT;
