-- Public favorite counts — how many users have favorited each resource.
-- The favorites table is RLS-locked to "read own", so clients can't aggregate
-- it directly. This security-definer RPC returns the per-resource totals
-- (resource_id, count) for everyone, mirroring the public resource_clicks read.
-- It exposes only aggregate counts, never which user favorited what.

create or replace function public.favorite_counts()
returns table (resource_id text, count bigint)
language sql
stable
security definer set search_path = public
as $$
  select resource_id, count(*)::bigint as count
  from public.favorites
  group by resource_id;
$$;

grant execute on function public.favorite_counts() to anon, authenticated;
