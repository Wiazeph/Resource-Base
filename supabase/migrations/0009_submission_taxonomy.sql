-- Taxonomy fixes: a user can propose corrected categories/tags for a resource
-- (kind = 'taxonomy', reusing target_resource_id). Mirror the proposed values
-- so the user's "My submissions" view can show them. Each entry is either an
-- existing slug or a free-text title the editor maps on approval.

alter table public.submissions
  add column if not exists proposed_categories text[] not null default '{}',
  add column if not exists proposed_tags text[] not null default '{}';
