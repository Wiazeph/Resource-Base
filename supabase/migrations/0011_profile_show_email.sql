-- Opt-in public email. Users can choose to show their email on their public
-- profile. The email column stays locked (no anon/authenticated SELECT grant);
-- the only public path is the narrow security-definer function below, which
-- returns the email ONLY when the owner opted in. This keeps the column private
-- by default and avoids reverting public_profiles to a definer view.

alter table public.profiles
  add column if not exists show_email boolean not null default false;

-- show_email is a safe, non-sensitive flag — expose it like the other public
-- columns so the invoker view / clients can read it.
grant select (show_email) on public.profiles to anon, authenticated;

-- Surface show_email on the public view (email itself stays out of the view).
create or replace view public.public_profiles
with (security_invoker = on)
as
select
  id, username, full_name, avatar_url, bio,
  portfolio_url, github_url, twitter_url, instagram_url, dribbble_url,
  show_email
from public.profiles
where username is not null;

grant select on public.public_profiles to anon, authenticated;

-- Returns a user's email ONLY if they opted to show it. Security definer so it
-- can read the locked email column, but it never leaks an opted-out address.
create or replace function public.public_email(uid uuid)
returns text
language sql
stable
security definer set search_path = public
as $$
  select email from public.profiles
  where id = uid and show_email = true and username is not null;
$$;

grant execute on function public.public_email(uuid) to anon, authenticated;
