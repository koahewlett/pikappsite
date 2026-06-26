'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type MemberStatus = 'pending' | 'approved' | 'admin' | 'denied';
type GateState = 'loading' | 'signed-out' | 'pending' | 'denied' | 'approved';
type VoteValue = 'yes' | 'maybe' | 'no';

type MemberProfile = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  status: MemberStatus;
  created_at: string | null;
  approved_at: string | null;
};

type RushApplication = {
  id: string;
  created_at: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  major: string | null;
  graduation_year: string | null;
  hometown: string | null;
  sports: string | null;
  clubs: string | null;
  leadership_positions: string | null;
  instagram: string | null;
  linkedin: string | null;
  normalized_email: string | null;
  normalized_phone: string | null;
};

type RushRsvp = {
  id: string;
  created_at: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  message: string | null;
  normalized_email: string | null;
  normalized_phone: string | null;
  matched_rush_application_id: string | null;
  has_full_application: boolean | null;
};

type RushVote = {
  id: string;
  prospect_key: string;
  source_application_id: string | null;
  source_rsvp_id: string | null;
  voter_id: string;
  vote: VoteValue;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Prospect = {
  key: string;
  application: RushApplication | null;
  rsvp: RushRsvp | null;
};

const approvedStatuses = new Set<MemberStatus>(['approved', 'admin']);

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || '';
}

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, '') || '';
}

function applicationKey(application: RushApplication) {
  const email = normalizeEmail(application.normalized_email || application.email);
  const phone = normalizePhone(application.normalized_phone || application.phone);

  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;
  return `application:${application.id}`;
}

function rsvpKey(rsvp: RushRsvp) {
  const email = normalizeEmail(rsvp.normalized_email || rsvp.email);
  const phone = normalizePhone(rsvp.normalized_phone || rsvp.phone);

  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;
  return `rsvp:${rsvp.id}`;
}

function mergeProspects(applications: RushApplication[], rsvps: RushRsvp[]) {
  const prospects = new Map<string, Prospect>();
  const applicationIds = new Map<string, string>();

  applications.forEach((application) => {
    const key = applicationKey(application);
    prospects.set(key, { key, application, rsvp: null });
    applicationIds.set(application.id, key);
  });

  rsvps.forEach((rsvp) => {
    const key = rsvp.matched_rush_application_id && applicationIds.has(rsvp.matched_rush_application_id)
      ? applicationIds.get(rsvp.matched_rush_application_id)!
      : rsvpKey(rsvp);

    const existing = prospects.get(key);
    prospects.set(key, {
      key,
      application: existing?.application ?? null,
      rsvp,
    });
  });

  return Array.from(prospects.values()).sort((a, b) => {
    const aDate = a.application?.created_at || a.rsvp?.created_at || '';
    const bDate = b.application?.created_at || b.rsvp?.created_at || '';
    return bDate.localeCompare(aDate);
  });
}

