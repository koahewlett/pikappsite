'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type RecoveryStatus = 'checking' | 'ready' | 'error' | 'success';

function recoveryMarkerFromUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const type = hashParams.get('type') || searchParams.get('type');
  const errorDescription =
    hashParams.get('error_description') ||
    searchParams.get('error_description') ||
    hashParams.get('error') ||
    searchParams.get('error');

  return {
    isRecovery: type === 'recovery',
    errorDescription,
  };
}

export function UpdatePasswordForm() {
  const [status, setStatus] = useState<RecoveryStatus>('checking');
  const [message, setMessage] = useState('Verifying your reset link...');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cameFromRecoveryLink, setCameFromRecoveryLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const { isRecovery, errorDescription } = recoveryMarkerFromUrl();

    if (errorDescription) {
      setStatus('error');
      setMessage(errorDescription.replace(/\+/g, ' '));
      return;
    }

    setCameFromRecoveryLink(isRecovery);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setCameFromRecoveryLink(true);
        setStatus('ready');
        setMessage('Reset link verified. Choose a new password.');
        return;
      }

      if (session && isRecovery) {
        setStatus('ready');
        setMessage('Reset link verified. Choose a new password.');
      }
    });

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }

      if (data.session) {
        setStatus('ready');
        setMessage(
          isRecovery
            ? 'Reset link verified. Choose a new password.'
            : 'You are signed in. Choose a new password for this account.'
        );
        return;
      }

      setStatus('error');
      setMessage('This reset link is missing or expired. Request a new password reset email from the member login page.');
    }

    const timeout = window.setTimeout(() => {
      setStatus((current) => {
        if (current !== 'checking') return current;
        setMessage('This reset link is taking too long to verify. Request a new one if the form does not appear.');
        return 'error';
      });
    }, 2600);

    checkSession();

    return () => {
      isMounted = false;
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function submitNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (newPassword.length < 8) {
      setStatus('ready');
      setMessage('Use at least 8 characters for your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('ready');
      setMessage('The two password fields do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setStatus('success');
      setMessage('Password updated. Sending you back to member login...');
      setNewPassword('');
      setConfirmPassword('');
      window.setTimeout(() => {
        window.location.href = '/login?password=updated';
      }, 1200);
    } catch (error) {
      setStatus('ready');
      setMessage(error instanceof Error ? error.message : 'Unable to update your password.');
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = status === 'ready' && !submitting;

  return (
    <div className="member-panel mx-auto max-w-md p-8">
      <p className="section-kicker">Members</p>
      <h1 className="mt-2 text-4xl font-black">Reset Password</h1>
      <p className="mt-3 text-sm leading-6 text-white/58">
        Open this page from your Supabase password recovery email, then choose a new member password.
      </p>

      {cameFromRecoveryLink ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gold/80">Recovery session detected</p>
      ) : null}

      {status === 'checking' ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/62">
          {message}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-white/72">
          <p>{message}</p>
          <a href="/login" className="mt-4 inline-flex font-bold text-gold transition hover:text-yellow-300">
            Back to member login
          </a>
        </div>
      ) : null}

      {status === 'ready' || status === 'success' ? (
        <form className="mt-6 grid gap-3" onSubmit={submitNewPassword}>
          <input
            className="member-field"
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={status === 'success'}
            minLength={8}
            autoComplete="new-password"
            required
          />
          <input
            className="member-field"
            placeholder="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={status === 'success'}
            minLength={8}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 rounded-full bg-gold p-3 font-bold text-ink transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Updating...' : status === 'success' ? 'Updated' : 'Update Password'}
          </button>
        </form>
      ) : null}

      {message && status !== 'checking' && status !== 'error' ? (
        <p className={`mt-4 text-sm leading-6 ${status === 'success' ? 'text-gold' : 'text-white/68'}`}>{message}</p>
      ) : null}
    </div>
  );
}
