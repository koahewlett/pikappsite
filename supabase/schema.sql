create table if not exists public.rush_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  phone text,
  email text,
  major text,
  graduation_year text,
  hometown text,
  sports text,
  clubs text,
  leadership_positions text,
  instagram text,
  linkedin text,
  status text default 'new',
  tags text[] default '{}',
  internal_notes text
);
alter table public.rush_applications enable row level security;
-- Idempotent policy creation for rush_applications
drop policy if exists "Anyone can insert rush applications" on public.rush_applications;
create policy "Anyone can insert rush applications" on public.rush_applications for insert with check (true);
drop policy if exists "Authenticated members can view applications" on public.rush_applications;
create policy "Authenticated members can view applications" on public.rush_applications for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated members can update applications" on public.rush_applications;
create policy "Authenticated members can update applications" on public.rush_applications for update using (auth.role() = 'authenticated');

-- Public signups table to store application form submissions
create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  phone text,
  email text,
  major text,
  graduation_year text,
  hometown text,
  sports text,
  clubs text,
  leadership_positions text,
  instagram text,
  linkedin text,
  status text default 'new',
  tags text[] default '{}',
  internal_notes text
);
alter table public.signups enable row level security;
-- Idempotent policy creation for signups
drop policy if exists "Anyone can insert signups" on public.signups;
create policy "Anyone can insert signups" on public.signups for insert with check (true);
drop policy if exists "Authenticated members can view signups" on public.signups;
create policy "Authenticated members can view signups" on public.signups for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated members can update signups" on public.signups;
create policy "Authenticated members can update signups" on public.signups for update using (auth.role() = 'authenticated');

create table if not exists public.rush_rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text,
  email text,
  phone text,
  instagram text,
  message text,
  consent_to_contact boolean default false,
  normalized_email text,
  normalized_phone text,
  matched_rush_application_id uuid references public.rush_applications(id),
  has_full_application boolean default false
);
alter table public.rush_rsvps enable row level security;
-- Idempotent policy creation for rush_rsvps
drop policy if exists "Anyone can insert rush_rsvps" on public.rush_rsvps;
create policy "Anyone can insert rush_rsvps" on public.rush_rsvps for insert with check (true);
drop policy if exists "Authenticated members can view rush_rsvps" on public.rush_rsvps;
create policy "Authenticated members can view rush_rsvps" on public.rush_rsvps for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated members can update rush_rsvps" on public.rush_rsvps;
create policy "Authenticated members can update rush_rsvps" on public.rush_rsvps for update using (auth.role() = 'authenticated');

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
alter table public.pnm_votes enable row level security;
grant select, insert, update, delete on public.pnm_votes to authenticated;
drop policy if exists "Approved members can read pnm votes" on public.pnm_votes;
create policy "Approved members can read pnm votes" on public.pnm_votes for select to authenticated using (app_private.is_approved_member((select auth.uid())));
drop policy if exists "Approved members can create own pnm votes" on public.pnm_votes;
create policy "Approved members can create own pnm votes" on public.pnm_votes for insert to authenticated with check (app_private.is_approved_member((select auth.uid())) and member_id = (select auth.uid()));
drop policy if exists "Approved members can update own pnm votes" on public.pnm_votes;
create policy "Approved members can update own pnm votes" on public.pnm_votes for update to authenticated using (app_private.is_approved_member((select auth.uid())) and member_id = (select auth.uid())) with check (app_private.is_approved_member((select auth.uid())) and member_id = (select auth.uid()));
drop policy if exists "Admins can delete pnm votes" on public.pnm_votes;
create policy "Admins can delete pnm votes" on public.pnm_votes for delete to authenticated using (app_private.is_rush_admin((select auth.uid())));
drop policy if exists "Approved members can read approved member profiles" on public.member_profiles;
create policy "Approved members can read approved member profiles" on public.member_profiles for select to authenticated using (app_private.is_approved_member((select auth.uid())) and status in ('approved', 'admin'));

create table if not exists public.pnm_ratings (
  id uuid primary key default gen_random_uuid(),
  pnm_id uuid not null references public.rush_applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pnm_id, user_id)
);
create index if not exists pnm_ratings_pnm_id_idx on public.pnm_ratings(pnm_id);
create index if not exists pnm_ratings_user_id_idx on public.pnm_ratings(user_id);
create index if not exists pnm_ratings_rating_idx on public.pnm_ratings(rating);
drop trigger if exists pnm_ratings_set_updated_at on public.pnm_ratings;
create trigger pnm_ratings_set_updated_at before update on public.pnm_ratings for each row execute function app_private.set_updated_at();
alter table public.pnm_ratings enable row level security;
grant select, insert, update, delete on public.pnm_ratings to authenticated;
drop policy if exists "Approved members can read pnm ratings" on public.pnm_ratings;
create policy "Approved members can read pnm ratings" on public.pnm_ratings for select to authenticated using (app_private.is_approved_member((select auth.uid())));
drop policy if exists "Approved members can create own pnm ratings" on public.pnm_ratings;
create policy "Approved members can create own pnm ratings" on public.pnm_ratings for insert to authenticated with check (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));
drop policy if exists "Approved members can update own pnm ratings" on public.pnm_ratings;
create policy "Approved members can update own pnm ratings" on public.pnm_ratings for update to authenticated using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid())) with check (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));
drop policy if exists "Approved members can delete own pnm ratings" on public.pnm_ratings;
create policy "Approved members can delete own pnm ratings" on public.pnm_ratings for delete to authenticated using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));

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
alter table public.pnm_favorites enable row level security;
grant select, insert, delete on public.pnm_favorites to authenticated;
drop policy if exists "Approved members can read own pnm favorites" on public.pnm_favorites;
create policy "Approved members can read own pnm favorites" on public.pnm_favorites for select to authenticated using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));
drop policy if exists "Approved members can create own pnm favorites" on public.pnm_favorites;
create policy "Approved members can create own pnm favorites" on public.pnm_favorites for insert to authenticated with check (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));
drop policy if exists "Approved members can delete own pnm favorites" on public.pnm_favorites;
create policy "Approved members can delete own pnm favorites" on public.pnm_favorites for delete to authenticated using (app_private.is_approved_member((select auth.uid())) and user_id = (select auth.uid()));
