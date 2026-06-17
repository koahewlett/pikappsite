'use client';

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(() => setHidden(true), reduceMotion ? 250 : 1650);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className={`site-loader ${hidden ? 'site-loader-hidden' : ''}`} aria-hidden="true">
      <div className="site-loader-mark">Π Κ Φ</div>
    </div>
  );
}
