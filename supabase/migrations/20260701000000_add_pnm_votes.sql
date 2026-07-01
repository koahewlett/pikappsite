create table if not exists public.pnm_votes (
  id uuid primary key default gen_random_uuid(),
  pnm_id uuid not null references public.rush_applications(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  member_email text,
  vote_status text not null check (vote_status in ('interested', 'neutral', 'not_interested', 'need_more_info')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pnm_id, member_id)
);

create index if not exists pnm_votes_pnm_id_idx on public.pnm_votes(pnm_id);
create index if not exists pnm_votes_member_id_idx on public.pnm_votes(member_id);
create index if not exists pnm_votes_vote_status_idx on public.pnm_votes(vote_status);

drop trigger if exists pnm_votes_set_updated_at on public.pnm_votes;
create trigger pnm_votes_set_updated_at
before update on public.pnm_votes
for each row execute function app_private.set_updated_at();

grant select, insert, update, delete on public.pnm_votes to authenticated;

alter table public.pnm_votes enable row level security;

drop policy if exists "Approved members can read pnm votes" on public.pnm_votes;
drop policy if exists "Approved members can create own pnm votes" on public.pnm_votes;
drop policy if exists "Approved members can update own pnm votes" on public.pnm_votes;
drop policy if exists "Admins can delete pnm votes" on public.pnm_votes;

create policy "Approved members can read pnm votes"
on public.pnm_votes
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())));

create policy "Approved members can create own pnm votes"
on public.pnm_votes
for insert
to authenticated
with check (app_private.is_approved_member((select auth.uid())) and member_id = (select auth.uid()));

create policy "Approved members can update own pnm votes"
on public.pnm_votes
for update
to authenticated
using (app_private.is_approved_member((select auth.uid())) and member_id = (select auth.uid()))
with check (app_private.is_approved_member((select auth.uid())) and member_id = (select auth.uid()));

create policy "Admins can delete pnm votes"
on public.pnm_votes
for delete
to authenticated
using (app_private.is_rush_admin((select auth.uid())));

drop policy if exists "Approved members can read approved member profiles" on public.member_profiles;

create policy "Approved members can read approved member profiles"
on public.member_profiles
for select
to authenticated
using (
  app_private.is_approved_member((select auth.uid()))
  and status in ('approved', 'admin')
);
