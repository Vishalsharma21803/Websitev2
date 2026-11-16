'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { site } from '@/lib/site';
import { Arrow } from '../Arrow';
import { Reveal } from '../Reveal';
import { SplitHeading } from '../SplitHeading';

const ease = [0.16, 1, 0.3, 1] as const;
const rows: [string, React.ReactNode][] = [
  ['Drawn by', 'Sifars engineering'],
  ['Scope', 'Web · Mobile · AI agents · Automation'],
  ['Covered by', 'NDA on every enquiry'],
  ['Budgets', 'From $2,500'],
  [
    'Status',
    <>
      <span className="dot" aria-hidden="true" /> Accepting projects
    </>,
  ],
];

/** Closing call to action, set as the title block of a drawing sheet. A drawn line leads into the button. */
export function Start({ title = 'Start with a blueprint.' }: { title?: string }) {
  return (
    <section className="start" aria-labelledby="start-h">
      <div className="wrap">
        <motion.div className="start-sheet" initial={{ clipPath: 'inset(8% 4% 8% 4% round 30px)', opacity: 0.4 }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 30px)', opacity: 1 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1.3, ease }}>
          <span className="ticks" aria-hidden="true" />
          <svg className="start-trace" viewBox="0 0 600 420" fill="none" aria-hidden="true">
            <motion.path
              d="M560 20c-80 0-90 70-170 70s-110-40-180-40-120 60-60 100 170-20 170 60-120 70-190 70H60v120"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.path d="M44 362l16 18 16-18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.7 }} />
          </svg>
          <SplitHeading id="start-h" className="display start-h" parts={['Start with a', { live: 'blueprint.' }]} />
          <div className="start-grid">
            <Reveal delay={0.15}>
              <p className="lead start-lead">Tell us what has to work, for whom, and with which systems. We come back with questions and a clear view of what it takes to run in production.</p>
              <div className="start-cta">
                <Link href="/contact/" className="btn start-btn">
                  <Arrow />
                  Book a strategy call
                </Link>
                <a className="link" href={`mailto:${site.email.sales}`}>
                  {site.email.sales}
                </a>
              </div>
            </Reveal>
            <motion.table className="titleblock mono" initial="hidden" whileInView="show" viewport={{ once: true }}>
              <caption className="sr-only">Project title block</caption>
              <tbody>
                {rows.map(([k, v], i) => (
                  <motion.tr key={k} variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.6, delay: 0.4 + i * 0.09, ease }}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
