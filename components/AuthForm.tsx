'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup';

const approvedStatuses = new Set(['approved', 'admin']);

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadProfile(userId: string, userEmail: string | undefined) {
    const { data, error } = await supabase
      .from('member_profiles')
      .select('user_id,email,display_name,status')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    const { data: inserted, error: insertError } = await supabase
      .from('member_profiles')
      .insert({
        user_id: userId,
        email: userEmail ?? email.trim().toLowerCase(),
        display_name: displayName.trim() || null,
        status: 'pending',
      })
      .select('user_id,email,display_name,status')
      .single();

    if (insertError) throw insertError;
    return inserted;
  }

  async function signIn() {
    setMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Unable to load your member account.');

      const profile = await loadProfile(data.user.id, data.user.email);

      if (approvedStatuses.has(profile.status)) {
        window.location.href = '/dashboard';
        return;
      }

      if (profile.status === 'denied') {
        setMsg('This account request was denied. Contact a rush admin if this seems wrong.');
      } else {
        setMsg('Your account is still pending. A rush admin needs to approve your access before you can view the dashboard.');
      }
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    setMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
        },
      });

      if (error) throw error;

      setMsg('Account created. A rush admin needs to approve your access before you can view the dashboard. If email confirmation is enabled, confirm your email before logging in.');
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMsg('Password reset email sent.');
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <div className="member-panel mx-auto max-w-md p-8">
      <p className="section-kicker">Members</p>
      <h1 className="mt-2 text-4xl font-black">Member Access</h1>
      <p className="mt-3 text-sm leading-6 text-white/58">
        Rush committee and active members can request access here. New accounts stay pending until a rush admin approves them.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${mode === 'login' ? 'bg-gold text-ink' : 'text-white/65 hover:text-white'}`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${mode === 'signup' ? 'bg-gold text-ink' : 'text-white/65 hover:text-white'}`}
        >
          Sign Up
        </button>
      </div>

      {isSignup ? (
        <input
          className="member-field mt-5"
          placeholder="Full name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      ) : null}

      <input
        className="member-field mt-3"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className="member-field mt-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="mt-5 grid gap-2">
        <button
          type="button"
          onClick={isSignup ? signUp : signIn}
          disabled={loading}
          className="rounded-full bg-gold p-3 font-bold text-ink transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Working...' : isSignup ? 'Create Account' : 'Log In'}
        </button>
        <button type="button" onClick={reset} disabled={loading || !email} className="text-sm text-white/60 transition hover:text-gold disabled:opacity-40">
          Forgot Password
        </button>
      </div>

      {msg ? <p className="mt-4 text-sm leading-6 text-gold">{msg}</p> : null}
    </div>
  );
}
