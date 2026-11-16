'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { testimonials } from '@/lib/approach';
import { Arrow } from '../Arrow';

export function Quotes() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setI((x) => (x + 1) % n), 7000);
    return () => clearTimeout(id);
  }, [i, paused, n]);
  const t = testimonials[i];
  return (
    <section className="quotes section" aria-labelledby="q-h" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap q-grid">
        <div>
          <h2 id="q-h" className="h2">
            Great work speaks for itself
          </h2>
          <div className="q-ctrl">
            <button type="button" className="q-btn" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous testimonial">
              <Arrow dir="left" />
            </button>
            <button type="button" className="q-btn" onClick={() => setI((i + 1) % n)} aria-label="Next testimonial">
              <Arrow />
            </button>
            <span className="mono num q-count">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
          <div className="q-bar" aria-hidden="true">
            <motion.i key={`${i}-${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused ? 0.2 : 7, ease: 'linear' }} />
          </div>
        </div>
        <div className="q-stage" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote>
                <p>“{t.text}”</p>
              </blockquote>
              <figcaption>
                <span className="q-mono" aria-hidden="true">
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(-2)
                    .join('')}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <br />
                  <span className="muted">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
