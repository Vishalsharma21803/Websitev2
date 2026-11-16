'use client';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react';
import { useRef } from 'react';
import { clients, industries } from '@/lib/site';

/** Client names drift on their own and speed up (or reverse) with the visitor's scroll. */
export function Marquee() {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  useAnimationFrame((_, delta) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let move = dir.current * -1.6 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += move * Math.abs(f);
    base.set(base.get() + move);
  });
  const row = [...clients, ...clients];
  return (
    <section className="mq" aria-label="Clients and industries">
      <div className="wrap mq-head">
        <p className="mq-title">Built for teams at</p>
        <p className="mono mq-ind">{industries.join(' · ')}</p>
      </div>
      <div className="mq-track-wrap">
        <motion.ul className="mq-track" style={{ x }}>
          {row.map((c, i) => (
            <li key={i} aria-hidden={i >= clients.length ? true : undefined}>
              {c}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
