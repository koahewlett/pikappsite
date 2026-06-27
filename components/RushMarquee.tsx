'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function RushMarquee() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const leftX = useTransform(scrollYProgress, [0, 0.12, 0.28], ['-105vw', '0vw', '4vw']);
  const rightX = useTransform(scrollYProgress, [0, 0.12, 0.28], ['105vw', '0vw', '-4vw']);

  return (
    <div className="rush-marquee" aria-hidden="true">
      <div className="rush-marquee-inner">
        <motion.div className="rush-marquee-row" style={{ x: reduceMotion ? 0 : leftX }}>
          <span>Exceptional leaders.</span>
        </motion.div>
        <motion.div className="rush-marquee-row rush-marquee-row-reverse" style={{ x: reduceMotion ? 0 : rightX }}>
          <span>Uncommon opportunities.</span>
        </motion.div>
      </div>
    </div>
  );
}