function prospectName(prospect: Prospect) {
  const applicationName = [prospect.application?.first_name, prospect.application?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  return applicationName || prospect.rsvp?.full_name || 'Unnamed potential member';
}

function prospectSource(prospect: Prospect) {
  if (prospect.application && prospect.rsvp) return 'Both';
  if (prospect.application) return 'Rush form only';
  return 'RSVP only';
}

function voteTotals(votes: RushVote[], prospectKey: string) {
  return votes
    .filter((vote) => vote.prospect_key === prospectKey)
    .reduce<Record<VoteValue, number>>(
      (totals, vote) => ({ ...totals, [vote.vote]: totals[vote.vote] + 1 }),
      { yes: 0, maybe: 0, no: 0 }
    );
}

export function MemberDashboard() {
  const [gate, setGate] = useState<GateState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [votes, setVotes] = useState<RushVote[]>([]);
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const isAdmin = profile?.status === 'admin';

  const loadDashboard = useCallback(async () => {
    setGate('loading');
    setMessage('');

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user = userData.user;
      if (!user) {
        setGate('signed-out');
        return;
      }

      setUserId(user.id);

      const { data: memberProfile, error: profileError } = await supabase
        .from('member_profiles')
        .select('user_id,email,display_name,status,created_at,approved_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      let currentProfile = memberProfile as MemberProfile | null;

      if (!currentProfile) {
        const { data: insertedProfile, error: insertError } = await supabase
          .from('member_profiles')
          .insert({ user_id: user.id, email: user.email, status: 'pending' })
          .select('user_id,email,display_name,status,created_at,approved_at')
          .single();

        if (insertError) throw insertError;
        currentProfile = insertedProfile as MemberProfile;
      }

      setProfile(currentProfile);

      if (currentProfile.status === 'denied') {
        setGate('denied');
        return;
      }

      if (!approvedStatuses.has(currentProfile.status)) {
        setGate('pending');
        return;
      }

      const [applicationsResult, rsvpsResult, votesResult] = await Promise.all([
        supabase.from('rush_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('rush_rsvps').select('*').order('created_at', { ascending: false }),
        supabase.from('rush_votes').select('*').order('updated_at', { ascending: false }),
      ]);

      if (applicationsResult.error) throw applicationsResult.error;
      if (rsvpsResult.error) throw rsvpsResult.error;
      if (votesResult.error) throw votesResult.error;

      const loadedVotes = (votesResult.data || []) as RushVote[];
      setProspects(mergeProspects((applicationsResult.data || []) as RushApplication[], (rsvpsResult.data || []) as RushRsvp[]));
      setVotes(loadedVotes);
      setNoteDrafts(
        loadedVotes
          .filter((vote) => vote.voter_id === user.id)
          .reduce<Record<string, string>>((drafts, vote) => ({ ...drafts, [vote.prospect_key]: vote.note || '' }), {})
      );

      if (currentProfile.status === 'admin') {
        const { data: memberProfiles, error: profilesError } = await supabase
          .from('member_profiles')
          .select('user_id,email,display_name,status,created_at,approved_at')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;
        setProfiles((memberProfiles || []) as MemberProfile[]);
      }

      setGate('approved');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load the member dashboard.');
      setGate('signed-out');
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const myVotes = useMemo(() => {
    return votes.reduce<Record<string, RushVote>>((map, vote) => {
      if (vote.voter_id === userId) map[vote.prospect_key] = vote;
      return map;
    }, {});
  }, [userId, votes]);

  async function saveVote(prospect: Prospect, vote: VoteValue) {
    if (!userId) return;

    setSavingKey(prospect.key);
    setMessage('');

    try {
      const payload = {
        prospect_key: prospect.key,
        source_application_id: prospect.application?.id ?? null,
        source_rsvp_id: prospect.rsvp?.id ?? null,
        voter_id: userId,
        vote,
        note: noteDrafts[prospect.key]?.trim() || null,
      };

      const { data, error } = await supabase
        .from('rush_votes')
        .upsert(payload, { onConflict: 'prospect_key,voter_id' })
        .select('*')
        .single();

      if (error) throw error;

      setVotes((current) => [
        data as RushVote,
        ...current.filter((existing) => existing.id !== data.id),
      ]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save vote.');
    } finally {
      setSavingKey(null);
    }
  }

  async function updateMemberStatus(member: MemberProfile, status: MemberStatus) {
    if (!userId || member.user_id === userId) return;

    setMessage('');

    const { error } = await supabase
      .from('member_profiles')
      .update({
        status,
        approved_at: status === 'approved' || status === 'admin' ? new Date().toISOString() : null,
        approved_by: status === 'approved' || status === 'admin' ? userId : null,
      })
      .eq('user_id', member.user_id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadDashboard();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (gate === 'loading') {
    return <div className="member-panel mx-auto max-w-3xl p-8 text-white/65">Loading member access...</div>;
  }

  if (gate === 'signed-out') {
    return (
      <div className="member-panel mx-auto max-w-3xl p-8">
        <p className="section-kicker">Members</p>
        <h1 className="mt-2 text-4xl font-black">Log in required</h1>
        <p className="mt-4 text-white/60">Use the members page to sign in or request access before viewing the dashboard.</p>
        <a href="/login" className="premium-button premium-button-primary mt-6 inline-flex">Go to login</a>
        {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
      </div>
    );
  }

  if (gate === 'pending' || gate === 'denied') {
    return (
      <div className="member-panel mx-auto max-w-3xl p-8">
        <p className="section-kicker">Member Status</p>
        <h1 className="mt-2 text-4xl font-black">{gate === 'pending' ? 'Pending approval' : 'Access denied'}</h1>
        <p className="mt-4 text-white/60">
          {gate === 'pending'
            ? 'Your account exists, but a rush admin needs to approve your access before you can view rush submissions or vote.'
            : 'This account request was denied. Contact a rush admin if this seems wrong.'}
        </p>
        <button type="button" onClick={logout} className="premium-button premium-button-secondary mt-6">Log out</button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Rush Committee</p>
          <h1 className="mt-2 text-5xl font-black md:text-6xl">Member Dashboard</h1>
          <p className="mt-4 max-w-2xl text-white/58">
            Review potential new members from rush forms and RSVPs, then record your vote for the rush committee.
          </p>
        </div>
        <button type="button" onClick={logout} className="premium-button premium-button-secondary w-full md:w-auto">Log out</button>
      </div>

      {message ? <p className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">{message}</p> : null}

      {isAdmin ? (
        <div className="member-panel mt-8 p-5 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Admin</p>
              <h2 className="mt-2 text-2xl font-black">Account Requests</h2>
            </div>
            <span className="member-pill">{profiles.filter((member) => member.status === 'pending').length} pending</span>
          </div>

          <div className="member-admin-list mt-5 grid gap-3">
            {profiles.length ? profiles.map((member) => (
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4" key={member.user_id}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-white">{member.display_name || member.email || 'Unnamed member'}</p>
                    <p className="text-sm text-white/52">{member.email || 'No email'} · {member.status}</p>
                  </div>
                  {member.user_id !== userId ? (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => updateMemberStatus(member, 'approved')} className="rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-ink">Approve</button>
                      <button type="button" onClick={() => updateMemberStatus(member, 'denied')} className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/72">Deny</button>
                    </div>
                  ) : <span className="member-pill">You</span>}
                </div>
              </div>
            )) : <p className="text-white/52">No member profiles yet.</p>}
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4">
        {prospects.length ? prospects.map((prospect) => {
          const totals = voteTotals(votes, prospect.key);
          const myVote = myVotes[prospect.key];

          return (
            <article className="member-panel p-5 md:p-6" key={prospect.key}>
              <div className="grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="member-pill">{prospectSource(prospect)}</span>
                    {prospect.application?.major ? <span className="member-pill">{prospect.application.major}</span> : null}
                    {prospect.application?.graduation_year ? <span className="member-pill">{prospect.application.graduation_year}</span> : null}
                  </div>

                  <h2 className="mt-4 text-3xl font-black text-white">{prospectName(prospect)}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    {[prospect.application?.email || prospect.rsvp?.email, prospect.application?.phone || prospect.rsvp?.phone, prospect.application?.hometown]
                      .filter(Boolean)
                      .join(' · ') || 'No contact details available'}
                  </p>

                  {prospect.application ? (
                    <div className="mt-4 grid gap-2 text-sm text-white/58 md:grid-cols-2">
                      <p><span className="text-gold">Sports:</span> {prospect.application.sports || 'None listed'}</p>
                      <p><span className="text-gold">Clubs:</span> {prospect.application.clubs || 'None listed'}</p>
                      <p><span className="text-gold">Leadership:</span> {prospect.application.leadership_positions || 'None listed'}</p>
                      <p><span className="text-gold">Instagram:</span> {prospect.application.instagram || prospect.rsvp?.instagram || 'None listed'}</p>
                    </div>
                  ) : null}

                  {prospect.rsvp?.message ? <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-white/62">{prospect.rsvp.message}</p> : null}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/28 p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-2xl font-black text-gold">{totals.yes}</p><p className="text-xs uppercase tracking-[0.16em] text-white/45">Yes</p></div>
                    <div><p className="text-2xl font-black text-gold">{totals.maybe}</p><p className="text-xs uppercase tracking-[0.16em] text-white/45">Maybe</p></div>
                    <div><p className="text-2xl font-black text-gold">{totals.no}</p><p className="text-xs uppercase tracking-[0.16em] text-white/45">No</p></div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {(['yes', 'maybe', 'no'] as VoteValue[]).map((vote) => (
                      <button
                        type="button"
                        onClick={() => saveVote(prospect, vote)}
                        disabled={savingKey === prospect.key}
                        className={`member-vote-button ${myVote?.vote === vote ? 'member-vote-button-active' : ''}`}
                        key={vote}
                      >
                        {vote}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="member-field mt-3 min-h-24 resize-none text-sm"
                    placeholder="Private note for your vote"
                    value={noteDrafts[prospect.key] || ''}
                    onChange={(event) => setNoteDrafts((drafts) => ({ ...drafts, [prospect.key]: event.target.value }))}
                  />

                  <p className="mt-3 text-xs leading-5 text-white/45">
                    {myVote ? `Your vote: ${myVote.vote.toUpperCase()}` : 'You have not voted yet.'}
                  </p>
                </div>
              </div>
            </article>
          );
        }) : (
          <div className="member-panel p-8 text-white/58">No rush forms or RSVPs are available yet.</div>
        )}
      </div>
    </section>
  );
}
