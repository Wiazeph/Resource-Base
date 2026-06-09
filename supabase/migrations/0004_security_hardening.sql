-- Security hardening — close gaps surfaced by `supabase db advisors`.
-- Functions default to EXECUTE for PUBLIC, which PostgREST then exposes as
-- callable RPCs. Internal/trigger helpers should not be reachable over the API.

-- ---------------------------------------------------------------------------
-- handle_new_user — trigger only. Triggers fire as the table owner regardless
-- of EXECUTE grants, so revoking API access changes nothing for signup, it
-- just removes the /rpc/handle_new_user surface.
-- ---------------------------------------------------------------------------
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- generate_username / username_stem — internal helpers, only ever called by
-- handle_new_user (which runs security definer). No client should call them.
-- ---------------------------------------------------------------------------
revoke execute on function public.generate_username(text) from public, anon, authenticated;
revoke execute on function public.username_stem(text) from public, anon, authenticated;

-- Pin search_path on the one helper that was missing it (advisor WARN).
alter function public.username_stem(text) set search_path = public;

-- ---------------------------------------------------------------------------
-- set_username — user-facing, but only meaningful for signed-in users (it
-- checks auth.uid()). Strip the implicit PUBLIC/anon grant; keep authenticated.
-- ---------------------------------------------------------------------------
revoke execute on function public.set_username(text) from public, anon;
grant execute on function public.set_username(text) to authenticated;

-- Note: increment_click and favorite_counts stay anon-executable by design
-- (public click/favorite tallies shown on every card).
-- The public_profiles SECURITY DEFINER view is intentional (see 0002) — it is
-- the only safe surface for profile data and must bypass the profiles RLS.
