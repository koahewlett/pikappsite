drop policy if exists "Admins can create own pnm ratings" on public.pnm_ratings;
drop policy if exists "Admins can update own pnm ratings" on public.pnm_ratings;
drop policy if exists "Admins can delete pnm ratings" on public.pnm_ratings;
drop policy if exists "Approved members can create own pnm ratings" on public.pnm_ratings;
drop policy if exists "Approved members can update own pnm ratings" on public.pnm_ratings;
drop policy if exists "Approved members can delete own pnm ratings" on public.pnm_ratings;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pnm_ratings'
      and column_name = 'admin_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pnm_ratings'
      and column_name = 'user_id'
  ) then
    alter table public.pnm_ratings rename column admin_id to user_id;
  end if;
end $$;

alter table public.pnm_ratings
  alter column user_id set default auth.uid(),
  alter column user_id set not null;

alter table public.pnm_ratings drop constraint if exists pnm_ratings_admin_id_fkey;
alter table public.pnm_ratings drop constraint if exists pnm_ratings_pnm_id_admin_id_key;
alter table public.pnm_ratings drop constraint if exists pnm_ratings_pnm_id_user_id_key;
alter table public.pnm_ratings
  add constraint pnm_ratings_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade,
  add constraint pnm_ratings_pnm_id_user_id_key unique (pnm_id, user_id);

drop index if exists pnm_ratings_admin_id_idx;
create index if not exists pnm_ratings_user_id_idx on public.pnm_ratings(user_id);

create policy "Approved members can create own pnm ratings"
on public.pnm_ratings
for insert
to authenticated
with check (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));

create policy "Approved members can update own pnm ratings"
on public.pnm_ratings
for update
to authenticated
using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()))
with check (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));

create policy "Approved members can delete own pnm ratings"
on public.pnm_ratings
for delete
to authenticated
using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));

create table if not exists public.pnm_favorites (
  id uuid primary key default gen_random_uuid(),
  pnm_id uuid not null references public.rush_applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  unique (pnm_id, user_id)
);

create index if not exists pnm_favorites_pnm_id_idx on public.pnm_favorites(pnm_id);
create index if not exists pnm_favorites_user_id_idx on public.pnm_favorites(user_id);
create index if not exists pnm_favorites_created_at_idx on public.pnm_favorites(created_at desc);

grant select, insert, delete on public.pnm_favorites to authenticated;

alter table public.pnm_favorites enable row level security;

drop policy if exists "Approved members can read own pnm favorites" on public.pnm_favorites;
drop policy if exists "Approved members can create own pnm favorites" on public.pnm_favorites;
drop policy if exists "Approved members can delete own pnm favorites" on public.pnm_favorites;

create policy "Approved members can read own pnm favorites"
on public.pnm_favorites
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));

create policy "Approved members can create own pnm favorites"
on public.pnm_favorites
for insert
to authenticated
with check (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));

create policy "Approved members can delete own pnm favorites"
on public.pnm_favorites
for delete
to authenticated
using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));
