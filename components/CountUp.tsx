'use client';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

/** Counts the leading number of a value like "85%", "99%+", "10×" or "40+" when it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  useEffect(() => {
    if (!inView || !m || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num);
    const dec = num.includes('.') ? num.split('.')[1].length : 0;
    const el = ref.current;
    const c = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${pre}${v.toFixed(dec)}${post}`),
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
