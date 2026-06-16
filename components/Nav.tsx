'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Nav() {
  const [showBottomApply, setShowBottomApply] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBottomApply(window.scrollY > window.innerHeight * 0.9);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        {/* Mobile header */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 md:hidden">
          <Link href="/" className="font-display font-black tracking-[.18em] text-gold">
  Π Κ Φ 
</Link>

          <nav className="flex min-w-0 flex-1 justify-center">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              <a href="/#why" className="rounded-full px-3 py-2 text-[11px] font-bold text-white/75">
                Why
              </a>
              <a href="/events" className="rounded-full px-3 py-2 text-[11px] font-bold text-white/75">
                Events
              </a>
              <a href="/login" className="rounded-full px-3 py-2 text-[11px] font-bold text-white/75">
                Members
              </a>
            </div>
          </nav>

          <a
            href="/#apply"
            className="shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-black text-ink"
          >
            Apply
          </a>
        </div>

        {/* Desktop header */}
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-5 py-4 md:flex">
          <Link href="/" className="font-black tracking-[.18em] text-gold">
            Π Κ Φ Theta Xi Chapter
          </Link>

          <nav className="flex gap-6 text-sm text-white/70">
            <a href="/#why" className="transition hover:text-gold">
              Why
            </a>
            <a href="/events" className="transition hover:text-gold">
              Events
            </a>
            <a href="/#gallery" className="transition hover:text-gold">
              Gallery
            </a>
            <a href="/login" className="transition hover:text-gold">
              Members
            </a>
          </nav>

          <a
            href="/#apply"
            className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink transition hover:scale-105"
          >
            Apply
          </a>
        </div>
      </header>

      {showBottomApply && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 right-4 z-50 md:hidden">
          <a
            href="/#apply"
            className="block rounded-2xl bg-gold py-4 text-center font-black text-ink shadow-glow"
          >
            Apply for Rush
          </a>
        </div>
      )}
    </>
  );
}