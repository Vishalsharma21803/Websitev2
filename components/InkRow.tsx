'use client';
import { useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';

/** Marks its child row as live while it sits in the middle of the viewport. */
export function InkRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { margin: '-40% 0px -40% 0px' });
  return (
    <div ref={ref} className={`inkrow ${live ? 'is-live' : ''}`}>
      {children}
    </div>
  );
}
