'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

export function RsvpSection() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    instagram: '',
    message: '',
    consent: false,
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    setStatus('');
    setStatusType('');

    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      setStatus('Please provide your name, email, and phone number.');
      setStatusType('error');
      return;
    }

    if (!form.consent) {
      setStatus('Please confirm that Pi Kapp can contact you about rush.');
      setStatusType('error');
      return;
    }

    setSubmitting(true);

    const normalizedEmail = normalizeEmail(form.email);
    const normalizedPhone = normalizePhone(form.phone);

    try {
      const { data: matchedApplications, error: matchError } = await supabase
        .from('rush_applications')
        .select('id')
        .or(`email.ilike.${encodeURIComponent(normalizedEmail)},phone.ilike.%${normalizedPhone}%`)
        .limit(1);

      if (matchError) {
        throw matchError;
      }

      const matchedApplication = matchedApplications?.[0] ?? null;
      const rsvpPayload = {
        full_name: form.full_name.trim(),
        email: normalizedEmail,
        phone: form.phone.trim(),
        instagram: form.instagram.trim() || null,
        message: form.message.trim() || null,
        consent_to_contact: form.consent,
        normalized_email: normalizedEmail,
        normalized_phone: normalizedPhone,
        matched_rush_application_id: matchedApplication?.id || null,
        has_full_application: Boolean(matchedApplication),
      };

      const { data: existingRsvps, error: findError } = await supabase
        .from('rush_rsvps')
        .select('id')
        .or(`normalized_email.eq.${encodeURIComponent(normalizedEmail)},normalized_phone.eq.${normalizedPhone}`)
        .limit(1);

      if (findError) {
        throw findError;
      }

      if (existingRsvps?.length) {
        const { error: updateError } = await supabase
          .from('rush_rsvps')
          .update(rsvpPayload)
          .eq('id', existingRsvps[0].id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase.from('rush_rsvps').insert([rsvpPayload]);
        if (insertError) {
          throw insertError;
        }
      }

      const successMessage = matchedApplication
        ? 'You’re already in our rush list — we’ll keep you updated.'
        : 'You’re on the list. We’ll text/email you rush details soon.';

      setStatus(successMessage);
      setStatusType('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setStatus(message);
      setStatusType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass mx-auto max-w-4xl rounded-[2rem] p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-white/70">
                Full name
                <input
                  value={form.full_name}
                  onChange={(event) => handleChange('full_name', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-gold"
                  placeholder="Jordan Smith"
                />
              </label>
              <label className="text-sm text-white/70">
                Phone number
                <input
                  value={form.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-gold"
                  placeholder="(480) 555-0123"
                />
              </label>
              <label className="text-sm text-white/70">
                Email
                <input
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-gold"
                  placeholder="name@example.com"
                />
              </label>
              <label className="text-sm text-white/70">
                Instagram handle
                <input
                  value={form.instagram}
                  onChange={(event) => handleChange('instagram', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-gold"
                  placeholder="@sunrise_state"
                />
              </label>
            </div>

            <label className="mt-4 text-sm text-white/70 block">
              Anything we should know?
              <textarea
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-gold"
                rows={4}
                placeholder="Tell us a little about what you’re most excited for."
              />
            </label>

            <label className="mt-4 flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => handleChange('consent', event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 text-gold focus:ring-gold"
              />
              <span>I’m okay with Pi Kapp contacting me by text or email about rush.</span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'RSVP'}
            </button>

            {status ? (
              <p className={`mt-4 text-sm ${statusType === 'error' ? 'text-rose-300' : 'text-gold'}`}>{status}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
