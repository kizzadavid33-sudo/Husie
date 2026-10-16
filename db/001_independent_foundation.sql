create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  username text not null unique check (char_length(username) between 3 and 30),
  display_name text not null default '',
  bio text not null default '' check (char_length(bio) <= 500),
  avatar_path text,
  cover_path text,
  bio_link text,
  contact_email text,
  contact_phone text,
  contact_other text,
  creator_status text not null default 'user' check (creator_status in ('user','creator','verified')),
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  caption text not null default '' check (char_length(caption) <= 2200),
  visibility text not null default 'public' check (visibility in ('public','followers','private')),
  music_path text,
  music_name text,
  music_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image','video')),
  mime_type text,
  width integer,
  height integer,
  duration_seconds numeric,
  created_at timestamptz not null default now()
);

create table if not exists follows (follower_id uuid references users(id) on delete cascade, following_id uuid references users(id) on delete cascade, created_at timestamptz not null default now(), primary key(follower_id,following_id), check(follower_id<>following_id));
create table if not exists likes (user_id uuid references users(id) on delete cascade, post_id uuid references posts(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,post_id));
create table if not exists post_reactions (user_id uuid references users(id) on delete cascade, post_id uuid references posts(id) on delete cascade, reaction text not null check(reaction in ('like','love','haha','wow','sad','angry')), created_at timestamptz not null default now(), primary key(user_id,post_id));
create table if not exists comments (id uuid primary key default gen_random_uuid(), post_id uuid references posts(id) on delete cascade, user_id uuid references users(id) on delete cascade, body text not null check(char_length(body) between 1 and 1000), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists saved_posts (user_id uuid references users(id) on delete cascade, post_id uuid references posts(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,post_id));
create table if not exists blocks (blocker_id uuid references users(id) on delete cascade, blocked_id uuid references users(id) on delete cascade, created_at timestamptz not null default now(), primary key(blocker_id,blocked_id), check(blocker_id<>blocked_id));

create table if not exists stories (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id) on delete cascade,
  storage_path text not null, media_type text not null check(media_type in ('image','video')), caption text not null default '',
  created_at timestamptz not null default now(), expires_at timestamptz not null default (now()+interval '24 hours')
);
create table if not exists story_likes (user_id uuid references users(id) on delete cascade, story_id uuid references stories(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,story_id));
create table if not exists story_comments (id uuid primary key default gen_random_uuid(), story_id uuid references stories(id) on delete cascade, user_id uuid references users(id) on delete cascade, body text not null check(char_length(body) between 1 and 1000), created_at timestamptz not null default now());

create table if not exists conversations (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now());
create table if not exists conversation_members (conversation_id uuid references conversations(id) on delete cascade, user_id uuid references users(id) on delete cascade, joined_at timestamptz not null default now(), primary key(conversation_id,user_id));
create table if not exists messages (id uuid primary key default gen_random_uuid(), conversation_id uuid references conversations(id) on delete cascade, sender_id uuid references users(id) on delete cascade, body text not null check(char_length(body) between 1 and 5000), created_at timestamptz not null default now(), deleted_at timestamptz);

create table if not exists notifications (id uuid primary key default gen_random_uuid(), user_id uuid references users(id) on delete cascade, actor_id uuid references users(id) on delete set null, type text not null, post_id uuid references posts(id) on delete cascade, story_id uuid references stories(id) on delete cascade, message text, read_at timestamptz, created_at timestamptz not null default now());
create table if not exists reports (id uuid primary key default gen_random_uuid(), reporter_id uuid references users(id) on delete cascade, reported_user_id uuid references users(id) on delete set null, post_id uuid references posts(id) on delete set null, message_id uuid references messages(id) on delete set null, reason text not null, details text, status text not null default 'open', created_at timestamptz not null default now());
create table if not exists live_streams (id uuid primary key default gen_random_uuid(), host_user_id uuid references users(id) on delete cascade, title text not null default '', category text not null default 'general', status text not null default 'scheduled', started_at timestamptz, ended_at timestamptz, created_at timestamptz not null default now());
create table if not exists public_events (id uuid primary key default gen_random_uuid(), creator_id uuid references users(id) on delete cascade, title text not null, description text not null default '', area_name text not null default '', approximate_lat numeric(8,5), approximate_lng numeric(8,5), starts_at timestamptz, ends_at timestamptz, created_at timestamptz not null default now());

create index if not exists sessions_user_idx on sessions(user_id); create index if not exists sessions_expiry_idx on sessions(expires_at); create index if not exists posts_created_idx on posts(created_at desc); create index if not exists media_post_idx on media(post_id); create index if not exists comments_post_idx on comments(post_id,created_at desc); create index if not exists messages_conversation_idx on messages(conversation_id,created_at desc); create index if not exists notifications_user_idx on notifications(user_id,created_at desc); create index if not exists stories_active_idx on stories(expires_at,created_at desc);


-- Phase 5 production infrastructure
create table if not exists media_jobs (
  id uuid primary key default gen_random_uuid(), kind text not null, source_path text not null,
  output_path text, poster_path text, status text not null default 'queued',
  attempts integer not null default 0, error_message text, created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(), started_at timestamptz, finished_at timestamptz
);
create index if not exists media_jobs_status_idx on media_jobs(status,created_at);
create table if not exists moderation_queue (
  id uuid primary key default gen_random_uuid(), report_id uuid references reports(id) on delete cascade,
  status text not null default 'open', priority integer not null default 0, reviewer_id uuid references users(id) on delete set null,
  decision text, notes text, created_at timestamptz not null default now(), reviewed_at timestamptz
);
create index if not exists moderation_queue_status_idx on moderation_queue(status,priority desc,created_at);
create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(), admin_user_id uuid references users(id) on delete set null,
  action text not null, target_type text, target_id uuid, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index if not exists admin_audit_created_idx on admin_audit_log(created_at desc);
