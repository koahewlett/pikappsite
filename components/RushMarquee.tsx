'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const marqueePhrase = 'Exceptional leaders. Uncommon opportunities.';
const topWords = [marqueePhrase, marqueePhrase, marqueePhrase];
const bottomWords = [marqueePhrase, marqueePhrase, marqueePhrase];

function MarqueeWords({ words }: { words: string[] }) {
  const track = [...words, ...words];

  return (
    <>
      {track.map((word, index) => (
        <span key={`${word}-${index}`}>
          {word}
        </span>
      ))}
    </>
  );
}

export function RushMarquee() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const leftX = useTransform(scrollYProgress, [0, 0.28], ['-14%', '5%']);
  const rightX = useTransform(scrollYProgress, [0, 0.28], ['14%', '-5%']);

  return (
    <div className="rush-marquee" aria-hidden="true">
      <motion.div className="rush-marquee-row" style={{ x: reduceMotion ? 0 : leftX }}>
        <MarqueeWords words={topWords} />
      </motion.div>
      <motion.div className="rush-marquee-row rush-marquee-row-reverse" style={{ x: reduceMotion ? 0 : rightX }}>
        <MarqueeWords words={bottomWords} />
      </motion.div>
    </div>
  );
}
