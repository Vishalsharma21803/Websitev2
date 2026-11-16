'use client';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

const WORDS = ['Websites', 'Mobile apps', 'AI agents', 'Automation'];

/** Oversized line that slides and inks in with scroll (carried over from v1's kinetic band). */
export function KineticBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const x = useTransform(p, [0, 1], ['6vw', 'calc(-100% + 88vw)']);
  const clip = useTransform(p, [0.04, 0.92], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const line = (ink: boolean) => (
    <p className={`kb-line ${ink ? 'kb-ink' : 'kb-base'}`}>
      {WORDS.map((w, i) => (
        <span key={w} className="kb-word">
          {w}
          {i < WORDS.length - 1 && (
            <svg className="kb-sep" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M30 4v52M4 30h52" stroke="currentColor" strokeWidth="3" />
            </svg>
          )}
        </span>
      ))}
    </p>
  );
  return (
    <section ref={ref} className="kb" aria-label={WORDS.join(', ')}>
      <div className="kb-stick">
        <motion.div className="kb-row" style={{ x }} aria-hidden="true">
          {line(false)}
          <motion.div className="kb-inkwrap" style={{ clipPath: clip }}>
            {line(true)}
          </motion.div>
        </motion.div>
        <p className="kb-cap mono">One engineering team. Four ways to ship.</p>
      </div>
    </section>
  );
}
