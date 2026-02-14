-- SQL Seed Data for EdenStone Modules (Run in Supabase SQL Editor)
-- Fully populated with lore-accurate content based on EdenStone summaries

-- ==========================================
-- BLOGS SEED DATA
-- ==========================================
TRUNCATE TABLE blogs;

INSERT INTO blogs (slug, title, excerpt, content, cover_image, tags, author, published_at)
VALUES
(
  'character-unveil-marcus-varga',
  'Character Unveil—Marcus Varga (Age 33)',
  'Marcus Varga didn''t choose power—it chose him. As a Bastion Party Captain, his gold armband is both his authority and his cage. He appears the perfect soldier—until you notice the weariness in his eyes.',
  '<p>Marcus Varga didn''t choose power—it chose him. As a Bastion Party Captain, his gold armband is both his authority and his cage. He appears the perfect soldier—until you notice the weariness in his eyes, the tremor in his gloved hands, betraying the ghost of the man he was.</p>
   <p>In the sterile corridors of the Bastion headquarters, Marcus walks with the heavy gait of a man carrying the weight of Lionara''s survival on his shoulders. The city sees him as the enforcer of the Iron Law, the cold hand that separates the infected from the clean. But beneath the polished insignia and the rigid uniform lies a fractured soul, haunted by the memories of the time before the Spore.</p>
   <p>"Order is not a preference; it is a necessity," he often recites during the morning briefings. Yet, in the solitude of his quarters, staring at the flickering holographic display of the city''s quarantine zones, he wonders if the price of this order—the humanity they strip away layer by layer—is too high. He is a man caught between duty and conscience, a silent guardian who knows that the walls he builds to protect the city are the same ones that imprison him.</p>
   <p>His story is not one of villainy, but of tragic necessity. In a world teetering on the brink of extinction, Marcus Varga forces himself to be the monster so that others might remain human. But for how long can a man wear the mask before it becomes his face?</p>',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80', 
  ARRAY['Character Unveil', 'Lore', 'Bastion'],
  'EdenStone',
  NOW() - INTERVAL '5 days'
),
(
  'character-unveil-lena-chen',
  'Character Unveil—Lena Chen (Age 30)',
  'In a world that commands you to look away, some choose a different path. Lena Chen is the quiet, beating heart of resistance in a city gone silent with fear.',
  '<p>In a world that commands you to look away, some choose a different path. Lena Chen is the quiet, beating heart of resistance in a city gone silent with fear. With ingenuity, bandages, and botanicals, she wages a personal war against despair.</p>
   <p>Operating from the hidden sub-levels of Sector 4, Lena''s clinic is a sanctuary of green in a world of grey concrete and steel. The air here smells of damp earth and dried herbs—a stark contrast to the sterile, ozone-scented streets of Lionara above. She doesn''t wield a weapon; her tools are the ancient knowledge of healing, preserved in tattered books and passed down through whispers.</p>
   <p>They call her the "Botanist of the Below." To the sick and the hiding, she is a miracle worker. She treats Spore symptoms not just with medicine, but with empathy—a resource scarcer than clean water. Lena believes that survival isn''t just about breathing; it''s about maintaining the connection to what makes us human.</p>
   <p>"The Spore takes the body," she tells her patients, wrapping a poultice of crushed fern and synthesized antivirals around a wound, "but fear takes the mind. We must not let them have both." Her resistance is silent, growing through the cracks in the pavement, resilient and undeniable.</p>',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&auto=format&fit=crop&q=80', 
  ARRAY['Character Unveil', 'Lore', 'Resistance'],
  'EdenStone',
  NOW() - INTERVAL '3 days'
),
(
  'creator-log-2-spore-a-universe',
  'Creator Log 2—SPORE, a Universe',
  'In the fractured city of Lionara, a brutal regime suppresses a deadly Spore pathogen. Humanity''s future hinges on newly emerged predictive abilities.',
  '<p>In the fractured city of Lionara, a brutal regime suppresses a deadly Spore pathogen. Humanity''s future hinges on newly emerged predictive abilities that could either accelerate evolution or end it.</p>
   <p>The SPORE universe is built on a fundamental question: When nature evolves to reclaim its dominion, does humanity fight to remain the same, or do we evolve with it? Lionara is the crucible of this question. It is a city of verticality, where the wealthy live in the cloud-piercing spires of the "Canopy," basking in filtered sunlight, while the masses dwell in the "Roots," the permanent twilight of the lower levels.</p>
   <p>The Spore is not just a disease; it is an agent of change. Those who survive infection are changed—some physically, becoming part of the hive-mind ecology, while others develop "The Sight," a predictive ability that allows them to glimpse moments into the future. This evolutionary leap terrifies the Bastion regime, who see it as a loss of control, a chaotic variable in their equation of order.</p>
   <p>We are building this universe not just as a backdrop for stories, but as a living, breathing ecosystem. Every street corner in Lionara has a history; every faction has a philosophy. From the neon-drenched markets of the Mid-Levels to the silent, overgrown ruins of the Outskirts, SPORE is a stage for the drama of human evolution.</p>',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', 
  ARRAY['Creator Log', 'Devlog', 'Worldbuilding'],
  'EdenStone',
  NOW() - INTERVAL '1 day'
),
(
  'creator-log-1-genesis',
  'Creator Log 1—GENESIS',
  'Spore is a story born from Isolation, forged in Community, and built for anyone who has ever felt lost and found their way back through Human Connection.',
  '<p>Spore is a story born from Isolation, forged in Community, and built for anyone who has ever felt lost and found their way back through Human Connection.</p>
   <p>The genesis of this project wasn''t in a boardroom, but in the quiet moments of reflection that followed a global pause. We realized that the stories that resonate most deeply are not about saving the world, but about saving each other. Isolation is a powerful force; it builds walls, it breeds suspicion. But connection—true, raw human connection—is the antidote.</p>
   <p>We wanted to create a narrative that explores this dichotomy. In Lionara, physical isolation is enforced by law—quarantines, checkpoints, sectors. Yet, the characters find ways to bridge these gaps. They find connection in shared trauma, in shared hope, and in the shared defiance of a system that demands their separation.</p>
   <p>This is just the beginning. GENESIS is our promise to you: to tell stories that matter, to build worlds that feel real, and to honor the resilience of the human spirit in the face of the unknown. Welcome to the Spore.</p>',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&auto=format&fit=crop&q=80', 
  ARRAY['Creator Log', 'Devlog', 'Philosophy'],
  'EdenStone',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  tags = EXCLUDED.tags,
  author = EXCLUDED.author,
  updated_at = NOW();


-- ==========================================
-- EPISODES SEED DATA
-- ==========================================
TRUNCATE TABLE episodes;

INSERT INTO episodes (slug, title, description, video_url, thumbnail_url, season_number, episode_number, duration, published_at)
VALUES
(
  'ep-1-the-outbreak',
  'Episode 1: The Outbreak',
  'The first signs of the Spore appear in the lower sectors. Lena Chen encounters Patient Zero.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  1,
  1,
  '24:15',
  NOW() - INTERVAL '10 days'
),
(
  'ep-2-walls-rising',
  'Episode 2: Walls Rising',
  'Marcus Varga receives his orders. The Bastion begins constructing the containment zones.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1596367407372-96cb53d70300?w=1200&auto=format&fit=crop&q=80',
  1,
  2,
  '28:45',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  updated_at = NOW();


-- ==========================================
-- POLLS SEED DATA
-- ==========================================
TRUNCATE TABLE polls;

INSERT INTO polls (question, options, is_active, expires_at)
VALUES
(
  'Which faction do you align with?',
  '[
    {"id": "opt_1", "label": "The Bastion (Order)", "votes": 45},
    {"id": "opt_2", "label": "The Resistance (Freedom)", "votes": 62},
    {"id": "opt_3", "label": "The Spore (Evolution)", "votes": 12}
  ]'::jsonb,
  true,
  NOW() + INTERVAL '30 days'
),
(
  'Should the quarantine be lifted?',
  '[
    {"id": "opt_a", "label": "Yes, immediately", "votes": 20},
    {"id": "opt_b", "label": "No, it''s too dangerous", "votes": 80}
  ]'::jsonb,
  false,
  NOW() - INTERVAL '1 day'
);


-- ==========================================
-- EMAIL LIST SEED DATA
-- ==========================================
TRUNCATE TABLE email_list;

INSERT INTO email_list (email, status, source)
VALUES
('survivor1@lionara.com', 'subscribed', 'website'),
('captain.varga@bastion.net', 'subscribed', 'manual'),
('lena.c@resistance.org', 'subscribed', 'campaign'),
('banned.user@unknown.com', 'unsubscribed', 'website')
ON CONFLICT (email) DO NOTHING;
