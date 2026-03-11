-- Add password protection fields to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS is_password_protected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS access_password TEXT;

-- Update RLS policies if necessary (assuming public read is still allowed, but frontend handles the check)
-- If we want to secure the content at DB level, we might need more complex RLS, 
-- but for now, we'll rely on the API/Frontend to check the flag.
