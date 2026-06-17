'use client';

import { useEffect, useRef, useState } from 'react';

const ENABLE_INTRO_LOADER = true;
const INTRO_STORAGE_KEY = 'pikapp-asu-intro-loader-seen';

type IntroPhase = 'checking' | 'line-one' | 'line-two' | 'flash' | 'exiting' | 'hidden';

const INTRO_TIMING = {
  full: {
    lineTwo: 1700,
    flash: 3350,
    exit: 4600,
    hidden: 4980,
  },
  reduced: {
    lineTwo: 520,
    flash: 960,
    exit: 1320,
    hidden: 1520,
  },
};

function AnimatedText({ text }: { text: string }) {
  return (
    <span className="intro-loader-line-text" aria-hidden="true">
      {Array.from(text).map((character, index) => (
        <span
          className="intro-loader-char"
          key={`${character}-${index}`}
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </span>
  );
}

export function IntroLoader() {
  const [phase, setPhase] = useState<IntroPhase>('checking');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!ENABLE_INTRO_LOADER) {
      setPhase('hidden');
      return;
    }

    const hasSeenIntro = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === 'true';

    if (hasSeenIntro) {
      setPhase('hidden');
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timing = reduceMotion ? INTRO_TIMING.reduced : INTRO_TIMING.full;

    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setPhase('line-one');

    timers.current = [
      window.setTimeout(() => setPhase('line-two'), timing.lineTwo),
      window.setTimeout(() => setPhase('flash'), timing.flash),
      window.setTimeout(() => setPhase('exiting'), timing.exit),
      window.setTimeout(() => setPhase('hidden'), timing.hidden),
    ];

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  const skipIntro = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setPhase('exiting');
    window.setTimeout(() => setPhase('hidden'), 260);
  };

  if (phase === 'checking' || phase === 'hidden') return null;

  const activeText = phase === 'line-one' ? 'Everyone knows about it.' : 'Few get to experience it';
  const ariaText = phase === 'flash' ? 'Rush. Pi Kapp' : activeText;

  return (
    <div className={`intro-loader intro-loader-${phase}`} role="status" aria-live="polite" aria-label={ariaText}>
      <div className="intro-loader-light intro-loader-light-gold" />
      <div className="intro-loader-light intro-loader-light-blue" />

      <div className="intro-loader-content">
        {phase === 'flash' || phase === 'exiting' ? (
          <div className="intro-loader-mark">Rush. Pi Kapp</div>
        ) : (
          <div className="intro-loader-line" key={phase}>
            <AnimatedText text={activeText} />
            <span className="sr-only">{activeText}</span>
          </div>
        )}
      </div>

      <button className="intro-loader-skip" type="button" onClick={skipIntro}>
        Skip
      </button>
    </div>
  );
}
