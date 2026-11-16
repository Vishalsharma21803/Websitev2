'use client';
import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type Props = HTMLMotionProps<'div'> & { delay?: number; children: ReactNode; as?: 'div' | 'li' | 'section' };

/** Fades content up once it enters view. Content is visible without JS (SSR renders final state for crawlers via noscript-safe initial). */
export function Reveal({ delay = 0, children, as = 'div', ...rest }: Props) {
  const M = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div;
  return (
    <M
      initial={{ opacity: 0, y: 26, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      {...(rest as object)}
    >
      {children}
    </M>
  );
}
