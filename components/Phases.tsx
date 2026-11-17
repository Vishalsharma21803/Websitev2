'use client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { phases, engagementModels } from '@/lib/services';
import { Reveal } from './Reveal';
import { SplitHeading } from './SplitHeading';
import { Sketch } from './Sketch';

const ease = [0.16, 1, 0.3, 1] as const;
const kinds = ['agent', 'web', 'flow'] as const;

/**
 * The three-phase arc as three stations on one line. Every phase and service is visible at once;
 * a packet travels the rail on its own and each station lights up as the packet stops at it.
 * The loop starts once the rail has drawn in (CSS holds it until `.is-run`).
 */
export function Phases({ withModels = true }: { withModels?: boolean }) {
  const [run, setRun] = useState(false);
  return (
    <section className="ln section" aria-labelledby="ph-h">
      <div className="wrap">
        <div className="sec-head">
          <SplitHeading id="ph-h" parts={['From AI strategy to', { live: 'production-grade software.' }]} />
          <Reveal delay={0.1}>
            <p className="lead">One arc, three phases. Join at the first, or bring us in at the third: the standard does not change.</p>
          </Reveal>
        </div>

        <motion.div className={`ln-line ${run ? 'is-run' : ''}`} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
          <div className="ln-rail" aria-hidden="true">
            <motion.span
              className="ln-rail-draw"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              onAnimationComplete={(def) => def === 'show' && setRun(true)}
            />
            <span className="ln-packet" />
            {phases.map((_, k) => (
              <span key={k} className="ln-station" style={{ left: `${(k + 0.5) * (100 / phases.length)}%` }}>
                <i />
              </span>
            ))}
          </div>

          <ol className="ln-cards">
            {phases.map((p, k) => (
              <motion.li
                key={p.name}
                className="ln-card sheet"
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.9, delay: 0.3 + k * 0.15, ease }}
              >
                <span className="ticks" aria-hidden="true" />
                <div className="ln-top">
                  <span className="mono num ln-k">Phase {k + 1}</span>
                  <span className="ln-art" aria-hidden="true">
                    <Sketch kind={kinds[k]} />
                  </span>
                </div>
                <h3 className="ln-name">{p.name}</h3>
                <p className="ln-tag">{p.tagline}</p>
                <ul className="ln-items">
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {withModels && (
          <div className="models">
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
                      transition={{ duration: 0.7, delay: 0.3 + j * 0.12, ease }}
                    />
                  ))}
                </span>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
