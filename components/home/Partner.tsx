'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Arrow } from '../Arrow';
import { Reveal } from '../Reveal';
import { SplitHeading } from '../SplitHeading';

const ease = [0.16, 1, 0.3, 1] as const;

export function Partner() {
  return (
    <section className="partner section" aria-labelledby="partner-h">
      <div className="wrap partner-grid">
        <div>
          <SplitHeading id="partner-h" parts={['For consultants, CTOs and agencies']} />
          <Reveal delay={0.1}>
            <p className="lead partner-lead">Bring Sifars in when your client’s project needs deeper engineering than your internal team can provide.</p>
            <Link href="/contact/" className="btn">
              <Arrow />
              Discuss a partner build
            </Link>
          </Reveal>
        </div>
        <motion.div className="eq" initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
          <motion.div className="eq-col sheet" variants={{ hidden: { opacity: 0, x: -60, rotate: -4 }, show: { opacity: 1, x: 0, rotate: 0 } }} transition={{ duration: 1, ease }}>
            <p className="mono">You bring</p>
            <ul>
              {['Client context', 'The relationship', 'The problem brief'].map((x, i) => (
                <motion.li key={x} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease }}>
                  {x}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.span className="eq-op" aria-hidden="true" variants={{ hidden: { scale: 0, rotate: -90 }, show: { scale: 1, rotate: 0 } }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 }}>
            +
          </motion.span>
          <motion.div className="eq-col sheet eq-col--live" variants={{ hidden: { opacity: 0, x: 60, rotate: 4 }, show: { opacity: 1, x: 0, rotate: 0 } }} transition={{ duration: 1, ease, delay: 0.1 }}>
            <p className="mono">Sifars brings</p>
            <ul>
              {['Architecture', 'Engineering capacity', 'AI + integrations'].map((x, i) => (
                <motion.li key={x} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease }}>
                  {x}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.p className="eq-res" variants={{ hidden: { opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0 round 999px)' }, show: { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0 round 999px)' } }} transition={{ duration: 1.1, ease, delay: 0.85 }}>
            <span className="eq-op" aria-hidden="true">
              =
            </span>
            One production-grade build, shipped under your name.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
