'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

type RevealEntry = {
  setVisible: (visible: boolean) => void;
};

const revealEntries = new WeakMap<Element, RevealEntry>();
let sharedObserver: IntersectionObserver | null = null;

function getRevealObserver() {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        revealEntries.get(entry.target)?.setVisible(true);
        sharedObserver?.unobserve(entry.target);
        revealEntries.delete(entry.target);
      });
    },
    { rootMargin: '-8% 0px -8% 0px', threshold: 0.12 },
  );

  return sharedObserver;
}

export function ScrollReveal({ children, className = '', delay = 0, y = 20 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    revealEntries.set(element, { setVisible });
    getRevealObserver().observe(element);

    return () => {
      revealEntries.delete(element);
      sharedObserver?.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? 'scroll-reveal-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
