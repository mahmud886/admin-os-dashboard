-- Add password column to episodes table
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS password TEXT;
