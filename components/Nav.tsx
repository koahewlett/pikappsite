'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Countdown } from '@/components/Countdown';

function GreekLogo() {
  return (
    <span className="greek-logo" aria-label="Pi Kappa Phi">
      <span>Π</span>
      <span>Κ</span>
      <span>Φ</span>
    </span>
  );
}

const desktopLinks = [
  { href: '/#why', label: 'Why' },
  { href: '/events', label: 'Rush Events' },
  { href: '/executive-board', label: 'Executive Board' },
  { href: '/ability-experience', label: 'Ability Experience' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/login', label: 'Members' },
] as const;

const mobileMoreLinks = [
  { href: '/#faq', label: 'FAQ' },
  { href: '/executive-board', label: 'Executive Board' },
  { href: '/ability-experience', label: 'Ability Experience' },
  { href: '/login', label: 'Members' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [moreOpen, setMoreOpen] = useState(false);
  const [countdownVisible, setCountdownVisible] = useState(isHome);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setCountdownVisible(false);
      return;
    }

    let frame = 0;

    const updateCountdownVisibility = () => {
      frame = 0;
      const hero = document.querySelector<HTMLElement>('.hero-section');
      setCountdownVisible(hero ? hero.getBoundingClientRect().bottom > 108 : false);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateCountdownVisibility);
    };

    updateCountdownVisibility();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [isHome]);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        {/* Mobile header */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 md:hidden">
          <Link href="/" className="font-display shrink-0 font-black tracking-[.18em] text-gold">
            <GreekLogo />
          </Link>

          <nav className="relative flex min-w-0 flex-1 justify-center" aria-label="Mobile navigation">
            <div className="flex max-w-full items-center rounded-full border border-white/10 bg-white/5 p-1 shadow-[0_0_24px_rgba(58,95,205,0.08)]">
              <a href="/events" className="rounded-full px-2.5 py-2 text-[10px] font-bold leading-[1.2] text-white/75 transition hover:text-gold">
                Rush Events
              </a>
              <button
                type="button"
                className="rounded-full px-2.5 py-2 text-[10px] font-bold leading-[1.2] text-white/75 transition hover:text-gold"
                aria-expanded={moreOpen}
                aria-controls="mobile-more-menu"
                onClick={() => setMoreOpen((open) => !open)}
              >
                More
              </button>
            </div>

            {moreOpen ? (
              <div
                id="mobile-more-menu"
                className="absolute right-0 top-[calc(100%+.55rem)] z-50 grid min-w-48 gap-1 rounded-2xl border border-white/10 bg-[#080808]/95 p-2 shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
              >
                {mobileMoreLinks.map((item) => (
                  <a
                    href={item.href}
                    className="rounded-xl px-3 py-2.5 text-left text-xs font-bold leading-[1.25] text-white/72 transition hover:bg-white/10 hover:text-gold"
                    key={item.href}
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </nav>

          <a
            href="/#apply"
            className="shrink-0 rounded-full bg-gold px-3 py-2 text-sm font-black leading-[1.2] text-ink"
          >
            Apply
          </a>
        </div>

        {/* Desktop header */}
        <div className="mx-auto hidden max-w-7xl items-center justify-between gap-5 px-5 py-4 md:flex">
          <Link href="/" className="font-display font-black tracking-[.18em] text-gold">
            <GreekLogo />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-5 text-xs text-white/70 lg:gap-6 lg:text-sm" aria-label="Primary navigation">
            {desktopLinks.map((item) => (
              <a href={item.href} className="transition hover:text-gold" key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="/#apply"
            className="rounded-full bg-gold px-4 py-2 text-sm font-bold leading-[1.2] text-ink transition hover:scale-105"
          >
            Apply
          </a>
        </div>
      </header>

      {isHome ? (
        <div className={`sticky-countdown-bar ${countdownVisible ? 'countdown-visible' : 'countdown-hidden'}`} aria-label="Fall rush countdown">
          <Countdown variant="sticky" />
        </div>
      ) : null}
    </>
  );
}
