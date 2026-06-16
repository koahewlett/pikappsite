'use client';

import { useEffect, useState } from 'react';

export function Countdown() {
  const target = new Date('2026-08-31T17:00:00-07:00').getTime();
  const [t, setT] = useState(() => target - Date.now());

  useEffect(() => {
    const update = () => setT(target - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  const d = Math.max(0, t);
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);

  const hoursLabel = String(hours).padStart(2, '0');
  const minsLabel = String(mins).padStart(2, '0');
  const secsLabel = String(secs).padStart(2, '0');

  return (
    <div className="mx-auto w-full max-w-3xl px-1">
      <div className="countdown-shell relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        <div className="countdown-shine pointer-events-none absolute inset-x-6 top-0 h-20 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,.18),transparent_40%)] opacity-20" />

        <div className="relative flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold/70 sm:text-sm">
            {days} days until fall rush
          </span>

          <div className="countdown-screen flex flex-nowrap items-center justify-center gap-3 rounded-[1.75rem] bg-[#060606]/90 px-5 py-4 shadow-inner shadow-black/50 ring-1 ring-white/10 sm:px-6">
            <span className="font-alarm text-4xl font-black tracking-[0.12em] text-gold drop-shadow-[0_0_24px_rgba(212,175,55,0.22)] tabular-nums sm:text-5xl">
              {hoursLabel}
            </span>

            <span className="font-alarm blink-colon text-4xl font-black tracking-[0.12em] text-gold/80 drop-shadow-[0_0_18px_rgba(212,175,55,0.14)] sm:text-5xl">
              :
            </span>

            <span className="font-alarm text-4xl font-black tracking-[0.12em] text-gold drop-shadow-[0_0_24px_rgba(212,175,55,0.22)] tabular-nums sm:text-5xl">
              {minsLabel}
            </span>

            <span className="font-alarm blink-colon text-4xl font-black tracking-[0.12em] text-gold/80 drop-shadow-[0_0_18px_rgba(212,175,55,0.14)] sm:text-5xl">
              :
            </span>

            <span
              key={secsLabel}
              className="font-alarm countdown-second text-4xl font-black tracking-[0.12em] text-gold drop-shadow-[0_0_26px_rgba(212,175,55,0.24)] tabular-nums sm:text-5xl"
            >
              {secsLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}