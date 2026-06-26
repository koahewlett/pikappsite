create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'admin', 'denied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

create index if not exists member_profiles_status_idx on public.member_profiles(status);
create index if not exists member_profiles_email_idx on public.member_profiles(lower(email));

create table if not exists public.rush_votes (
  id uuid primary key default gen_random_uuid(),
  prospect_key text not null,
  source_application_id uuid references public.rush_applications(id) on delete set null,
  source_rsvp_id uuid references public.rush_rsvps(id) on delete set null,
  voter_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  vote text not null check (vote in ('yes', 'maybe', 'no')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (prospect_key, voter_id)
);

create index if not exists rush_votes_prospect_key_idx on public.rush_votes(prospect_key);
create index if not exists rush_votes_voter_id_idx on public.rush_votes(voter_id);

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists member_profiles_set_updated_at on public.member_profiles;
create trigger member_profiles_set_updated_at
before update on public.member_profiles
for each row execute function app_private.set_updated_at();

drop trigger if exists rush_votes_set_updated_at on public.rush_votes;
create trigger rush_votes_set_updated_at
before update on public.rush_votes
for each row execute function app_private.set_updated_at();

create or replace function app_private.handle_new_member_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_profiles (user_id, email, display_name, status)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'display_name', ''), 'pending')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_member_profile on auth.users;
create trigger on_auth_user_created_member_profile
after insert on auth.users
for each row execute function app_private.handle_new_member_profile();

insert into public.member_profiles (user_id, email, display_name, status)
select id, email, nullif(raw_user_meta_data ->> 'display_name', ''), 'pending'
from auth.users
on conflict (user_id) do nothing;

create or replace function app_private.is_approved_member(member_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select member_id = (select auth.uid())
    and exists (
      select 1
      from public.member_profiles profile
      where profile.user_id = member_id
        and profile.status in ('approved', 'admin')
    );
$$;

create or replace function app_private.is_rush_admin(member_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select member_id = (select auth.uid())
    and exists (
      select 1
      from public.member_profiles profile
      where profile.user_id = member_id
        and profile.status = 'admin'
    );
$$;

revoke all on function app_private.is_approved_member(uuid) from public;
revoke all on function app_private.is_rush_admin(uuid) from public;
grant execute on function app_private.is_approved_member(uuid) to authenticated;
grant execute on function app_private.is_rush_admin(uuid) to authenticated;

grant select, insert, update on public.member_profiles to authenticated;
grant select, insert, update, delete on public.rush_votes to authenticated;

alter table public.member_profiles enable row level security;
alter table public.rush_votes enable row level security;

drop policy if exists "Members can read own profile" on public.member_profiles;
drop policy if exists "Admins can read member profiles" on public.member_profiles;
drop policy if exists "Members can create own pending profile" on public.member_profiles;
drop policy if exists "Admins can update member profiles" on public.member_profiles;

create policy "Members can read own profile"
on public.member_profiles
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Admins can read member profiles"
on public.member_profiles
for select
to authenticated
using (app_private.is_rush_admin((select auth.uid())));

create policy "Members can create own pending profile"
on public.member_profiles
for insert
to authenticated
with check (user_id = (select auth.uid()) and status = 'pending');

create policy "Admins can update member profiles"
on public.member_profiles
for update
to authenticated
using (app_private.is_rush_admin((select auth.uid())) and user_id <> (select auth.uid()))
with check (app_private.is_rush_admin((select auth.uid())) and user_id <> (select auth.uid()));

drop policy if exists "Approved members can read rush votes" on public.rush_votes;
drop policy if exists "Approved members can create own rush votes" on public.rush_votes;
drop policy if exists "Approved members can update own rush votes" on public.rush_votes;
drop policy if exists "Admins can update rush votes" on public.rush_votes;
drop policy if exists "Admins can delete rush votes" on public.rush_votes;

create policy "Approved members can read rush votes"
on public.rush_votes
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())));

create policy "Approved members can create own rush votes"
on public.rush_votes
for insert
to authenticated
with check (app_private.is_approved_member((select auth.uid())) and voter_id = (select auth.uid()));

create policy "Approved members can update own rush votes"
on public.rush_votes
for update
to authenticated
using (app_private.is_approved_member((select auth.uid())) and voter_id = (select auth.uid()))
with check (app_private.is_approved_member((select auth.uid())) and voter_id = (select auth.uid()));

create policy "Admins can update rush votes"
on public.rush_votes
for update
to authenticated
using (app_private.is_rush_admin((select auth.uid())))
with check (app_private.is_rush_admin((select auth.uid())));

create policy "Admins can delete rush votes"
on public.rush_votes
for delete
to authenticated
using (app_private.is_rush_admin((select auth.uid())));

drop policy if exists "Authenticated members can view applications" on public.rush_applications;
drop policy if exists "Authenticated members can update applications" on public.rush_applications;
drop policy if exists "Approved members can view applications" on public.rush_applications;
drop policy if exists "Admins can update applications" on public.rush_applications;

create policy "Approved members can view applications"
on public.rush_applications
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())));

create policy "Admins can update applications"
on public.rush_applications
for update
to authenticated
using (app_private.is_rush_admin((select auth.uid())))
with check (app_private.is_rush_admin((select auth.uid())));

drop policy if exists "Authenticated members can view rush_rsvps" on public.rush_rsvps;
drop policy if exists "Authenticated members can update rush_rsvps" on public.rush_rsvps;
drop policy if exists "Approved members can view rush_rsvps" on public.rush_rsvps;
drop policy if exists "Admins can update rush_rsvps" on public.rush_rsvps;

create policy "Approved members can view rush_rsvps"
on public.rush_rsvps
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())));

create policy "Admins can update rush_rsvps"
on public.rush_rsvps
for update
to authenticated
using (app_private.is_rush_admin((select auth.uid())))
with check (app_private.is_rush_admin((select auth.uid())));

drop policy if exists "Authenticated members can view signups" on public.signups;
drop policy if exists "Authenticated members can update signups" on public.signups;
drop policy if exists "Approved members can view signups" on public.signups;
drop policy if exists "Admins can update signups" on public.signups;

create policy "Approved members can view signups"
on public.signups
for select
to authenticated
using (app_private.is_approved_member((select auth.uid())));

create policy "Admins can update signups"
on public.signups
for update
to authenticated
using (app_private.is_rush_admin((select auth.uid())))
with check (app_private.is_rush_admin((select auth.uid())));
