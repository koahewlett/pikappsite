 'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Nav } from '@/components/Nav';

export default function Admin() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');

  async function load() {
    const { data } = await supabase.from('rush_applications').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }

  useEffect(() => { load(); }, []);

  async function updateApplicant(id: string, patch: Record<string, any>) {
    await supabase.from('rush_applications').update(patch).eq('id', id);
    await load();
  }

  const filtered = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  function csv() {
    const headers = Object.keys(rows[0] || { first_name: '', last_name: '', email: '', phone: '', status: '' });
    const body = rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')).join('\n');
    const blob = new Blob([headers.join(',') + '\n' + body], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rush-applications.csv';
    a.click();
  }

  return <main className="member-page min-h-screen bg-ink px-6 py-28">
    <Nav />
    <section className="mx-auto max-w-7xl">
      <p className="text-sm font-bold uppercase tracking-[.35em] text-gold">Admin only</p>
      <h1 className="mt-3 text-5xl font-black">Recruitment Dashboard</h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input onChange={e => setQ(e.target.value)} placeholder="Search applicants, majors, hometowns, tags..." className="flex-1 rounded-2xl bg-white/10 p-4 outline-none focus:ring-2 focus:ring-gold" />
        <button onClick={csv} className="rounded-2xl bg-gold px-5 py-4 font-bold text-ink">Export CSV</button>
      </div>
      <div className="mt-8 grid gap-4">
        {filtered.map(r => <div className="glass rounded-[2rem] p-5" key={r.id}>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-black">{r.first_name} {r.last_name}</h2>
              <p className="text-white/60">{r.email} · {r.phone} · {r.major} · {r.hometown}</p>
              <p className="mt-2 text-sm text-gold">Status: {r.status || 'new'} · Tags: {(r.tags || []).join(', ') || 'none'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => updateApplicant(r.id, { status: 'approved' })} className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink">Approve</button>
              <button onClick={() => updateApplicant(r.id, { status: 'denied' })} className="rounded-full bg-white/10 px-4 py-2 text-sm">Deny</button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input placeholder="Add comma tags" className="rounded-2xl bg-black/30 p-3" onBlur={e => updateApplicant(r.id, { tags: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} />
            <input placeholder="Internal notes" defaultValue={r.internal_notes || ''} className="rounded-2xl bg-black/30 p-3" onBlur={e => updateApplicant(r.id, { internal_notes: e.target.value })} />
          </div>
        </div>)}
      </div>
    </section>
  </main>
}
