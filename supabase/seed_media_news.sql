-- Insert sample Media News data
-- Run this in Supabase Dashboard -> SQL Editor

INSERT INTO media_news (
  slug,
  title,
  excerpt,
  content,
  cover_image,
  source,
  source_url,
  tags,
  author,
  published_at
) VALUES
(
  'spore-fall-featured-in-wired',
  'Spore Fall: The Indie Sci-Fi Phenomenon Taking Over Streaming',
  'Wired Magazine takes a deep dive into the creation of Spore Fall and how it''s challenging traditional studio models.',
  '<p>In a recent feature, <strong>Wired Magazine</strong> explores the rapid rise of <em>Spore Fall</em>. The article highlights the innovative use of community-driven storytelling and the unique "Admin OS" dashboard that allows fans to interact with the universe in real-time.</p><p>"It''s not just a show, it''s a living system," says lead developer Sarah Jenkins. The piece goes on to discuss the technical challenges of rendering high-fidelity space battles on a budget and the passionate fanbase that has sprung up around the series.</p><blockquote>"Spore Fall proves that you don''t need a billion-dollar budget to tell a compelling sci-fi story. You just need a vision and a community." - Wired</blockquote>',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
  'Wired',
  'https://www.wired.com',
  ARRAY['press', 'feature', 'tech'],
  'Admin',
  NOW() - INTERVAL '2 days'
),
(
  'ign-review-season-2-premiere',
  'IGN Review: Spore Fall Season 2 Premiere "The Void Calls"',
  'IGN gives the Season 2 premiere a 9/10, praising the visual upgrades and character development.',
  '<p><strong>IGN</strong> has released their review of the highly anticipated Season 2 premiere, "The Void Calls". Awarding it a stellar <strong>9/10</strong>, the review praises the significant leap in visual quality and the deeper emotional stakes for the crew of the <em>Aethelgard</em>.</p><p>"The visual effects have taken a massive step forward, rivaling major network productions. But it''s the character moments that really land," writes the reviewer. "Captain Vance''s struggle with the command decisions made in Season 1 sets a dark and compelling tone for the new season."</p>',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&q=80',
  'IGN',
  'https://www.ign.com',
  ARRAY['review', 'season-2', 'ign'],
  'Admin',
  NOW() - INTERVAL '5 days'
),
(
  'variety-interview-showrunner',
  'Variety: Showrunner Talks Future of Spore Fall Universe',
  'Exclusive interview with the creative team about what lies ahead for the franchise.',
  '<p><strong>Variety</strong> sat down with the creators of Spore Fall to discuss the future of the franchise. The interview touches on potential spin-offs, the upcoming graphic novel tie-in, and the possibility of a feature film.</p><p>Key takeaways include:</p><ul><li>Plans for a prequel series focusing on the First Contact War.</li><li>A confirmed partnership with a major comic book publisher.</li><li>Hints about a "game-changing" twist in the Season 2 finale.</li></ul><p>The team emphasized their commitment to keeping the core story accessible while expanding the lore for dedicated fans.</p>',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80',
  'Variety',
  'https://variety.com',
  ARRAY['interview', 'future', 'exclusive'],
  'Admin',
  NOW() - INTERVAL '1 week'
),
(
  'kotaku-game-adaptation-rumors',
  'Kotaku: Rumors Swirl About Spore Fall RPG',
  'Sources suggest a major studio is in talks to adapt the series into an open-world RPG.',
  '<p>According to sources close to <strong>Kotaku</strong>, a major game studio is in early talks to adapt <em>Spore Fall</em> into an open-world RPG. While details are scarce, the game is rumored to be set during the "Golden Age of Exploration," allowing players to captain their own ships and explore the procedural galaxy.</p><p>Fans have long requested a game adaptation, citing the show''s rich lore and detailed world-building as a perfect fit for the medium. No official announcement has been made, but excitement is already building on social media.</p>',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&q=80',
  'Kotaku',
  'https://kotaku.com',
  ARRAY['gaming', 'rumor', 'rpg'],
  'Admin',
  NOW() - INTERVAL '10 days'
),
(
  'techcrunch-admin-os-deep-dive',
  'TechCrunch: How Spore Fall Built Its Own Operating System',
  'A look at the React-based dashboard that powers the show''s immersive experience.',
  '<p><strong>TechCrunch</strong> investigates the tech stack behind the "Admin OS" dashboard. Built with <strong>Next.js</strong>, <strong>Tailwind CSS</strong>, and <strong>Supabase</strong>, the dashboard offers a level of interactivity rarely seen in entertainment properties.</p><p>"It''s not just a marketing site; it''s a fully functional application," explains the lead engineer. The article details how the team optimized real-time data updates for the "Sector Status" map and the challenges of scaling the backend to handle traffic spikes during episode premieres.</p>',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  'TechCrunch',
  'https://techcrunch.com',
  ARRAY['tech', 'development', 'behind-the-scenes'],
  'Admin',
  NOW() - INTERVAL '2 weeks'
);
