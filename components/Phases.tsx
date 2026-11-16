'use client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { phases, engagementModels } from '@/lib/services';
import { Reveal } from './Reveal';

/** The three-phase arc, as a horizontal timeline you can step through. */
export function Phases({ withModels = true }: { withModels?: boolean }) {
  const [i, setI] = useState(1);
  return (
    <section className="phases section" aria-labelledby="ph-h">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <h2 id="ph-h" className="h2">
              From AI strategy to production-grade software.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">One arc, three phases. Join at the first, or bring us in at the third: the standard does not change.</p>
          </Reveal>
        </div>
        <div className="ph-rail" role="tablist" aria-label="Phases">
          <motion.span className="ph-fill" animate={{ width: `${((i + 1) / phases.length) * 100}%` }} transition={{ type: 'spring', stiffness: 160, damping: 26 }} aria-hidden="true" />
          {phases.map((p, k) => (
            <button key={p.name} role="tab" type="button" aria-selected={i === k} className={`ph-tab ${k <= i ? 'is-on' : ''}`} onClick={() => setI(k)}>
              <span className="mono num">Phase {k + 1}</span>
              <span className="ph-name">{p.name}</span>
            </button>
          ))}
        </div>
        <div className="ph-panel sheet" role="tabpanel">
          <span className="ticks" aria-hidden="true" />
          <motion.div key={i} initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="ph-inner">
            <p className="ph-tag">{phases[i].tagline}</p>
            <ul className="ph-items">
              {phases[i].items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.div>
        </div>
        {withModels && (
          <div className="models">
            {engagementModels.map((m, k) => (
              <Reveal key={m.name} delay={k * 0.06} className="model">
                <p className="mono">{m.who}</p>
                <h3 className="h3">{m.name}</h3>
                <p className="muted">{m.body}</p>
                <span className="model-meter" aria-hidden="true">
                  {[0, 1, 2].map((j) => (
                    <i key={j} className={j <= k ? 'on' : ''} />
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
