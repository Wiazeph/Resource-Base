-- Resource Base — user data schema.
-- Resources/categories/tags live in Sanity; this holds user-tied data only.
-- Rows that reference a resource store the Sanity `_id` as text (no FK).

-- ---------------------------------------------------------------------------
-- profiles — mirror of auth.users, auto-created on signup
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-insert a profile whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- favorites — a user's saved resources (Sanity resource _id as text)
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  resource_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

alter table public.favorites enable row level security;

create policy "favorites: read own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites: insert own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites: delete own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- notifications — in-app notifications (e.g. submission approved)
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text,
  body text,
  resource_id text,
  url text,
  -- dedupe key so webhook retries don't create duplicate notifications
  source_key text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);
create unique index if not exists notifications_source_key_idx
  on public.notifications (source_key) where source_key is not null;

alter table public.notifications enable row level security;

-- Users read and update (mark read) their own notifications. Inserts only via
-- service role (which bypasses RLS) — no insert policy exposed to clients.
create policy "notifications: read own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications: update own"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- resource_clicks — one running counter per resource
-- ---------------------------------------------------------------------------
create table if not exists public.resource_clicks (
  resource_id text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.resource_clicks enable row level security;

-- Counts are public (shown on every card). No client write policy — writes go
-- through the increment_click RPC below.
create policy "resource_clicks: public read"
  on public.resource_clicks for select
  using (true);

-- Atomic increment, callable by anon + authenticated. security definer lets it
-- write past the table's write-RLS while being the only allowed write path.
create or replace function public.increment_click(rid text)
returns void
language sql
security definer set search_path = public
as $$
  insert into public.resource_clicks (resource_id, count)
  values (rid, 1)
  on conflict (resource_id)
  do update set count = public.resource_clicks.count + 1, updated_at = now();
$$;

grant execute on function public.increment_click(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- submissions — Supabase mirror of Sanity submissions, tied to the user so
-- approval notifications can find their target. Canonical copy stays in Sanity.
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  sanity_submission_id text,
  name text,
  url text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists submissions_user_idx on public.submissions (user_id);
create index if not exists submissions_sanity_idx
  on public.submissions (sanity_submission_id);

alter table public.submissions enable row level security;

-- Users see their own submissions. Inserts/updates only via service role.
create policy "submissions: read own"
  on public.submissions for select
  using (auth.uid() = user_id);
