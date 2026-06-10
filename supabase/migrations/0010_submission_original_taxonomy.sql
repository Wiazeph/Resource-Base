-- For taxonomy fixes, capture the resource's categories/tags AT SUBMIT TIME so
-- the suggestion view can highlight what the user actually added vs. what was
-- already there — both in the resource modal and the user's profile.

alter table public.submissions
  add column if not exists original_categories text[] not null default '{}',
  add column if not exists original_tags text[] not null default '{}';
