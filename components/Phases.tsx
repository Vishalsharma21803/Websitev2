'use client';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { phases, engagementModels } from '@/lib/services';
import { Reveal } from './Reveal';
import { SplitHeading } from './SplitHeading';

/** The three-phase arc. On desktop it pins and advances with scroll (v1's phase tracker); elsewhere it stacks. */
export function Phases({ withModels = true }: { withModels?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [pinned, setPinned] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px) and (prefers-reduced-motion: no-preference)');
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return;
    setI(Math.min(phases.length - 1, Math.floor(v * phases.length * 0.999)));
  });

  const go = (k: number) => {
    if (!pinned || !ref.current) return setI(k);
    const r = ref.current.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const y = window.scrollY + r.top + span * ((k + 0.5) / phases.length);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="phases" aria-labelledby="ph-h">
      <div ref={ref} className={`ph-scroll ${pinned ? 'is-pinned' : ''}`}>
        <div className="ph-stick">
          <div className="wrap">
            <div className="sec-head">
              <SplitHeading id="ph-h" parts={['From AI strategy to', { live: 'production-grade software.' }]} />
              <Reveal delay={0.1}>
                <p className="lead">One arc, three phases. Join at the first, or bring us in at the third: the standard does not change.</p>
              </Reveal>
            </div>
            <div className="ph-rail" role="tablist" aria-label="Phases">
              {pinned ? (
                <motion.span className="ph-fill" style={{ scaleX: bar }} aria-hidden="true" />
              ) : (
                <motion.span className="ph-fill" initial={false} animate={{ scaleX: (i + 1) / phases.length }} aria-hidden="true" />
              )}
              {phases.map((p, k) => (
                <button key={p.name} role="tab" type="button" aria-selected={i === k} className={`ph-tab ${k <= i ? 'is-on' : ''}`} onClick={() => go(k)}>
                  <span className="mono num">Phase {k + 1}</span>
                  <span className="ph-name">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="ph-panel sheet" role="tabpanel">
              <span className="ticks" aria-hidden="true" />
              <motion.div key={i} initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="ph-inner">
                <div>
                  <p className="ph-tag">{phases[i].tagline}</p>
                  <p className="mono ph-count num">
                    {String(i + 1).padStart(2, '0')} / {String(phases.length).padStart(2, '0')}
                  </p>
                </div>
                <ul className="ph-items">
                  {phases[i].items.map((it, k) => (
                    <motion.li key={it} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 + k * 0.035, ease: [0.16, 1, 0.3, 1] }}>
                      {it}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {withModels && (
        <div className="wrap models">
          {engagementModels.map((m, k) => (
            <Reveal key={m.name} delay={k * 0.08} className="model">
              <p className="mono">{m.who}</p>
              <h3 className="h3">{m.name}</h3>
              <p className="muted">{m.body}</p>
              <span className="model-meter" aria-hidden="true">
                {[0, 1, 2].map((j) => (
                  <motion.i
                    key={j}
                    className={j <= k ? 'on' : ''}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 + j * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </span>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
