-- Create blogs table
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  tags text[],
  author text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) for blogs
alter table blogs enable row level security;

-- Create policies for blogs
create policy "Public blogs are viewable by everyone"
  on blogs for select
  using (true);

create policy "Authenticated users can insert blogs"
  on blogs for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update blogs"
  on blogs for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete blogs"
  on blogs for delete
  using (auth.role() = 'authenticated');


-- ==========================================
-- EPISODES MANAGEMENT
-- ==========================================

create table if not exists episodes (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text,
  video_url text not null, -- YouTube or other video link
  thumbnail_url text,
  season_number integer default 1,
  episode_number integer not null,
  duration text, -- e.g., "45:00"
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table episodes enable row level security;

create policy "Public episodes are viewable by everyone"
  on episodes for select
  using (true);

create policy "Authenticated users can manage episodes"
  on episodes for all
  using (auth.role() = 'authenticated');


-- ==========================================
-- POLL MANAGEMENT
-- ==========================================

create table if not exists polls (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  options jsonb not null default '[]'::jsonb, -- Array of objects: [{"id": "1", "label": "Option A", "votes": 0}]
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table polls enable row level security;

create policy "Public polls are viewable by everyone"
  on polls for select
  using (true);

create policy "Authenticated users can manage polls"
  on polls for all
  using (auth.role() = 'authenticated');

-- Optional: Function to increment poll votes safely (RPC)
-- create or replace function vote_poll(poll_id uuid, option_id text)
-- returns void as $$
-- begin
--   update polls
--   set options = (
--     select jsonb_agg(
--       case
--         when elem->>'id' = option_id then jsonb_set(elem, '{votes}', (coalesce((elem->>'votes')::int, 0) + 1)::text::jsonb)
--         else elem
--       end
--     )
--     from jsonb_array_elements(options) as elem
--   )
--   where id = poll_id;
-- end;
-- $$ language plpgsql security definer;


-- ==========================================
-- EMAIL LIST MANAGEMENT
-- ==========================================

create table if not exists email_list (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  status text default 'subscribed' check (status in ('subscribed', 'unsubscribed', 'bounced')),
  source text default 'website',
  subscribed_at timestamptz default now()
);

alter table email_list enable row level security;

-- Only admins can view the full email list
create policy "Authenticated users can view email list"
  on email_list for select
  using (auth.role() = 'authenticated');

-- Public can subscribe (insert only)
create policy "Public can subscribe to email list"
  on email_list for insert
  with check (true);

-- Admins can manage the list
create policy "Authenticated users can update/delete emails"
  on email_list for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete emails"
  on email_list for delete
  using (auth.role() = 'authenticated');
