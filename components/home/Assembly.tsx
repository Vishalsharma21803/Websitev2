'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { scene, setStatus } from '@/lib/store';
import { deliverables, practices } from '@/lib/services';
import { Arrow } from '../Arrow';
import { BlueprintPoster } from './BlueprintPoster';
import { HeroSheet } from './HeroSheet';

const AssemblyCanvas = dynamic(() => import('../three/Scene'), { ssr: false });

const STAGES = [
  { label: 'Drafting the blueprint', live: false },
  { label: 'Annotating every part', live: false },
  { label: 'Building it', live: false },
  { label: 'Running in production', live: true },
  ...deliverables.map((d) => ({ label: d.title, live: true })),
];

const CHAPTERS = [
  { word: 'Draft', line: 'Every engagement starts as a drawing: the users, the data, the edge cases.' },
  { word: 'Annotate', line: 'Each part gets an owner, a stack and a test before any code is written.' },
  { word: 'Build', line: 'Senior engineers build it: interface, logic, integrations and infrastructure.' },
  { word: 'Run', line: 'Then it runs. Monitored, supported and improved under real load.' },
];

function stageFor(p: number) {
  if (p < 0.09) return 0;
  if (p < 0.2) return 1;
  if (p < 0.32) return 2;
  if (p < 0.44) return 3;
  return 4 + Math.min(3, Math.floor(((p - 0.44) / 0.56) * 4));
}

const ease = [0.16, 1, 0.3, 1] as const;

export function Assembly() {
  const wrap = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    try {
      const c = document.createElement('canvas');
      setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      scene.progress = p;
      const s = stageFor(p);
      const inside = r.bottom > window.innerHeight * 0.35;
      const key = inside ? s : -1;
      if (key !== last) {
        last = key;
        if (inside) {
          setStage(s);
          setStatus({ label: STAGES[s].label, live: STAGES[s].live, step: s + 1, steps: STAGES.length });
        } else {
          setStatus({ label: '', live: false, step: 0, steps: 0 });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      scene.progress = 0;
      setStatus({ label: '', live: false, step: 0, steps: 0 });
    };
  }, []);

  const chapter = stage >= 1 && stage <= 3 ? stage : -1;
  const focus = stage >= 4 ? stage - 4 : -1;
  const d = focus >= 0 ? deliverables[focus] : null;
  const prac = d ? practices.find((p) => p.slug === d.slug) : null;

  return (
    <section ref={wrap} className={`assembly ${reduced ? 'is-static' : ''}`} aria-label="From blueprint to production">
      <div className="asm-stage">
        <div className="asm-canvas">
          {webgl ? <AssemblyCanvas active={active} reduced={reduced} /> : <BlueprintPoster />}
        </div>

        <HeroSheet show={stage === 0} />
        <div className="asm-overlay wrap">
          {/* Hero */}
          <motion.div
            className="asm-hero"
            animate={{ opacity: stage === 0 ? 1 : 0, y: stage === 0 ? 0 : -40, filter: stage === 0 ? 'blur(0px)' : 'blur(6px)' }}
            transition={{ duration: 0.9, ease }}
            aria-hidden={stage !== 0}
            style={{ pointerEvents: stage === 0 ? 'auto' : 'none' }}
          >
            <h1 className="display">
              <motion.span className="hl" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.15 }}>
                From blueprint
              </motion.span>
              <motion.span className="hl" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.27 }}>
                to <span className="hl-live">production.</span>
              </motion.span>
            </h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }}>
              Sifars designs and engineers websites, mobile apps, AI agents and AI automation for businesses, and stays accountable once they run.
            </motion.p>
            <motion.div className="asm-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.7 }}>
              <Link href="/contact/" className="btn">
                <Arrow />
                Book a strategy call
              </Link>
              <Link href="/work/" className="link">
                See the work <Arrow />
              </Link>
            </motion.div>
            <motion.ul className="asm-facts mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
              <li>12+ years shipping to production</li>
              <li>Mohali, India · clients worldwide</li>
              <li>NDA on every enquiry</li>
            </motion.ul>
            <motion.div className="asm-scroll mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              <span className="asm-scroll-line" aria-hidden="true" />
              Scroll to build it
            </motion.div>
          </motion.div>

          {/* Chapters */}
          <div className="asm-chapters" aria-hidden={chapter < 0}>
            <div className="asm-chapter-box">
            <AnimatePresence>
              {chapter > 0 && (
                <motion.div
                  key={chapter}
                  className="asm-chapter"
                  initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease, delay: 0.12 } }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(6px)', transition: { duration: 0.5, ease } }}
                >
                  <p className={`asm-word ${chapter === 3 ? 'is-live' : ''}`}>{CHAPTERS[chapter].word}.</p>
                  <p className="asm-line">{CHAPTERS[chapter].line}</p>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
            <ol className={`asm-legend mono ${chapter > 0 ? 'is-on' : ''}`}>
              {CHAPTERS.map((c, i) => (
                <li key={c.word} className={i < chapter ? 'done' : i === chapter ? 'now' : ''}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  {c.word}
                </li>
              ))}
            </ol>
          </div>

          {/* Deliverables */}
          <AnimatePresence>
            {d && prac && (
              <motion.article
                key={d.key}
                className="asm-focus sheet"
                initial={{ opacity: 0, y: 36, scale: 0.97, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.85, ease, delay: 0.15 } }}
                exit={{ opacity: 0, y: -28, scale: 0.98, filter: 'blur(6px)', transition: { duration: 0.45, ease } }}
              >
                <span className="ticks" aria-hidden="true" />
                <p className="mono asm-fig">
                  Fig. {focus + 1} / 4
                </p>
                <h2 className="h2">{d.title}</h2>
                <p className="asm-out">{prac.outcome}</p>
                <div className="asm-under">
                  <p className="mono">Under the hood</p>
                  <p>{prac.under}</p>
                </div>
                <Link className="link" href={`/services/${prac.slug}/`}>
                  {d.cta} <Arrow />
                </Link>
                <div className="asm-dots" aria-hidden="true">
                  {deliverables.map((x, i) => (
                    <i key={x.key} className={i === focus ? 'on' : ''} />
                  ))}
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Static, accessible list of the four deliverables (also the reduced-motion view). */}
      <div className="asm-static wrap">
        <ul>
          {deliverables.map((x) => {
            const p = practices.find((pp) => pp.slug === x.slug)!;
            return (
              <li key={x.key}>
                <h2 className="h3">{x.title}</h2>
                <p className="muted">{p.outcome}</p>
                <p className="mono">{p.under}</p>
                <Link className="link" href={`/services/${p.slug}/`}>
                  Explore <Arrow />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
