'use client';
import { motion } from 'motion/react';
import { Logo } from './Logo';

/** Full-width Sifars lockup at the foot of every page: it wipes in from the mark outward. */
export function FootMark() {
  return (
    <motion.div
      className="foot-mark"
      aria-hidden="true"
      initial={{ clipPath: 'inset(0 100% 0 0)', y: 30 }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)', y: 0 }}
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
      transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
    >
      <Logo size={200} />
    </motion.div>
  );
}
