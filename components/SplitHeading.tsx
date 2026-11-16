'use client';
import { motion } from 'motion/react';
import { Fragment, type ReactNode } from 'react';

type Part = string | { live: string };

/** Heading whose words rise out of masks, staggered, when it enters view. */
export function SplitHeading({
  parts,
  as = 'h2',
  className = 'h2',
  id,
  delay = 0,
}: {
  parts: Part[];
  as?: 'h1' | 'h2';
  className?: string;
  id?: string;
  delay?: number;
}) {
  const words: { w: string; live: boolean }[] = [];
  parts.forEach((p) => {
    const live = typeof p !== 'string';
    (live ? p.live : p)
      .split(' ')
      .filter(Boolean)
      .forEach((w) => words.push({ w, live }));
  });
  const Tag = as === 'h1' ? motion.h1 : motion.h2;
  const label = words.map((x) => x.w).join(' ');
  return (
    <Tag id={id} className={`split ${className}`} aria-label={label} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }}>
      {words.map((x, i) => (
        <Fragment key={i}>
        <span className="split-mask" aria-hidden="true">
          <motion.span
            className={x.live ? 'live' : undefined}
            variants={{ hidden: { y: '108%' }, show: { y: '0%' } }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.045 }}
          >
            {x.w}
          </motion.span>
        </span>
        {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export function liveText(s: string): ReactNode {
  return <span className="live">{s}</span>;
}
