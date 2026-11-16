'use client';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { productionLayer } from '@/lib/approach';
import { Reveal } from '../Reveal';

/** The Sifars Production Layer as a technical drawing: six callouts draw in as you scroll. */
export function Schematic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const left = productionLayer.slice(0, 3);
  const right = productionLayer.slice(3);
  return (
    <section ref={ref} className="schem section" aria-labelledby="schem-h">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <h2 id="schem-h" className="h2">
              Production-ready means more than “it works in a demo.”
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">The Sifars Production Layer covers the six parts that usually break later, mapped before the build starts.</p>
          </Reveal>
        </div>
        <div className="schem-grid">
          <ol className="schem-col">
            {left.map((l, i) => (
              <Callout key={l.title} n={i + 1} title={l.title} body={l.body} p={p} at={i / 6} />
            ))}
          </ol>
          <div className="schem-core sheet" aria-hidden="true">
            <span className="ticks" />
            <svg viewBox="0 0 320 320">
              <g fill="none" stroke="currentColor" strokeWidth="1.3">
                <motion.rect x="40" y="40" width="240" height="240" rx="14" style={{ pathLength: useTransform(p, [0, 0.4], [0, 1]) }} />
                <motion.path d="M40 100h240M100 40v240" style={{ pathLength: useTransform(p, [0.2, 0.6], [0, 1]) }} opacity="0.5" />
                <motion.circle cx="190" cy="190" r="46" style={{ pathLength: useTransform(p, [0.35, 0.8], [0, 1]) }} className="schem-live" />
                <motion.path d="M190 144v-30M190 236v30M144 190h-30M236 190h30" style={{ pathLength: useTransform(p, [0.5, 0.9], [0, 1]) }} className="schem-live" />
              </g>
              <text x="58" y="78" className="schem-t">
                Your system
              </text>
              <text x="190" y="195" textAnchor="middle" className="schem-t schem-t--live">
                in production
              </text>
            </svg>
          </div>
          <ol className="schem-col schem-col--r" start={4}>
            {right.map((l, i) => (
              <Callout key={l.title} n={i + 4} title={l.title} body={l.body} p={p} at={(i + 3) / 6} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Callout({ n, title, body, p, at }: { n: number; title: string; body: string; p: ReturnType<typeof useSpring>; at: number }) {
  const o = useTransform(p, [at * 0.8, at * 0.8 + 0.18], [0.25, 1]);
  const w = useTransform(p, [at * 0.8, at * 0.8 + 0.22], ['0%', '100%']);
  return (
    <motion.li className="callout" style={{ opacity: o }}>
      <span className="mono num callout-n">{String(n).padStart(2, '0')}</span>
      <div>
        <h3>{title}</h3>
        <p className="muted">{body}</p>
      </div>
      <motion.span className="callout-lead" style={{ width: w }} aria-hidden="true" />
    </motion.li>
  );
}
