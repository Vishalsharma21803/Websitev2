'use client';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { productionLayer } from '@/lib/approach';
import { Reveal } from '../Reveal';
import { SplitHeading } from '../SplitHeading';

const ease = [0.16, 1, 0.3, 1] as const;
const N = productionLayer.length;

/* Ring of six arcs around the core, one per part of the Production Layer. */
const CX = 170;
const CY = 170;
const R = 118;
function arc(i: number) {
  const gap = 0.07;
  const a0 = (i / N) * Math.PI * 2 - Math.PI / 2 + gap;
  const a1 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2 - gap;
  const p = (a: number) => `${(CX + R * Math.cos(a)).toFixed(1)} ${(CY + R * Math.sin(a)).toFixed(1)}`;
  return `M${p(a0)}A${R} ${R} 0 0 1 ${p(a1)}`;
}
function tick(i: number) {
  const a = ((i + 0.5) / N) * Math.PI * 2 - Math.PI / 2;
  const r0 = R + 12;
  const r1 = R + 26;
  return `M${(CX + r0 * Math.cos(a)).toFixed(1)} ${(CY + r0 * Math.sin(a)).toFixed(1)}L${(CX + r1 * Math.cos(a)).toFixed(1)} ${(CY + r1 * Math.sin(a)).toFixed(1)}`;
}

/** The Sifars Production Layer as a guided sequence: each part lights up in turn and completes the ring. */
export function Schematic() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(N - 1);
  const [pinned, setPinned] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1001px) and (prefers-reduced-motion: no-preference)');
    const set = () => {
      setPinned(mq.matches);
      if (!mq.matches) setActive(N - 1);
    };
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return;
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N * 0.999))));
  });

  useEffect(() => {
    if (pinned) setActive(Math.min(N - 1, Math.max(0, Math.floor(scrollYProgress.get() * N * 0.999))));
  }, [pinned, scrollYProgress]);

  const left = productionLayer.slice(0, 3);
  const right = productionLayer.slice(3);
  const cur = productionLayer[active];

  const go = (k: number) => {
    if (!pinned || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const y = window.scrollY + r.top + span * ((k + 0.5) / N);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const item = (i: number, title: string, body: string) => {
    const state = i < active ? 'done' : i === active ? 'now' : 'next';
    return (
      <li key={title} className={`callout is-${state}`}>
        <button type="button" className="callout-btn" onClick={() => go(i)} aria-current={state === 'now' ? 'step' : undefined}>
          <span className="callout-n mono num">{String(i + 1).padStart(2, '0')}</span>
          <span className="callout-txt">
            <span className="callout-t">{title}</span>
            <span className="callout-b">{body}</span>
          </span>
          <span className="callout-lead" aria-hidden="true" />
        </button>
      </li>
    );
  };

  return (
    <section className="schem" aria-labelledby="schem-h">
      <div ref={ref} className={`schem-scroll ${pinned ? 'is-pinned' : ''}`}>
        <div className="schem-stick">
          <div className="wrap">
            <div className="sec-head">
              <SplitHeading id="schem-h" parts={['Production-ready means more than', { live: '“it works in a demo.”' }]} />
              <Reveal delay={0.1}>
                <p className="lead">The Sifars Production Layer covers the six parts that usually break later, mapped before the build starts.</p>
              </Reveal>
            </div>
            <div className="schem-grid">
              <ol className="schem-col">
                {left.map((l, i) => item(i, l.title, l.body))}
              </ol>
              <div className="schem-core" aria-hidden="true">
                <svg viewBox="0 0 340 340">
                  <circle cx={CX} cy={CY} r={R + 40} className="schem-outer" />
                  {productionLayer.map((_, i) => (
                    <g key={i}>
                      <path d={arc(i)} className="schem-arc-base" />
                      <motion.path
                        d={arc(i)}
                        className="schem-arc"
                        initial={false}
                        animate={{ pathLength: i <= active ? 1 : 0, opacity: i <= active ? 1 : 0 }}
                        transition={{ duration: 0.8, ease }}
                      />
                      <path d={tick(i)} className={`schem-tick ${i <= active ? 'on' : ''}`} />
                    </g>
                  ))}
                  <motion.circle
                    cx={CX}
                    cy={CY}
                    r={70}
                    className="schem-hub"
                    animate={{ scale: active === N - 1 ? 1 : 0.94 }}
                    transition={{ duration: 0.8, ease }}
                    style={{ transformOrigin: `${CX}px ${CY}px` }}
                  />
                </svg>
                <div className="schem-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={active}
                      className="schem-center-in"
                      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <span className="mono num">
                        {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                      </span>
                      <span className="schem-center-t">{active === N - 1 ? 'In production' : cur.title}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <ol className="schem-col schem-col--r" start={4}>
                {right.map((l, i) => item(i + 3, l.title, l.body))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
