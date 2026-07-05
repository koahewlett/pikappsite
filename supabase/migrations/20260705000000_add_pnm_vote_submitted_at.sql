alter table public.pnm_votes
  add column if not exists submitted_at timestamptz;

update public.pnm_votes
set submitted_at = coalesce(submitted_at, updated_at, created_at, now())
where submitted_at is null;

create index if not exists pnm_votes_submitted_at_idx on public.pnm_votes(submitted_at);

alter view public.rush_leads set (security_invoker = true);
