'use client';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Runs on every route change: content settles in while a blue scan line sweeps the page. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        className="scanline"
        aria-hidden="true"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: '100vh', opacity: [1, 1, 0] }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      >
        {children}
      </motion.div>
    </>
  );
}
