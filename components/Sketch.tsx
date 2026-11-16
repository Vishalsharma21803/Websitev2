'use client';
import { motion } from 'motion/react';

type Kind = 'web' | 'mobile' | 'agent' | 'flow' | 'shield';

const draw = (i: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 1.2, delay: 0.1 + i * 0.08, ease: [0.65, 0, 0.35, 1] as const },
});

/** Line sketches of each deliverable that draw themselves on view; the live part inks blue. */
export function Sketch({ kind, className = '' }: { kind: Kind; className?: string }) {
  return (
    <svg className={`sketch ${className}`} viewBox="0 0 200 140" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'web' && (
          <>
            <motion.rect x="20" y="20" width="160" height="96" rx="6" {...draw(0)} />
            <motion.path d="M20 34h160" {...draw(1)} />
            <motion.path d="M34 50h40M34 62h28M34 74h34" {...draw(2)} />
            <motion.path className="sk-live" d="M92 100V84M106 100V70M120 100V78M134 100V60M148 100V72" {...draw(3)} />
            <motion.path d="M90 116v12M70 128h40" {...draw(4)} />
          </>
        )}
        {kind === 'mobile' && (
          <>
            <motion.rect x="70" y="8" width="60" height="124" rx="12" {...draw(0)} />
            <motion.path d="M90 16h20" {...draw(1)} />
            <motion.rect className="sk-live" x="80" y="34" width="40" height="28" rx="6" {...draw(2)} />
            <motion.path d="M80 74h40M80 88h30M80 102h36" {...draw(3)} />
          </>
        )}
        {kind === 'agent' && (
          <>
            <motion.rect x="24" y="16" width="96" height="108" rx="8" {...draw(0)} />
            <motion.path d="M38 40h50M38 56h36" {...draw(1)} />
            <motion.path className="sk-live" d="M120 40h28M120 70h28M120 100h28" {...draw(2)} />
            <motion.rect x="148" y="30" width="22" height="20" rx="3" {...draw(3)} />
            <motion.rect x="148" y="60" width="22" height="20" rx="3" {...draw(4)} />
            <motion.rect x="148" y="90" width="22" height="20" rx="3" {...draw(5)} />
            <motion.rect className="sk-live" x="58" y="96" width="50" height="16" rx="8" {...draw(6)} />
          </>
        )}
        {kind === 'flow' && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.rect key={i} x={14 + i * 36} y="54" width="24" height="24" rx="4" {...draw(i)} />
            ))}
            <motion.path d="M38 66h12M74 66h12M110 66h12M146 66h12" {...draw(5)} />
            <motion.path className="sk-live" d="M14 100h168" strokeDasharray="4 6" {...draw(6)} />
            <motion.path className="sk-live" d="M122 50v-14h24" {...draw(7)} />
          </>
        )}
        {kind === 'shield' && (
          <>
            <motion.path d="M100 14 150 32v34c0 30-21 52-50 62-29-10-50-32-50-62V32Z" {...draw(0)} />
            <motion.path d="M100 36 130 47v19c0 18-12 31-30 37-18-6-30-19-30-37V47Z" {...draw(1)} />
            <motion.path className="sk-live" d="M86 70l10 10 20-22" {...draw(2)} />
          </>
        )}
      </g>
    </svg>
  );
}
