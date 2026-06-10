-- Close the Security Definer view warning on public_profiles AND the deeper
-- leak it was masking: the profiles table had table-wide column SELECT granted
-- to anon/authenticated (including `email`), so the only thing keeping email
-- private was row-level RLS + the definer view's column projection.
--
-- New model:
--   * public_profiles runs as security_invoker (respects the caller's RLS) —
--     this clears the linter ERROR.
--   * profiles gets a public read policy scoped to rows that opted in
--     (username IS NOT NULL), so the invoker view can read those rows.
--   * email + other private columns are REVOKEd from anon AND authenticated,
--     so no role can ever SELECT another user's email. Each user's own email
--     now comes from their auth session (auth.users), not this table.

-- 1) View respects caller RLS instead of bypassing it.
alter view public.public_profiles set (security_invoker = on);

-- 2) Public can read opted-in profile rows (those with a username). RLS is
--    row-level; column exposure is bound separately by the grants below.
drop policy if exists "profiles: public read" on public.profiles;
create policy "profiles: public read"
  on public.profiles for select
  using (username is not null);

-- 3) Column-level lockdown. Strip the broad inherited grants, then re-grant
--    SELECT only on the columns that are safe to expose publicly. `email`,
--    `display_name` and `created_at` are intentionally excluded.
revoke select on public.profiles from anon, authenticated;

grant select (
  id, username, full_name, avatar_url, bio,
  portfolio_url, github_url, twitter_url, instagram_url, dribbble_url
) on public.profiles to anon, authenticated;
