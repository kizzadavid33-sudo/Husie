-- Phase 6: Private Circles. Apply after 001_independent_foundation.sql.
create table if not exists circles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  description text not null default '' check (char_length(description) <= 240),
  owner_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists circle_members (
  circle_id uuid not null references circles(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  joined_at timestamptz not null default now(),
  primary key(circle_id,user_id)
);
create table if not exists circle_posts (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  author_id uuid not null references users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2200),
  created_at timestamptz not null default now()
);
create index if not exists circle_members_user_idx on circle_members(user_id,circle_id);
create index if not exists circle_posts_circle_idx on circle_posts(circle_id,created_at desc);
-- Memberships and posts are deleted automatically when a circle, member, or author is removed.
