-- Submissions can now be a "URL fix" for an existing broken resource, not just
-- a brand-new resource. Mirror the kind + target so the user's "My submissions"
-- view can label it, and the notify webhook can act on approval.

alter table public.submissions
  add column if not exists kind text not null default 'new',
  add column if not exists target_resource_id text;
