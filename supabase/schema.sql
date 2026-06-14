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
create policy "Anyone can insert rush applications" on public.rush_applications for insert with check (true);
create policy "Authenticated members can view applications" on public.rush_applications for select using (auth.role() = 'authenticated');
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
create policy "Anyone can insert signups" on public.signups for insert with check (true);
create policy "Authenticated members can view signups" on public.signups for select using (auth.role() = 'authenticated');
create policy "Authenticated members can update signups" on public.signups for update using (auth.role() = 'authenticated');
