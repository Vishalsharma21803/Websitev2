'use client';
import { motion } from 'motion/react';
import { trustControls, trustFlow } from '@/lib/approach';
import { Reveal } from '../Reveal';
import { SplitHeading } from '../SplitHeading';

const ease = [0.16, 1, 0.3, 1] as const;

export function TrustLine() {
  return (
    <section className="trust section" aria-labelledby="trust-h">
      <div className="wrap">
        <motion.div className="trust-sheet sheet" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1, ease }}>
          <span className="ticks" aria-hidden="true" />
          <div className="sec-head">
            <SplitHeading id="trust-h" parts={['AI needs a', { live: 'trust layer' }, 'before it enters your business.']} />
            <Reveal delay={0.1}>
              <p className="lead">AI systems should not freely act inside real operations without access limits, validation, human oversight, and monitoring.</p>
            </Reveal>
          </div>
          <motion.div className="tl" initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
            <ol className="tl-nodes" aria-label="How an AI action is controlled">
              {trustFlow.map((n, i) => (
                <motion.li
                  key={n}
                  className={n === 'Human review' ? 'is-human' : ''}
                  style={{ ['--n' as string]: i }}
                  variants={{ hidden: { opacity: 0, y: 18, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
                  transition={{ duration: 0.7, delay: 0.35 + i * 0.14, ease }}
                >
                  <span className="tl-dot mono num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="tl-name">{n}</span>
                </motion.li>
              ))}
            </ol>
            <motion.span
              className="tl-rail"
              aria-hidden="true"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: 'left' }}
            >
              <i className="tl-packet" />
            </motion.span>
          </motion.div>
          <ul className="tl-controls">
            {trustControls.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 3) * 0.08}>
                <h3>{c.title}</h3>
                <p className="muted">{c.body}</p>
              </Reveal>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
