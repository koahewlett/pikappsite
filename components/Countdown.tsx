'use client';
import { useEffect, useState } from 'react';
export function Countdown() {
  const target = new Date('2026-08-31T17:00:00-07:00').getTime();
  const [t, setT] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setT(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const d = Math.max(0, t);
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);

  return (
    <div className="glass inline-flex w-full max-w-[28rem] flex-col gap-4 rounded-3xl p-4 md:flex-row md:items-center md:justify-between">
      <span className="text-sm text-white/70">Fall Rush Starts In</span>
      <div className="flex flex-wrap items-center gap-3 text-lg font-semibold text-white sm:gap-4">
        <span className="rounded-full bg-white/5 px-3 py-2 text-sm font-mono text-white/80 shadow-sm ring-1 ring-white/10 md:px-4 md:text-base">
          {days}d
        </span>
        <span className="rounded-full bg-white/5 px-3 py-2 text-sm font-mono text-white/80 shadow-sm ring-1 ring-white/10 md:px-4 md:text-base">
          {hours}h
        </span>
        <span className="rounded-full bg-white/5 px-3 py-2 text-sm font-mono text-white/80 shadow-sm ring-1 ring-white/10 md:px-4 md:text-base">
          {mins}m
        </span>
        <span key={secs} className="countdown-second rounded-full bg-white/10 px-3 py-2 text-sm font-mono text-gold shadow-sm ring-1 ring-gold/20 md:px-4 md:text-base">
          {secs}s
        </span>
      </div>
    </div>
  );
}

