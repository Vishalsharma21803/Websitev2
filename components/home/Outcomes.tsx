'use client';
import Link from 'next/link';
import { LayoutGroup, motion, useInView, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, useState } from 'react';
import { cases } from '@/lib/work';
import { Arrow } from '../Arrow';
import { Reveal } from '../Reveal';
import { CaseDrawing } from './CaseDrawing';
import { SplitHeading } from '../SplitHeading';
import { CountUp } from '../CountUp';

export function Outcomes({ heading = 'Outcomes first. Engineering underneath.' }: { heading?: string }) {
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 15%', 'end end'] });
  return (
    <section className="outcomes section" aria-labelledby="out-h">
      <div className="wrap">
        <div className="sec-head">
          <SplitHeading id="out-h" parts={[heading]} />
          <Reveal delay={0.1}>
            <p className="lead">Every case reads two ways. Switch any card to see what a business owner cares about, or what an engineer would ask.</p>
          </Reveal>
        </div>
        <div className="oc-list" ref={list}>
          {cases.map((c, i) => (
            <div className="oc-slot" key={c.slug} style={{ ['--k' as string]: i }}>
              <StackScale p={scrollYProgress} i={i} n={cases.length}>
                <OutcomeCard c={c} i={i} />
              </StackScale>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Earlier cards ease back as later ones stack over them. */
function StackScale({ p, i, n, children }: { p: MotionValue<number>; i: number; n: number; children: React.ReactNode }) {
  const start = i / n;
  const scale = useTransform(p, [start, 1], [1, 1 - (n - 1 - i) * 0.045]);
  const y = useTransform(p, [start, 1], [0, -(n - 1 - i) * 10]);
  return (
    <motion.div style={{ scale, y, transformOrigin: '50% 0%' }} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function OutcomeCard({ c, i }: { c: (typeof cases)[number]; i: number }) {
  const [view, setView] = useState<'biz' | 'eng'>('biz');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });
  return (
    <article ref={ref} className={`oc sheet ${inView ? 'is-in' : ''}`}>
      <span className="ticks" aria-hidden="true" />
      <div className="oc-art">
        <CaseDrawing slug={c.slug} />
        <p className="mono oc-fig">Case {String(i + 1).padStart(2, '0')} · {c.client}</p>
      </div>
      <div className="oc-body">
        <div className="oc-top">
          <h3 className="oc-title">{c.title}</h3>
          <LayoutGroup id={`oc-${c.slug}`}>
            <div className="seg" role="tablist" aria-label={`${c.title} view`}>
              {(['biz', 'eng'] as const).map((v) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className="seg-btn">
                  {view === v && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  <span>{v === 'biz' ? 'For business' : 'For engineers'}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <div className="oc-views">
          <motion.div
            className="oc-view"
            animate={{ opacity: view === 'biz' ? 1 : 0, y: view === 'biz' ? 0 : 10, filter: view === 'biz' ? 'blur(0px)' : 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden={view !== 'biz'}
            style={{ pointerEvents: view === 'biz' ? 'auto' : 'none' }}
          >
            <p className="oc-shift">
              {c.shift[0]} <Arrow /> <span className="live">{c.shift[1]}</span>
            </p>
            <p className="muted">{c.summary}</p>
            <ul className="oc-metrics">
              {c.metrics.map((m) => (
                <li key={m.label}>
                  <CountUp className="num" value={m.value} />
                  {m.label}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="oc-view"
            animate={{ opacity: view === 'eng' ? 1 : 0, y: view === 'eng' ? 0 : 10, filter: view === 'eng' ? 'blur(0px)' : 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden={view !== 'eng'}
            style={{ pointerEvents: view === 'eng' ? 'auto' : 'none' }}
          >
            <dl className="oc-dl">
              <div>
                <dt className="mono">Problem</dt>
                <dd>{c.problem}</dd>
              </div>
              <div>
                <dt className="mono">Built</dt>
                <dd>{c.built}</dd>
              </div>
              <div>
                <dt className="mono">Complexity</dt>
                <dd>{c.complexity}</dd>
              </div>
            </dl>
            {c.stack && (
              <ul className="oc-stack">
                {c.stack.slice(0, 8).map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
        <Link className="btn btn--ghost btn--sm oc-link" href={`/work/${c.slug}/`}>
          <Arrow />
          Read the case study
        </Link>
      </div>
    </article>
  );
}
