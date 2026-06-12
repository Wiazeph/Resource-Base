-- Performance hardening for RLS (clears Supabase advisor WARNs; behavior is
-- unchanged):
--   1) Wrap auth.uid() in a scalar subselect — `(select auth.uid())` — so it's
--      evaluated ONCE per query instead of once per row (auth_rls_initplan).
--   2) Collapse the two permissive SELECT policies on `profiles`
--      ("read own" + "public read") into a single policy, removing the
--      multiple-permissive-policies overhead. The combined predicate keeps the
--      exact same access: a row is readable if it opted in publicly
--      (username is not null) OR it's the caller's own row.

-- profiles — merge the two SELECT policies into one.
drop policy if exists "profiles: public read" on public.profiles;
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read public or own"
  on public.profiles for select
  using (username is not null or (select auth.uid()) = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using ((select auth.uid()) = id);

-- favorites
drop policy if exists "favorites: read own" on public.favorites;
create policy "favorites: read own"
  on public.favorites for select
  using ((select auth.uid()) = user_id);

drop policy if exists "favorites: insert own" on public.favorites;
create policy "favorites: insert own"
  on public.favorites for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "favorites: delete own" on public.favorites;
create policy "favorites: delete own"
  on public.favorites for delete
  using ((select auth.uid()) = user_id);

-- notifications
drop policy if exists "notifications: read own" on public.notifications;
create policy "notifications: read own"
  on public.notifications for select
  using ((select auth.uid()) = user_id);

drop policy if exists "notifications: update own" on public.notifications;
create policy "notifications: update own"
  on public.notifications for update
  using ((select auth.uid()) = user_id);

-- submissions
drop policy if exists "submissions: read own" on public.submissions;
create policy "submissions: read own"
  on public.submissions for select
  using ((select auth.uid()) = user_id);
