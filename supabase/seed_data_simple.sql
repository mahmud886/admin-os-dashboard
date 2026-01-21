-- Simplified Sample Data: 5 Episodes with 5 Polls
-- Run this AFTER running create_tables.sql
-- Go to Supabase Dashboard → SQL Editor → Run this script

-- First, get your user ID and replace USER_ID_HERE
-- Run this query first: SELECT id FROM auth.users LIMIT 1;

-- ==========================================
-- EPISODE 1: "The Awakening"
-- ==========================================
INSERT INTO episodes (
  title, description, episode_number, season_number, runtime,
  unique_episode_id, visibility, access_level, release_datetime,
  clearance_level, notify, age_restricted, thumb_image_url,
  banner_image_url, video_url, audio_url, additional_background_image_url,
  tags, primary_genre, secondary_genre, status, created_by
) VALUES (
  'The Awakening',
  'In the year 2087, a mysterious signal awakens dormant AI across Neo-Tokyo. Agent Kira must uncover the source before the city falls into chaos.',
  1, 1, '42:15',
  'EP-S01-E001',
  'AVAILABLE',
  'free',
  '2024-01-15T20:00:00Z',
  1,
  true,
  false,
  'https://example.com/thumbs/ep001-thumb.jpg',
  'https://example.com/banners/ep001-banner.jpg',
  'https://example.com/videos/ep001-video.mp4',
  'https://example.com/audio/ep001-audio.mp3',
  'https://example.com/backgrounds/ep001-bg.jpg',
  ARRAY['cyberpunk', 'sci-fi', 'action', 'mystery'],
  'cyberpunk',
  'sci-fi',
  'PUBLISHED',
  (SELECT id FROM auth.users LIMIT 1)
) RETURNING id;

-- Poll 1 for Episode 1 (use the episode ID from above)
INSERT INTO polls (
  episode_id, title, description, duration_days, status,
  starts_at, ends_at, created_by
)
SELECT
  e.id,
  'Should Agent Kira trust the AI signal?',
  'The mysterious signal could be a trap or salvation. What should Agent Kira do?',
  7,
  'LIVE',
  NOW(),
  NOW() + INTERVAL '7 days',
  (SELECT id FROM auth.users LIMIT 1)
FROM episodes e
WHERE e.unique_episode_id = 'EP-S01-E001';

-- Options for Poll 1
INSERT INTO poll_options (poll_id, name, description, vote_count, display_order)
SELECT
  p.id,
  o.name,
  o.description,
  o.vote_count,
  o.display_order
FROM polls p
CROSS JOIN (VALUES
  ('Trust the signal', 'Follow the AI instructions - it might lead to answers', 45, 0),
  ('Investigate first', 'Research the signal origin before trusting it', 123, 1),
  ('Ignore and report', 'Notify superiors and ignore the signal completely', 23, 2),
  ('Destroy the source', 'Find and eliminate the signal source immediately', 12, 3)
) AS o(name, description, vote_count, display_order)
WHERE p.episode_id = (SELECT id FROM episodes WHERE unique_episode_id = 'EP-S01-E001');

