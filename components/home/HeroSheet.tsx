'use client';
import { motion } from 'motion/react';
import { Arrow } from '../Arrow';

const ease = [0.65, 0, 0.35, 1] as const;

/** Drafting-sheet frame for the opening viewport: registration marks, a border and a title block draw in. */
export function HeroSheet({ show }: { show: boolean }) {
  const corner = (d: string, i: number) => (
    <motion.path
      d={d}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.1, delay: 0.25 + i * 0.08, ease }}
    />
  );
  return (
    <motion.div className="sheetframe" aria-hidden="true" animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.8 }}>
      <svg className="sheetframe-svg" preserveAspectRatio="none" viewBox="0 0 1000 1000">
        <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {corner('M0 40V0h40', 0)}
          {corner('M960 0h40v40', 1)}
          {corner('M1000 960v40h-40', 2)}
          {corner('M40 1000H0v-40', 3)}
        </g>
      </svg>
      <span className="reg reg--tl">
        <i />
      </span>
      <span className="reg reg--br">
        <i />
      </span>
      <motion.dl
        className="tblock mono"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <dt>Drawing</dt>
          <dd>Your next system</dd>
        </div>
        <div>
          <dt>Scope</dt>
          <dd>Web · Mobile · Agents · Automation</dd>
        </div>
        <div>
          <dt>Drawn by</dt>
          <dd>Sifars engineering</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            Draft <Arrow className="tblock-arrow" /> <span className="live">production</span>
          </dd>
        </div>
      </motion.dl>
    </motion.div>
  );
}
