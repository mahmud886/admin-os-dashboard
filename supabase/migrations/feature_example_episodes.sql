-- Example: Set 'GENESIS' episode to FEATURED
UPDATE episodes
SET visibility = 'FEATURED'
WHERE title = 'GENESIS';

-- Example: Set the latest AVAILABLE episode to FEATURED
UPDATE episodes
SET visibility = 'FEATURED'
WHERE id = (
  SELECT id FROM episodes
  WHERE visibility = 'AVAILABLE'
  ORDER BY created_at DESC
  LIMIT 1
);