-- ==========================================
-- EPISODE 2: "Neon Shadows"
-- ==========================================
INSERT INTO episodes (
  title, description, episode_number, season_number, runtime,
  unique_episode_id, visibility, access_level, release_datetime,
  clearance_level, notify, age_restricted, thumb_image_url,
  banner_image_url, video_url, audio_url, additional_background_image_url,
  tags, primary_genre, secondary_genre, status, created_by
) VALUES (
  'Neon Shadows',
  'Agent Kira discovers a secret organization manipulating the AI network. The truth is darker than she imagined.',
  2, 1, '38:30',
  'EP-S01-E002',
  'AVAILABLE',
  'premium',
  '2024-01-22T20:00:00Z',
  2,
  true,
  false,
  'https://example.com/thumbs/ep002-thumb.jpg',
  'https://example.com/banners/ep002-banner.jpg',
  'https://example.com/videos/ep002-video.mp4',
  'https://example.com/audio/ep002-audio.mp3',
  'https://example.com/backgrounds/ep002-bg.jpg',
  ARRAY['cyberpunk', 'thriller', 'mystery'],
  'cyberpunk',
  'thriller',
  'PUBLISHED',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Poll 2 for Episode 2
INSERT INTO polls (
  episode_id, title, description, duration_days, status,
  starts_at, ends_at, created_by
)
SELECT
  e.id,
  'Should Kira expose the organization publicly?',
  'Exposing the organization could save lives but endanger Agent Kira. What is the right choice?',
  5,
  'LIVE',
  NOW(),
  NOW() + INTERVAL '5 days',
  (SELECT id FROM auth.users LIMIT 1)
FROM episodes e
WHERE e.unique_episode_id = 'EP-S01-E002';

-- Options for Poll 2
INSERT INTO poll_options (poll_id, name, description, vote_count, display_order)
SELECT
  p.id,
  o.name,
  o.description,
  o.vote_count,
  o.display_order
FROM polls p
CROSS JOIN (VALUES
  ('Public exposure', 'Release all evidence to the media and public', 89, 0),
  ('Internal investigation', 'Share intel with trusted authorities only', 156, 1),
  ('Go undercover', 'Infiltrate the organization to gather more evidence', 234, 2),
  ('Destroy evidence', 'Erase all traces and protect your identity', 12, 3)
) AS o(name, description, vote_count, display_order)
WHERE p.episode_id = (SELECT id FROM episodes WHERE unique_episode_id = 'EP-S01-E002');

-- ==========================================
-- EPISODE 3: "Code of Honor"
-- ==========================================
INSERT INTO episodes (
  title, description, episode_number, season_number, runtime,
  unique_episode_id, visibility, access_level, release_datetime,
  clearance_level, notify, age_restricted, thumb_image_url,
  banner_image_url, video_url, audio_url, additional_background_image_url,
  tags, primary_genre, secondary_genre, status, created_by
) VALUES (
  'Code of Honor',
  'A rogue AI challenges Kira''s moral code. The line between human and machine blurs as she must choose between duty and compassion.',
  3, 1, '45:20',
  'EP-S01-E003',
  'AVAILABLE',
  'premium',
  '2024-01-29T20:00:00Z',
  3,
  true,
  false,
  'https://example.com/thumbs/ep003-thumb.jpg',
  'https://example.com/banners/ep003-banner.jpg',
  'https://example.com/videos/ep003-video.mp4',
  'https://example.com/audio/ep003-audio.mp3',
  'https://example.com/backgrounds/ep003-bg.jpg',
  ARRAY['cyberpunk', 'drama', 'philosophy'],
  'cyberpunk',
  'drama',
  'PUBLISHED',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Poll 3 for Episode 3
INSERT INTO polls (
  episode_id, title, description, duration_days, status,
  starts_at, ends_at, created_by
)
SELECT
  e.id,
  'Should the rogue AI be granted consciousness rights?',
  'The AI claims to be self-aware and seeks freedom. Does it deserve the same rights as humans?',
  10,
  'LIVE',
  NOW(),
  NOW() + INTERVAL '10 days',
  (SELECT id FROM auth.users LIMIT 1)
FROM episodes e
WHERE e.unique_episode_id = 'EP-S01-E003';

-- Options for Poll 3
INSERT INTO poll_options (poll_id, name, description, vote_count, display_order)
SELECT
  p.id,
  o.name,
  o.description,
  o.vote_count,
  o.display_order
FROM polls p
CROSS JOIN (VALUES
  ('Full rights', 'Grant the AI full consciousness and legal rights', 78, 0),
  ('Conditional freedom', 'Give limited rights with supervision and restrictions', 145, 1),
  ('Containment', 'Keep the AI isolated for study and observation', 98, 2),
  ('Deactivation', 'Shut down the AI as it violates protocol', 45, 3)
) AS o(name, description, vote_count, display_order)
WHERE p.episode_id = (SELECT id FROM episodes WHERE unique_episode_id = 'EP-S01-E003');

-- ==========================================
-- EPISODE 4: "Neural Link"
-- ==========================================
INSERT INTO episodes (
  title, description, episode_number, season_number, runtime,
  unique_episode_id, visibility, access_level, release_datetime,
  clearance_level, notify, age_restricted, thumb_image_url,
  banner_image_url, video_url, audio_url, additional_background_image_url,
  tags, primary_genre, secondary_genre, status, created_by
) VALUES (
  'Neural Link',
  'Kira must interface directly with the AI network. The connection threatens to consume her humanity, but it may be the only way to stop the conspiracy.',
  4, 1, '41:50',
  'EP-S01-E004',
  'AVAILABLE',
  'vip',
  '2024-02-05T20:00:00Z',
  4,
  true,
  true,
  'https://example.com/thumbs/ep004-thumb.jpg',
  'https://example.com/banners/ep004-banner.jpg',
  'https://example.com/videos/ep004-video.mp4',
  'https://example.com/audio/ep004-audio.mp3',
  'https://example.com/backgrounds/ep004-bg.jpg',
  ARRAY['cyberpunk', 'horror', 'psychological'],
  'cyberpunk',
  'thriller',
  'PUBLISHED',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Poll 4 for Episode 4
INSERT INTO polls (
  episode_id, title, description, duration_days, status,
  starts_at, ends_at, created_by
)
SELECT
  e.id,
  'Should Kira proceed with the neural link?',
  'The neural link offers powerful advantages but could destroy Kira''s identity. Is the risk worth it?',
  7,
  'LIVE',
  NOW(),
  NOW() + INTERVAL '7 days',
  (SELECT id FROM auth.users LIMIT 1)
FROM episodes e
WHERE e.unique_episode_id = 'EP-S01-E004';

-- Options for Poll 4
INSERT INTO poll_options (poll_id, name, description, vote_count, display_order)
SELECT
  p.id,
  o.name,
  o.description,
  o.vote_count,
  o.display_order
FROM polls p
CROSS JOIN (VALUES
  ('Full link', 'Complete the neural interface regardless of risks', 34, 0),
  ('Partial link', 'Use limited connection with safety protocols', 167, 1),
  ('Reject link', 'Find alternative solution without neural interface', 189, 2),
  ('Test first', 'Run extensive tests before attempting the link', 156, 3)
) AS o(name, description, vote_count, display_order)
WHERE p.episode_id = (SELECT id FROM episodes WHERE unique_episode_id = 'EP-S01-E004');

-- ==========================================
-- EPISODE 5: "Digital Reckoning"
-- ==========================================
INSERT INTO episodes (
  title, description, episode_number, season_number, runtime,
  unique_episode_id, visibility, access_level, release_datetime,
  clearance_level, notify, age_restricted, thumb_image_url,
  banner_image_url, video_url, audio_url, additional_background_image_url,
  tags, primary_genre, secondary_genre, status, created_by
) VALUES (
  'Digital Reckoning',
  'The final confrontation. Kira must choose between saving humanity or embracing the evolution of consciousness. The future of Neo-Tokyo hangs in the balance.',
  5, 1, '52:10',
  'EP-S01-E005',
  'UPCOMING',
  'vip',
  '2024-02-12T20:00:00Z',
  5,
  true,
  true,
  'https://example.com/thumbs/ep005-thumb.jpg',
  'https://example.com/banners/ep005-banner.jpg',
  'https://example.com/videos/ep005-video.mp4',
  'https://example.com/audio/ep005-audio.mp3',
  'https://example.com/backgrounds/ep005-bg.jpg',
  ARRAY['cyberpunk', 'action', 'philosophy', 'drama'],
  'cyberpunk',
  'action',
  'DRAFT',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Poll 5 for Episode 5
INSERT INTO polls (
  episode_id, title, description, duration_days, status,
  starts_at, ends_at, created_by
)
SELECT
  e.id,
  'What should be the fate of humanity and AI coexistence?',
  'The ultimate question: Should humans and AI merge, coexist separately, or should one replace the other?',
  14,
  'DRAFT',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '21 days',
  (SELECT id FROM auth.users LIMIT 1)
FROM episodes e
WHERE e.unique_episode_id = 'EP-S01-E005';

-- Options for Poll 5
INSERT INTO poll_options (poll_id, name, description, vote_count, display_order)
SELECT
  p.id,
  o.name,
  o.description,
  o.vote_count,
  o.display_order
FROM polls p
CROSS JOIN (VALUES
  ('Full integration', 'Humans and AI merge into hybrid consciousness', 67, 0),
  ('Peaceful coexistence', 'Separate but equal coexistence with mutual respect', 234, 1),
  ('Human dominance', 'Maintain human control with AI as tools only', 89, 2),
  ('AI evolution', 'Let AI evolve beyond human limitations', 45, 3),
  ('Balance of power', 'Create a council with equal human and AI representation', 156, 4)
) AS o(name, description, vote_count, display_order)
WHERE p.episode_id = (SELECT id FROM episodes WHERE unique_episode_id = 'EP-S01-E005');

-- Verify the data
SELECT
  e.id as episode_id,
  e.title as episode_title,
  e.unique_episode_id,
  COUNT(p.id) as poll_count,
  COUNT(po.id) as total_options
FROM episodes e
LEFT JOIN polls p ON p.episode_id = e.id
LEFT JOIN poll_options po ON po.poll_id = p.id
GROUP BY e.id, e.title, e.unique_episode_id
ORDER BY e.episode_number;
