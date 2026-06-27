drop policy if exists "Authenticated members can update rush_rsvps" on public.rush_rsvps;
drop policy if exists "Authenticated members can view rush_rsvps" on public.rush_rsvps;

drop policy if exists "Approved members can read rush votes" on public.rush_votes;

create policy "Approved members can read own rush votes"
on public.rush_votes
for select
to authenticated
using (
  app_private.is_approved_member((select auth.uid()))
  and voter_id = (select auth.uid())
);

create policy "Admins can read rush votes"
on public.rush_votes
for select
to authenticated
using (app_private.is_rush_admin((select auth.uid())));
