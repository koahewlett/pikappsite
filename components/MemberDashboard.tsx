'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type MemberStatus = 'pending' | 'approved' | 'admin' | 'denied';
type GateState = 'loading' | 'signed-out' | 'pending' | 'denied' | 'approved';
type VoteStatus = 'interested' | 'neutral' | 'not_interested' | 'need_more_info';

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
  status: string | null;
};

type PnmVote = {
  id: string;
  pnm_id: string;
  member_id: string;
  member_email: string | null;
  vote_status: VoteStatus;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const approvedStatuses = new Set<MemberStatus>(['approved', 'admin']);

const voteOptions: { value: VoteStatus; label: string }[] = [
  { value: 'interested', label: 'Interested' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'not_interested', label: 'Not interested' },
  { value: 'need_more_info', label: 'Need more info' },
];

const voteLabels = voteOptions.reduce<Record<VoteStatus, string>>(
  (labels, option) => ({ ...labels, [option.value]: option.label }),
  {
    interested: 'Interested',
    neutral: 'Neutral',
    not_interested: 'Not interested',
    need_more_info: 'Need more info',
  }
);

function applicationName(application: RushApplication) {
  return [application.first_name, application.last_name].filter(Boolean).join(' ').trim() || 'Unnamed PNM';
}

function applicationContact(application: RushApplication) {
  return [application.email, application.phone, application.hometown].filter(Boolean).join(' · ') || 'No contact details listed';
}

function applicationMeta(application: RushApplication) {
  return [application.major, application.graduation_year, application.instagram].filter(Boolean).join(' · ') || 'No ASU details listed';
}

function submittedDate(value: string | null) {
  if (!value) return 'No date';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function compactText(value: string | null | undefined) {
  return value?.trim() || 'None listed';
}

export function MemberDashboard() {
  const [gate, setGate] = useState<GateState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [applications, setApplications] = useState<RushApplication[]>([]);
  const [votes, setVotes] = useState<PnmVote[]>([]);
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
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
      setUserEmail(user.email ?? null);

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

      const [applicationsResult, votesResult, profilesResult] = await Promise.all([
        supabase
          .from('rush_applications')
          .select('id,created_at,first_name,last_name,phone,email,major,graduation_year,hometown,sports,clubs,leadership_positions,instagram,linkedin,status')
          .order('created_at', { ascending: false }),
        supabase.from('pnm_votes').select('*').order('updated_at', { ascending: false }),
        supabase
          .from('member_profiles')
          .select('user_id,email,display_name,status,created_at,approved_at')
          .order('created_at', { ascending: false }),
      ]);

      if (applicationsResult.error) throw applicationsResult.error;
      if (votesResult.error) throw votesResult.error;
      if (profilesResult.error) throw profilesResult.error;

      const loadedVotes = (votesResult.data || []) as PnmVote[];
      setApplications((applicationsResult.data || []) as RushApplication[]);
      setVotes(loadedVotes);
      setProfiles((profilesResult.data || []) as MemberProfile[]);
      setNoteDrafts(
        loadedVotes
          .filter((vote) => vote.member_id === user.id)
          .reduce<Record<string, string>>((drafts, vote) => ({ ...drafts, [vote.pnm_id]: vote.notes || '' }), {})
      );
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
    return votes.reduce<Record<string, PnmVote>>((map, vote) => {
      if (vote.member_id === userId) map[vote.pnm_id] = vote;
      return map;
    }, {});
  }, [userId, votes]);

  const votesByPnm = useMemo(() => {
    return votes.reduce<Record<string, PnmVote[]>>((map, vote) => {
      map[vote.pnm_id] = [...(map[vote.pnm_id] || []), vote];
      return map;
    }, {});
  }, [votes]);

  const memberNameById = useMemo(() => {
    return profiles.reduce<Record<string, string>>((map, member) => {
      map[member.user_id] = member.display_name || member.email || 'Approved member';
      return map;
    }, {});
  }, [profiles]);

  async function saveVote(application: RushApplication, voteStatus: VoteStatus) {
    if (!userId) return;

    setSavingId(application.id);
    setSavedId(null);
    setMessage('');

    try {
      const payload = {
        pnm_id: application.id,
        member_id: userId,
        member_email: userEmail,
        vote_status: voteStatus,
        notes: noteDrafts[application.id]?.trim() || null,
      };

      const { data, error } = await supabase
        .from('pnm_votes')
        .upsert(payload, { onConflict: 'pnm_id,member_id' })
        .select('*')
        .single();

      if (error) throw error;

      setVotes((current) => [data as PnmVote, ...current.filter((existing) => existing.id !== data.id)]);
      setSavedId(application.id);
      setMessage('Vote updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update vote.');
    } finally {
      setSavingId(null);
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
      <div className="member-dashboard-header">
        <div>
          <p className="section-kicker">Rush Committee</p>
          <h1 className="mt-2 text-5xl font-black md:text-6xl">P.N.M Dashboard</h1>
          <p className="mt-4 max-w-2xl text-white/58">
            Scan every submitted rush application, record your status, and expand a row only when you need the full vote history.
          </p>
        </div>
        <button type="button" onClick={logout} className="premium-button premium-button-secondary w-full md:w-auto">Log out</button>
      </div>

      {message ? <p className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">{message}</p> : null}

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

      <div className="member-panel pnm-list-shell mt-8 p-4 md:p-5">
        <div className="pnm-list-heading">
          <div>
            <p className="section-kicker">Potential New Members</p>
            <h2>All submitted PNMs</h2>
          </div>
          <span className="member-pill">{applications.length} applications</span>
        </div>

        {applications.length ? (
          <div className="pnm-application-list">
            {applications.map((application) => {
              const myVote = myVotes[application.id];
              const rowVotes = votesByPnm[application.id] || [];
              const otherVotes = rowVotes.filter((vote) => vote.member_id !== userId);
              const selectedStatus = myVote?.vote_status || '';

              return (
                <article className="pnm-application-row" key={application.id}>
                  <div className="pnm-row-main">
                    <div className="pnm-row-copy">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="member-pill">{submittedDate(application.created_at)}</span>
                        {application.status ? <span className="member-pill">{application.status}</span> : null}
                        {savedId === application.id ? <span className="member-pill pnm-saved-pill">Saved</span> : null}
                      </div>
                      <h3>{applicationName(application)}</h3>
                      <p>{applicationContact(application)}</p>
                      <p>{applicationMeta(application)}</p>
                    </div>

                    <div className="pnm-row-vote">
                      <label>
                        <span>Your status</span>
                        <select
                          value={selectedStatus}
                          disabled={savingId === application.id}
                          onChange={(event) => {
                            const nextStatus = event.target.value as VoteStatus;
                            if (nextStatus) void saveVote(application, nextStatus);
                          }}
                        >
                          <option value="">Not voted</option>
                          {voteOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Notes</span>
                        <textarea
                          value={noteDrafts[application.id] ?? myVote?.notes ?? ''}
                          onChange={(event) => setNoteDrafts((drafts) => ({ ...drafts, [application.id]: event.target.value }))}
                          placeholder="Optional short note"
                          rows={2}
                        />
                      </label>

                      <button
                        type="button"
                        disabled={savingId === application.id}
                        onClick={() => void saveVote(application, myVote?.vote_status || 'need_more_info')}
                      >
                        {savingId === application.id ? 'Saving...' : 'Save note'}
                      </button>
                    </div>
                  </div>

                  <details className="pnm-response-details">
                    <summary>
                      <span>Submitted info and member responses</span>
                      <span>{rowVotes.length} total</span>
                    </summary>

                    <div className="pnm-expanded-grid">
                      <div className="pnm-submission-panel">
                        <p><span>Sports:</span> {compactText(application.sports)}</p>
                        <p><span>Clubs:</span> {compactText(application.clubs)}</p>
                        <p><span>Leadership:</span> {compactText(application.leadership_positions)}</p>
                        <p><span>LinkedIn:</span> {compactText(application.linkedin)}</p>
                      </div>

                      <div className="pnm-response-list">
                        {myVote ? (
                          <div className="pnm-response-item pnm-response-item-own">
                            <strong>You · {voteLabels[myVote.vote_status]}</strong>
                            <p>{myVote.notes || 'No note added.'}</p>
                          </div>
                        ) : (
                          <div className="pnm-response-item pnm-response-item-own">
                            <strong>Your response</strong>
                            <p>No vote recorded yet.</p>
                          </div>
                        )}

                        {otherVotes.length ? otherVotes.map((vote) => (
                          <div className="pnm-response-item" key={vote.id}>
                            <strong>{memberNameById[vote.member_id] || vote.member_email || 'Approved member'} · {voteLabels[vote.vote_status]}</strong>
                            <p>{vote.notes || 'No note added.'}</p>
                          </div>
                        )) : (
                          <div className="pnm-response-item">
                            <strong>Other members</strong>
                            <p>No other member responses yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="pnm-empty-state">
            <p>No rush applications are available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
