-- Update visibility check constraint to include 'FEATURED'
ALTER TABLE episodes DROP CONSTRAINT IF EXISTS episodes_visibility_check;
ALTER TABLE episodes ADD CONSTRAINT episodes_visibility_check CHECK (visibility IN ('AVAILABLE', 'UPCOMING', 'LOCKED', 'DRAFT', 'ARCHIVED', 'FEATURED'));
