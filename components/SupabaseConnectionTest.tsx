'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState('');

  async function checkConnection() {
    setStatus('Checking Supabase connection...');

    try {
      const { data, error } = await supabase.from('signups').select('id').limit(1);
      if (error) {
        if (error.message.match(/permission denied|not authenticated|authentication/i)) {
          setStatus('Connected to Supabase, but the anon user cannot read signups due to RLS. This is expected.');
        } else {
          setStatus(`Connection error: ${error.message}`);
        }
        return;
      }

      setStatus(data ? 'Connected to Supabase and query succeeded.' : 'Connected to Supabase. No signups were returned.');
    } catch (err) {
      setStatus(`Network or CORS error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="glass rounded-[2rem] p-6 text-white/80">
      <h3 className="mb-3 text-xl font-black">Supabase Connection Test</h3>
      <p className="mb-4 text-sm text-white/60">
        Click the button below to verify the client can reach your Supabase project. A RLS permission error is expected for anonymous users.
      </p>
      <button onClick={checkConnection} className="rounded-full bg-gold px-5 py-3 font-bold text-ink">
        Test Connection
      </button>
      {status && <p className="mt-4 text-sm text-gold">{status}</p>}
    </div>
  );
}
