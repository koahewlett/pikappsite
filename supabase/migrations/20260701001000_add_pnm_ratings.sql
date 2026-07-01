create table if not exists public.pnm_ratings (
  id uuid primary key default gen_random_uuid(),
  pnm_id uuid not null references public.rush_applications(id) on delete cascade,
  admin_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pnm_id, admin_id)
);

create index if not exists pnm_ratings_pnm_id_idx on public.pnm_ratings(pnm_id);
create index if not exists pnm_ratings_admin_id_idx on public.pnm_ratings(admin_id);
create index if not exists pnm_ratings_rating_idx on public.pnm_ratings(rating);

drop trigger if exists pnm_ratings_set_updated_at on public.pnm_ratings;
create trigger pnm_ratings_set_updated_at
before update on public.pnm_ratings
for each row execute function app_private.set_updated_at();

grant select, insert, update, delete on public.pnm_ratings to authenticated;

alter table public.pnm_ratings enable row level security;

drop policy if exists "Approved members can read pnm ratings" on public.pnm_ratings;
drop policy if exists "Admins can create own pnm ratings" on public.pnm_ratings;
drop policy if exists "Admins can update own pnm ratings" on public.pnm_ratings;
drop policy if exists "Admins can delete pnm ratings" on public.pnm_ratings;

create policy "Approved members can read pnm ratings"
on public.pnm_ratings
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())));

create policy "Admins can create own pnm ratings"
on public.pnm_ratings
for insert
to authenticated
with check (app_private.is_rush_admin((select auth.uid())) and admin_id = (select auth.uid()));

create policy "Admins can update own pnm ratings"
on public.pnm_ratings
for update
to authenticated
using (app_private.is_rush_admin((select auth.uid())) and admin_id = (select auth.uid()))
with check (app_private.is_rush_admin((select auth.uid())) and admin_id = (select auth.uid()));

create policy "Admins can delete pnm ratings"
on public.pnm_ratings
for delete
to authenticated
using (app_private.is_rush_admin((select auth.uid())));
