-- Run this entire block in your Supabase SQL Editor (supabase.com > your project > SQL Editor)
-- It creates the games table and enables real-time updates.

create table if not exists games (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  state jsonb not null default '{}'::jsonb
);

-- Enable Row Level Security (keep it open for now - you can lock it down later)
alter table games enable row level security;

create policy "Anyone can read games"
  on games for select using (true);

create policy "Anyone can insert games"
  on games for insert with check (true);

create policy "Anyone can update games"
  on games for update using (true);

-- Enable real-time for the games table
-- (Go to Supabase Dashboard > Database > Replication and toggle 'games' table ON)
-- OR run this:
alter publication supabase_realtime add table games;
