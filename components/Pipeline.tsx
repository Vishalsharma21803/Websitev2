'use client';
import { motion } from 'motion/react';

/** A case pipeline drawn as a rail; a packet travels it and each step lights as it passes. */
export function Pipeline({ steps }: { steps: string[] }) {
  return (
    <motion.ol className="pipe" aria-label="Pipeline" initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
      <motion.span className="pipe-rail" aria-hidden="true" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}>
        <i className="pipe-packet" style={{ animationDuration: `${steps.length * 1.1}s` }} />
      </motion.span>
      {steps.map((s, i) => (
        <motion.li
          key={s}
          style={{ ['--n' as string]: i, ['--total' as string]: steps.length }}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="pipe-dot mono num">{i + 1}</span>
          <span className="pipe-name">{s}</span>
        </motion.li>
      ))}
    </motion.ol>
  );
}
