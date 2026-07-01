'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type MemberStatus = 'pending' | 'approved' | 'admin' | 'denied';
type GateState = 'loading' | 'signed-out' | 'pending' | 'denied' | 'approved';
type VoteStatus = 'interested' | 'neutral' | 'not_interested' | 'need_more_info';
type ListMode = 'all' | 'studs';
type PnmViewFilter = 'all' | 'studs' | 'rated' | 'unrated' | '5' | '4' | '3' | '2' | '1';
type SortMode = 'recent' | 'favorite_recent' | 'average_desc' | 'my_desc' | 'name_asc';

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

type PnmRating = {
  id: string;
  pnm_id: string;
  user_id: string;
  rating: number;
  created_at: string | null;
  updated_at: string | null;
};

type PnmFavorite = {
  id: string;
  pnm_id: string;
  user_id: string;
  created_at: string | null;
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

const pnmViewFilters: { value: PnmViewFilter; label: string }[] = [
  { value: 'all', label: 'All PNMs' },
  { value: 'studs', label: 'My Studs' },
  { value: 'rated', label: 'Rated by Me' },
  { value: 'unrated', label: 'Unrated by Me' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
  { value: 'unrated', label: 'Unrated' },
];

const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'recent', label: 'Recently submitted' },
  { value: 'favorite_recent', label: 'Recently added' },
  { value: 'average_desc', label: 'Average rating high to low' },
  { value: 'my_desc', label: 'My rating high to low' },
  { value: 'name_asc', label: 'Name A-Z' },
];

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

function ratingSummaryText(average: number, count: number) {
  if (!count) return 'Not rated yet';
  return `Average: ${average.toFixed(1)} / 5 from ${count} rating${count === 1 ? '' : 's'}`;
}

