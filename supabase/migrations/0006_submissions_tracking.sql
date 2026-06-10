-- Submission tracking: the user's own "My submissions" view reads this mirror
-- (RLS: read own) so it never needs a Sanity token client-side. Add the fields
-- the UI needs — the rejection reason (shown so the user can fix & resubmit)
-- plus the editable inputs (suggested category, note) to prefill the resubmit
-- modal. Sanity stays the canonical copy; these columns mirror it.

alter table public.submissions
  add column if not exists rejection_reason text,
  add column if not exists suggested_category text,
  add column if not exists note text,
  add column if not exists updated_at timestamptz not null default now();

-- The mirror is written only by the service role (submit API + notify webhook),
-- which bypasses RLS. Users may read their own rows (existing "read own"
-- policy) — no client write path is exposed.
