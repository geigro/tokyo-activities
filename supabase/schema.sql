-- Tokyo Activities – Supabase Schema
-- Run this in the Supabase SQL editor to set up the database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

insert into categories (name, slug) values
  ('Attractions', 'attractions'),
  ('Entertainment', 'entertainment'),
  ('Shopping', 'shopping'),
  ('Food', 'food'),
  ('Gaming', 'gaming'),
  ('Culture', 'culture'),
  ('Nature', 'nature'),
  ('Experiences', 'experiences'),
  ('Nightlife', 'nightlife'),
  ('Viewpoints', 'viewpoints')
on conflict do nothing;

-- ============================================================
-- ACTIVITIES
-- ============================================================
create table if not exists activities (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text not null,
  short_description text,
  category text not null references categories(name),
  tags text[] not null default '{}',
  images text[] not null default '{}',
  price_min integer,
  price_max integer,
  price_currency text not null default 'JPY',
  price_options jsonb,
  location text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  website text,
  booking_url text,
  opening_hours text,
  duration text,
  is_indoor boolean,
  is_outdoor boolean,
  created_at timestamptz not null default now()
);

-- Public read access
alter table activities enable row level security;

create policy "Anyone can read activities"
  on activities for select
  using (true);

-- ============================================================
-- PARTICIPANTS
-- ============================================================
create table if not exists participants (
  id uuid primary key default uuid_generate_v4(),
  display_name text not null,
  participant_token uuid not null unique default uuid_generate_v4(),
  created_at timestamptz not null default now()
);

alter table participants enable row level security;

-- Participants can only read their own row (identified by token passed as claim)
-- A lightweight token-based approach: the app passes the token in a header or as metadata
create policy "Participants can read own row"
  on participants for select
  using (true); -- Adjust when auth is implemented

create policy "Anyone can create a participant"
  on participants for insert
  with check (true);

-- ============================================================
-- VOTES
-- ============================================================
create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid not null references activities(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  vote_type text not null check (vote_type in ('like', 'dislike', 'neutral')),
  created_at timestamptz not null default now(),
  -- Prevent duplicate votes from the same participant per activity
  unique(activity_id, participant_id)
);

alter table votes enable row level security;

-- Only allow reading votes (totals visible to all)
create policy "Anyone can read votes"
  on votes for select
  using (true);

-- Only the participant themselves can insert/update/delete their vote
-- When token auth is implemented, replace `true` with token check
create policy "Participants can manage their own vote"
  on votes for insert
  with check (true);

create policy "Participants can update their own vote"
  on votes for update
  using (true);

create policy "Participants can delete their own vote"
  on votes for delete
  using (true);

-- ============================================================
-- VOTE AGGREGATES VIEW
-- ============================================================
create or replace view activity_vote_counts as
  select
    a.id as activity_id,
    a.name,
    a.slug,
    count(v.id) filter (where v.vote_type = 'like') as likes,
    count(v.id) filter (where v.vote_type = 'dislike') as dislikes,
    count(v.id) as total_votes
  from activities a
  left join votes v on v.activity_id = a.id
  group by a.id, a.name, a.slug;

-- ============================================================
-- NOTES FOR FUTURE IMPLEMENTATION
-- ============================================================
-- 1. Implement participant token verification via Supabase Auth or custom JWT claims
-- 2. Tighten RLS policies on votes to check participant_token matches
-- 3. Add realtime subscriptions on votes for live updates
-- 4. Add index on votes(activity_id) for fast aggregate queries
create index if not exists votes_activity_id_idx on votes(activity_id);
create index if not exists votes_participant_id_idx on votes(participant_id);
