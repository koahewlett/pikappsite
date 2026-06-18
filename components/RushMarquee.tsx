'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function RushMarquee() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const leftX = useTransform(scrollYProgress, [0, 0.28], ['-100vw', '5vw']);
  const rightX = useTransform(scrollYProgress, [0, 0.28], ['100vw', '-5vw']);

  return (
    <div className="rush-marquee" aria-hidden="true">
      <motion.div className="rush-marquee-row" style={{ x: reduceMotion ? 0 : leftX }}>
        <span>Exceptional leaders.</span>
      </motion.div>
      <motion.div className="rush-marquee-row rush-marquee-row-reverse" style={{ x: reduceMotion ? 0 : rightX }}>
        <span>Uncommon opportunities.</span>
      </motion.div>
    </div>
  );
}
