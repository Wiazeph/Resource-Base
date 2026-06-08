-- Resource Base — user profiles: username, bio, social links, public view.

-- ---------------------------------------------------------------------------
-- profiles: new columns
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists username text,
  add column if not exists full_name text,
  add column if not exists bio text,
  add column if not exists portfolio_url text,
  add column if not exists github_url text,
  add column if not exists twitter_url text,
  add column if not exists instagram_url text,
  add column if not exists dribbble_url text;

-- Case-insensitive unique username.
create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

-- Backfill full_name from the existing display_name where missing.
update public.profiles
set full_name = display_name
where full_name is null and display_name is not null;

-- ---------------------------------------------------------------------------
-- helpers: slug + unique username generation
-- ---------------------------------------------------------------------------

-- Turn a display name into a short, safe username stem (a-z0-9, max 12 chars).
create or replace function public.username_stem(raw text)
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(
      substring(
        regexp_replace(lower(coalesce(raw, '')), '[^a-z0-9]', '', 'g')
        from 1 for 12
      ),
      ''
    ),
    'user'
  );
$$;

-- Generate a unique username like "emreerden-3f2a9".
create or replace function public.generate_username(raw text)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  stem text := public.username_stem(raw);
  candidate text;
  tries int := 0;
begin
  loop
    candidate := stem || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 5);
    exit when not exists (
      select 1 from public.profiles where lower(username) = lower(candidate)
    );
    tries := tries + 1;
    if tries > 10 then
      candidate := stem || '-' || substr(md5(random()::text), 1, 8);
      exit;
    end if;
  end loop;
  return candidate;
end;
$$;

-- ---------------------------------------------------------------------------
-- handle_new_user: capture username/full_name on signup; auto-generate for OAuth
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := new.raw_user_meta_data;
  uname text := nullif(meta ->> 'username', '');
  fname text := coalesce(
    nullif(meta ->> 'full_name', ''),
    nullif(meta ->> 'name', '')
  );
begin
  -- No username provided (OAuth, or email signup without one) → auto-generate
  -- from the name or email local-part.
  if uname is null then
    uname := public.generate_username(
      coalesce(fname, split_part(new.email, '@', 1))
    );
  end if;

  insert into public.profiles (id, email, display_name, full_name, username, avatar_url)
  values (
    new.id,
    new.email,
    fname,
    fname,
    uname,
    meta ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- set_username: safe, validated, unique username update for the current user
-- ---------------------------------------------------------------------------
create or replace function public.set_username(new_username text)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  cleaned text := lower(trim(new_username));
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if cleaned !~ '^[a-z0-9_-]{3,20}$' then
    raise exception 'invalid_username'
      using hint = 'Use 3-20 characters: a-z, 0-9, hyphen, underscore.';
  end if;

  if exists (
    select 1 from public.profiles
    where lower(username) = cleaned and id <> uid
  ) then
    raise exception 'username_taken';
  end if;

  update public.profiles set username = cleaned where id = uid;
  return cleaned;
end;
$$;

grant execute on function public.set_username(text) to authenticated;

-- ---------------------------------------------------------------------------
-- public_profiles view — the ONLY public surface for profile data.
-- security_invoker = false (definer): the view runs as its owner and bypasses
-- the profiles table RLS, so it can read rows while exposing only the safe
-- columns below. The profiles table itself stays own-only-read (email never
-- leaks). Anyone can read this view.
-- ---------------------------------------------------------------------------
create or replace view public.public_profiles
with (security_invoker = false)
as
select
  id,
  username,
  full_name,
  avatar_url,
  bio,
  portfolio_url,
  github_url,
  twitter_url,
  instagram_url,
  dribbble_url
from public.profiles
where username is not null;

grant select on public.public_profiles to anon, authenticated;
