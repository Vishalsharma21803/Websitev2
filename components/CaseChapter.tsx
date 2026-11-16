'use client';
import { motion, useScroll, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { Reveal } from './Reveal';

/** Case-study chapter: a sticky label whose rule fills as you read the chapter. */
export function CaseChapter({ k, title, children }: { k: string; title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <section ref={ref} className="cs-ch wrap">
      <div className="cs-k">
        <h2 className="mono">{k}</h2>
        <span className="cs-k-rule" aria-hidden="true">
          <motion.i style={{ scaleX: p }} />
        </span>
      </div>
      <div className="cs-body">
        <Reveal>
          <p className="cs-lede">{title}</p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
