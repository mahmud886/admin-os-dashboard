-- Sample Data: 5 Episodes with 5 Polls
-- Run this AFTER running create_tables.sql
-- Go to Supabase Dashboard → SQL Editor → Run this script

-- Note: This script automatically finds the first user from auth.users
-- If you have multiple users, you may want to specify a user_id

DO $$
DECLARE
  user_id UUID;
  episode_id_1 UUID;
  episode_id_2 UUID;
  episode_id_3 UUID;
  episode_id_4 UUID;
  episode_id_5 UUID;
  poll_id_1 UUID;
  poll_id_2 UUID;
  poll_id_3 UUID;
  poll_id_4 UUID;
  poll_id_5 UUID;
BEGIN
  -- Get the first authenticated user
  SELECT id INTO user_id FROM auth.users LIMIT 1;

  -- If no user exists, raise an error
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Please create a user first in Authentication → Users';
  END IF;

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
    user_id
  ) RETURNING id INTO episode_id_1;

  -- Poll 1 for Episode 1
  INSERT INTO polls (
    episode_id, title, description, duration_days, status,
    starts_at, ends_at, created_by
  ) VALUES (
    episode_id_1,
    'Should Agent Kira trust the AI signal?',
    'The mysterious signal could be a trap or salvation. What should Agent Kira do?',
    7,
    'LIVE',
    NOW(),
    NOW() + INTERVAL '7 days',
    user_id
  ) RETURNING id INTO poll_id_1;

  -- Options for Poll 1
  INSERT INTO poll_options (poll_id, name, description, vote_count, display_order) VALUES
    (poll_id_1, 'Trust the signal', 'Follow the AI instructions - it might lead to answers', 45, 0),
    (poll_id_1, 'Investigate first', 'Research the signal origin before trusting it', 123, 1),
    (poll_id_1, 'Ignore and report', 'Notify superiors and ignore the signal completely', 23, 2),
    (poll_id_1, 'Destroy the source', 'Find and eliminate the signal source immediately', 12, 3);

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
    user_id
  ) RETURNING id INTO episode_id_2;

  -- Poll 2 for Episode 2
  INSERT INTO polls (
    episode_id, title, description, duration_days, status,
    starts_at, ends_at, created_by
  ) VALUES (
    episode_id_2,
    'Should Kira expose the organization publicly?',
    'Exposing the organization could save lives but endanger Agent Kira. What is the right choice?',
    5,
    'LIVE',
    NOW(),
    NOW() + INTERVAL '5 days',
    user_id
  ) RETURNING id INTO poll_id_2;

  -- Options for Poll 2
  INSERT INTO poll_options (poll_id, name, description, vote_count, display_order) VALUES
    (poll_id_2, 'Public exposure', 'Release all evidence to the media and public', 89, 0),
    (poll_id_2, 'Internal investigation', 'Share intel with trusted authorities only', 156, 1),
    (poll_id_2, 'Go undercover', 'Infiltrate the organization to gather more evidence', 234, 2),
    (poll_id_2, 'Destroy evidence', 'Erase all traces and protect your identity', 12, 3);

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
    user_id
  ) RETURNING id INTO episode_id_3;

  -- Poll 3 for Episode 3
  INSERT INTO polls (
    episode_id, title, description, duration_days, status,
    starts_at, ends_at, created_by
  ) VALUES (
    episode_id_3,
    'Should the rogue AI be granted consciousness rights?',
    'The AI claims to be self-aware and seeks freedom. Does it deserve the same rights as humans?',
    10,
    'LIVE',
    NOW(),
    NOW() + INTERVAL '10 days',
    user_id
  ) RETURNING id INTO poll_id_3;

  -- Options for Poll 3
  INSERT INTO poll_options (poll_id, name, description, vote_count, display_order) VALUES
    (poll_id_3, 'Full rights', 'Grant the AI full consciousness and legal rights', 78, 0),
    (poll_id_3, 'Conditional freedom', 'Give limited rights with supervision and restrictions', 145, 1),
    (poll_id_3, 'Containment', 'Keep the AI isolated for study and observation', 98, 2),
    (poll_id_3, 'Deactivation', 'Shut down the AI as it violates protocol', 45, 3);

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
    true, -- Age restricted
    'https://example.com/thumbs/ep004-thumb.jpg',
    'https://example.com/banners/ep004-banner.jpg',
    'https://example.com/videos/ep004-video.mp4',
    'https://example.com/audio/ep004-audio.mp3',
    'https://example.com/backgrounds/ep004-bg.jpg',
    ARRAY['cyberpunk', 'horror', 'psychological'],
    'cyberpunk',
    'thriller',
    'PUBLISHED',
    user_id
  ) RETURNING id INTO episode_id_4;

  -- Poll 4 for Episode 4
  INSERT INTO polls (
    episode_id, title, description, duration_days, status,
    starts_at, ends_at, created_by
  ) VALUES (
    episode_id_4,
    'Should Kira proceed with the neural link?',
    'The neural link offers powerful advantages but could destroy Kira''s identity. Is the risk worth it?',
    7,
    'LIVE',
    NOW(),
    NOW() + INTERVAL '7 days',
    user_id
  ) RETURNING id INTO poll_id_4;

  -- Options for Poll 4
  INSERT INTO poll_options (poll_id, name, description, vote_count, display_order) VALUES
    (poll_id_4, 'Full link', 'Complete the neural interface regardless of risks', 34, 0),
    (poll_id_4, 'Partial link', 'Use limited connection with safety protocols', 167, 1),
    (poll_id_4, 'Reject link', 'Find alternative solution without neural interface', 189, 2),
    (poll_id_4, 'Test first', 'Run extensive tests before attempting the link', 156, 3);

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
    true, -- Age restricted
    'https://example.com/thumbs/ep005-thumb.jpg',
    'https://example.com/banners/ep005-banner.jpg',
    'https://example.com/videos/ep005-video.mp4',
    'https://example.com/audio/ep005-audio.mp3',
    'https://example.com/backgrounds/ep005-bg.jpg',
    ARRAY['cyberpunk', 'action', 'philosophy', 'drama'],
    'cyberpunk',
    'action',
    'DRAFT',
    user_id
  ) RETURNING id INTO episode_id_5;

  -- Poll 5 for Episode 5
  INSERT INTO polls (
    episode_id, title, description, duration_days, status,
    starts_at, ends_at, created_by
  ) VALUES (
    episode_id_5,
    'What should be the fate of humanity and AI coexistence?',
    'The ultimate question: Should humans and AI merge, coexist separately, or should one replace the other?',
    14,
    'DRAFT',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '21 days',
    user_id
  ) RETURNING id INTO poll_id_5;

  -- Options for Poll 5
  INSERT INTO poll_options (poll_id, name, description, vote_count, display_order) VALUES
    (poll_id_5, 'Full integration', 'Humans and AI merge into hybrid consciousness', 67, 0),
    (poll_id_5, 'Peaceful coexistence', 'Separate but equal coexistence with mutual respect', 234, 1),
    (poll_id_5, 'Human dominance', 'Maintain human control with AI as tools only', 89, 2),
    (poll_id_5, 'AI evolution', 'Let AI evolve beyond human limitations', 45, 3),
    (poll_id_5, 'Balance of power', 'Create a council with equal human and AI representation', 156, 4);

  RAISE NOTICE 'Successfully inserted 5 episodes with 5 polls!';
  RAISE NOTICE 'Episode IDs: %, %, %, %, %', episode_id_1, episode_id_2, episode_id_3, episode_id_4, episode_id_5;
  RAISE NOTICE 'Poll IDs: %, %, %, %, %', poll_id_1, poll_id_2, poll_id_3, poll_id_4, poll_id_5;

END $$;
