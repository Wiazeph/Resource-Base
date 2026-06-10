-- Submitters can now optionally suggest pricing and tags. Mirror them so the
-- "My submissions" detail modal can show what was sent and prefill the edit
-- form, without a Sanity round-trip. Sanity stays canonical.

alter table public.submissions
  add column if not exists pricing text,
  add column if not exists tags text[] not null default '{}';
