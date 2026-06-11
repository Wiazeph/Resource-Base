-- Taxonomy suggestions can now also propose a corrected/improved description.
-- Mirror the proposed text plus a snapshot of the resource's description at
-- submit time, so "My submissions" and the suggestion view can show a diff
-- (old vs. proposed) the same way categories/tags already do.

alter table public.submissions
  add column if not exists proposed_description text,
  add column if not exists original_description text;
