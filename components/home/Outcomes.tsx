'use client';
import Link from 'next/link';
import { LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';
import { cases } from '@/lib/work';
import { Arrow } from '../Arrow';
import { Reveal } from '../Reveal';
import { CaseDrawing } from './CaseDrawing';

export function Outcomes({ heading = 'Outcomes first. Engineering underneath.' }: { heading?: string }) {
  return (
    <section className="outcomes section" aria-labelledby="out-h">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <h2 id="out-h" className="h2">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">Every case reads two ways. Switch any card to see what a business owner cares about, or what an engineer would ask.</p>
          </Reveal>
        </div>
        <div className="oc-list">
          {cases.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <OutcomeCard c={c} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutcomeCard({ c, i }: { c: (typeof cases)[number]; i: number }) {
  const [view, setView] = useState<'biz' | 'eng'>('biz');
  return (
    <article className="oc sheet">
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
                  <span className="num">{m.value}</span>
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
