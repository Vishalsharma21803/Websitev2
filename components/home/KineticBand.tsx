'use client';
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';

/**
 * v1's kinetic line, carried over: "From demo → to ✦ production." slides across while ink sweeps over it,
 * tied directly to scroll. Short line, so each flick of the wheel visibly moves it.
 */
export function KineticBand() {
  const ref = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const travel = useMotionValue(0);
  const start = useMotionValue(0);
  useEffect(() => {
    const measure = () => {
      const w = row.current?.scrollWidth ?? 0;
      const vw = window.innerWidth;
      start.set(vw * 0.08);
      travel.set(Math.max(0, w - vw * 0.84));
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [start, travel]);
  const x = useTransform(() => start.get() - scrollYProgress.get() * travel.get());
  const clip = useTransform(scrollYProgress, [0.05, 0.9], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const bar = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);

  const line = (inked: boolean) => (
    <p className={`kb-line ${inked ? 'kb-ink' : 'kb-base'}`}>
      <span className="kb-sep">
        <svg viewBox="0 0 40 40">
          <path d="M20 6v28M6 20h28M10.1 10.1l19.8 19.8M29.9 10.1 10.1 29.9" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="kb-word">From demo</span>
      <svg className="kb-squig" viewBox="0 0 220 80">
        <path d="M6 52c20 0 26-36 46-36 24 0 16 44 40 44 18 0 18-24 36-24h82M196 26l14 10-14 10" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="kb-word">to</span>
      <span className="kb-sep">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2.2c.7 5.6 3.6 8.9 9.8 9.8-6.2.9-9.1 4.2-9.8 9.8-.7-5.6-3.6-8.9-9.8-9.8 6.2-.9 9.1-4.2 9.8-9.8Z" />
        </svg>
      </span>
      <span className="kb-word">production.</span>
    </p>
  );

  return (
    <section ref={ref} className="kb" aria-label="From demo to production">
      <div className="kb-stick">
        <div className="kb-row-wrap" aria-hidden="true">
          <motion.div ref={row} className="kb-row" style={{ x }}>
            {line(false)}
            <motion.div className="kb-inkwrap" style={{ clipPath: clip }}>
              {line(true)}
            </motion.div>
          </motion.div>
        </div>
        <div className="wrap kb-foot">
          <p className="kb-out">The simple solution usually stops before the real system begins. We build the part that has to keep working.</p>
          <div className="kb-bar" aria-hidden="true">
            <motion.i style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