function StarRating({
  value,
  disabled,
  onRate,
  saving,
}: {
  value: number;
  disabled?: boolean;
  onRate?: (rating: number) => void;
  saving?: boolean;
}) {
  return (
    <div className="pnm-star-rating" aria-label={value ? `${value} out of 5 stars` : 'Not rated'}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          type="button"
          aria-label={`${rating} star${rating === 1 ? '' : 's'}`}
          className={`pnm-star-button ${value >= rating ? 'pnm-star-button-active' : ''}`}
          disabled={disabled || saving}
          onClick={() => onRate?.(rating)}
          key={rating}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function MemberDashboard() {
  const [gate, setGate] = useState<GateState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [applications, setApplications] = useState<RushApplication[]>([]);
  const [votes, setVotes] = useState<PnmVote[]>([]);
  const [ratings, setRatings] = useState<PnmRating[]>([]);
  const [favorites, setFavorites] = useState<PnmFavorite[]>([]);
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [listMode, setListMode] = useState<ListMode>('all');
  const [viewFilter, setViewFilter] = useState<PnmViewFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [ratingSavingId, setRatingSavingId] = useState<string | null>(null);
  const [ratingSavedId, setRatingSavedId] = useState<string | null>(null);
  const [favoriteSavingId, setFavoriteSavingId] = useState<string | null>(null);
  const [favoriteSavedId, setFavoriteSavedId] = useState<string | null>(null);
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

      const [applicationsResult, votesResult, ratingsResult, favoritesResult, profilesResult] = await Promise.all([
        supabase
          .from('rush_applications')
          .select('id,created_at,first_name,last_name,phone,email,major,graduation_year,hometown,sports,clubs,leadership_positions,instagram,linkedin,status')
          .order('created_at', { ascending: false }),
        supabase.from('pnm_votes').select('*').order('updated_at', { ascending: false }),
        supabase.from('pnm_ratings').select('*').order('updated_at', { ascending: false }),
        supabase.from('pnm_favorites').select('*').order('created_at', { ascending: false }),
        supabase
          .from('member_profiles')
          .select('user_id,email,display_name,status,created_at,approved_at')
          .order('created_at', { ascending: false }),
      ]);

      if (applicationsResult.error) throw applicationsResult.error;
      if (votesResult.error) throw votesResult.error;
      if (ratingsResult.error) throw ratingsResult.error;
      if (favoritesResult.error) throw favoritesResult.error;
      if (profilesResult.error) throw profilesResult.error;

      const loadedVotes = (votesResult.data || []) as PnmVote[];
      setApplications((applicationsResult.data || []) as RushApplication[]);
      setVotes(loadedVotes);
      setRatings((ratingsResult.data || []) as PnmRating[]);
      setFavorites((favoritesResult.data || []) as PnmFavorite[]);
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

  const myRatings = useMemo(() => {
    return ratings.reduce<Record<string, PnmRating>>((map, rating) => {
      if (rating.user_id === userId) map[rating.pnm_id] = rating;
      return map;
    }, {});
  }, [ratings, userId]);

  const myFavorites = useMemo(() => {
    return favorites.reduce<Record<string, PnmFavorite>>((map, favorite) => {
      if (favorite.user_id === userId) map[favorite.pnm_id] = favorite;
      return map;
    }, {});
  }, [favorites, userId]);

  const ratingStatsByPnm = useMemo(() => {
    return ratings.reduce<Record<string, { average: number; count: number; total: number }>>((map, rating) => {
      const current = map[rating.pnm_id] || { average: 0, count: 0, total: 0 };
      const total = current.total + rating.rating;
      const count = current.count + 1;
      map[rating.pnm_id] = { total, count, average: total / count };
      return map;
    }, {});
  }, [ratings]);

  const displayedApplications = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const myRating = myRatings[application.id]?.rating || 0;
      const isFavorite = Boolean(myFavorites[application.id]);
      const searchable = [
        applicationName(application),
        application.email,
        application.phone,
        application.hometown,
        application.major,
        application.graduation_year,
        application.instagram,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (normalizedSearch && !searchable.includes(normalizedSearch)) return false;
      if (listMode === 'studs' && !isFavorite) return false;
      if (viewFilter === 'studs') return isFavorite;
      if (viewFilter === 'rated') return myRating > 0;
      if (viewFilter === 'unrated') return myRating === 0;
      if (viewFilter !== 'all') return myRating === Number(viewFilter);

      return true;
    });

    return [...filtered].sort((a, b) => {
      const aMine = myRatings[a.id]?.rating || 0;
      const bMine = myRatings[b.id]?.rating || 0;
      const aAverage = ratingStatsByPnm[a.id]?.average ?? -1;
      const bAverage = ratingStatsByPnm[b.id]?.average ?? -1;
      const aFavoriteDate = myFavorites[a.id]?.created_at || '';
      const bFavoriteDate = myFavorites[b.id]?.created_at || '';
      const aDate = a.created_at || '';
      const bDate = b.created_at || '';

      if (sortMode === 'average_desc') return bAverage - aAverage || bDate.localeCompare(aDate);
      if (sortMode === 'my_desc') return bMine - aMine || bAverage - aAverage || bDate.localeCompare(aDate);
      if (sortMode === 'favorite_recent') return bFavoriteDate.localeCompare(aFavoriteDate) || bDate.localeCompare(aDate);
      if (sortMode === 'name_asc') return applicationName(a).localeCompare(applicationName(b)) || bDate.localeCompare(aDate);

      return bDate.localeCompare(aDate);
    });
  }, [applications, listMode, myFavorites, myRatings, ratingStatsByPnm, searchQuery, sortMode, viewFilter]);

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

  async function saveRating(application: RushApplication, rating: number) {
    if (!userId) return;

    setRatingSavingId(application.id);
    setRatingSavedId(null);
    setFavoriteSavedId(null);
    setMessage('');

    try {
      const payload = {
        pnm_id: application.id,
        user_id: userId,
        rating,
      };

      const { data, error } = await supabase
        .from('pnm_ratings')
        .upsert(payload, { onConflict: 'pnm_id,user_id' })
        .select('*')
        .single();

      if (error) throw error;

      setRatings((current) => [data as PnmRating, ...current.filter((existing) => existing.id !== data.id)]);
      setRatingSavedId(application.id);
      setMessage('Rating updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update rating.');
    } finally {
      setRatingSavingId(null);
    }
  }

  async function toggleFavorite(application: RushApplication) {
    if (!userId) return;

    const existingFavorite = myFavorites[application.id];
    setFavoriteSavingId(application.id);
    setFavoriteSavedId(null);
    setRatingSavedId(null);
    setMessage('');

    try {
      if (existingFavorite) {
        const { error } = await supabase
          .from('pnm_favorites')
          .delete()
          .eq('id', existingFavorite.id);

        if (error) throw error;

        setFavorites((current) => current.filter((favorite) => favorite.id !== existingFavorite.id));
        setFavoriteSavedId(application.id);
        setMessage('Removed from My Studs.');
        return;
      }

      const { data, error } = await supabase
        .from('pnm_favorites')
        .upsert({ pnm_id: application.id, user_id: userId }, { onConflict: 'pnm_id,user_id' })
        .select('*')
        .single();

      if (error) throw error;

      setFavorites((current) => [data as PnmFavorite, ...current.filter((favorite) => favorite.id !== data.id)]);
      setFavoriteSavedId(application.id);
      setMessage('Added to My Studs.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update My Studs.');
    } finally {
      setFavoriteSavingId(null);
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
          <div className="pnm-list-heading-main">
            <div>
              <p className="section-kicker">Potential New Members</p>
              <h2>{listMode === 'studs' ? 'My Studs' : 'All submitted PNMs'}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="member-pill">{applications.length} applications</span>
              <span className="member-pill">{displayedApplications.length} shown</span>
              <span className="member-pill">{Object.keys(myFavorites).length} studs</span>
            </div>
          </div>
          <div className="pnm-list-actions">
            <div className="pnm-view-toggle" aria-label="PNM list view">
              <button
                type="button"
                className={listMode === 'all' ? 'pnm-view-toggle-active' : ''}
                onClick={() => {
                  setListMode('all');
                  setViewFilter('all');
                  setSortMode('recent');
                }}
              >
                All PNMs
              </button>
              <button
                type="button"
                className={listMode === 'studs' ? 'pnm-view-toggle-active' : ''}
                onClick={() => {
                  setListMode('studs');
                  setViewFilter('studs');
                  setSortMode('favorite_recent');
                }}
              >
                My Studs
              </button>
            </div>

            <label className="pnm-list-control pnm-search-control">
              <span>Search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name, hometown, major"
              />
            </label>

            <label className="pnm-list-control">
              <span>View</span>
              <select
                value={viewFilter}
                onChange={(event) => {
                  const nextFilter = event.target.value as PnmViewFilter;
                  setViewFilter(nextFilter);
                  setListMode(nextFilter === 'studs' ? 'studs' : 'all');
                  if (nextFilter === 'studs' && sortMode === 'recent') setSortMode('favorite_recent');
                }}
              >
                {pnmViewFilters.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="pnm-list-control">
              <span>Sort</span>
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                {sortOptions.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {applications.length ? (
          <div className="pnm-application-list">
            {displayedApplications.length ? displayedApplications.map((application) => {
              const myVote = myVotes[application.id];
              const myRating = myRatings[application.id]?.rating || 0;
              const myFavorite = myFavorites[application.id];
              const ratingStats = ratingStatsByPnm[application.id] || { average: 0, count: 0, total: 0 };
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
                        {ratingSavedId === application.id ? <span className="member-pill pnm-saved-pill">Rating saved</span> : null}
                        {favoriteSavedId === application.id ? <span className="member-pill pnm-saved-pill">Studs updated</span> : null}
                      </div>
                      <h3>{applicationName(application)}</h3>
                      <p>{applicationContact(application)}</p>
                      <p>{applicationMeta(application)}</p>
                      <div className="pnm-rating-row">
                        <StarRating value={Math.round(ratingStats.average)} disabled />
                        <span>{ratingSummaryText(ratingStats.average, ratingStats.count)}</span>
                      </div>
                    </div>

                    <div className="pnm-row-vote">
                      <div className="pnm-rating-control">
                        <div className="pnm-rating-control-head">
                          <span>My rating</span>
                          <strong>{myRating ? `${myRating} / 5` : 'Unrated'}</strong>
                        </div>
                        <StarRating
                          value={myRating}
                          saving={ratingSavingId === application.id}
                          onRate={(rating) => void saveRating(application, rating)}
                        />
                      </div>

                      <button
                        type="button"
                        className={`pnm-studs-button ${myFavorite ? 'pnm-studs-button-active' : ''}`}
                        disabled={favoriteSavingId === application.id}
                        onClick={() => void toggleFavorite(application)}
                      >
                        {favoriteSavingId === application.id
                          ? 'Updating...'
                          : myFavorite
                            ? 'In My Studs'
                            : 'Add to Studs'}
                      </button>

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
                        <div className="pnm-rating-detail">
                          <p><span>Average rating:</span> {ratingStats.count ? `${ratingStats.average.toFixed(1)} / 5` : 'Not rated yet'}</p>
                          <p><span>Ratings:</span> {ratingStats.count ? `${ratingStats.count} member${ratingStats.count === 1 ? '' : 's'}` : 'No member ratings yet'}</p>
                          <p><span>My rating:</span> {myRating ? `${myRating} / 5` : 'Unrated'}</p>
                          <p><span>My Studs:</span> {myFavorite ? `Added ${submittedDate(myFavorite.created_at)}` : 'Not in My Studs'}</p>
                        </div>
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
            }) : (
              <div className="pnm-empty-state">
                <p>{listMode === 'studs' ? 'No PNMs are in My Studs yet.' : 'No PNMs match this search or filter.'}</p>
              </div>
            )}
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
