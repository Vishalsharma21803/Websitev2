'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/lib/site';
import { useStatus } from '@/lib/store';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Arrow } from './Arrow';

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.9 } as const;

function routeLabel(path: string) {
  if (path === '/') return 'Sifars · Engineering studio';
  const hit = [...nav].reverse().find((n) => n.href !== '/' && path.startsWith(n.href));
  return hit ? hit.label : 'Sifars';
}

export function Island() {
  const path = usePathname() || '/';
  const status = useStatus();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  const label = status.label || routeLabel(path);

  useEffect(() => setOpen(false), [path]);

  // Let the header adapt to what is under it: no scrim over the 3D stage, inverted over dark panels.
  const [under, setUnder] = useState<'' | 'on-stage' | 'on-dark'>('');
  useEffect(() => {
    let raf = 0;
    const check = () => {
      const hit = (sel: string) =>
        [...document.querySelectorAll<HTMLElement>(sel)].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < 64 && r.bottom > 24;
        });
      setUnder(hit('.start-sheet') ? 'on-dark' : hit('.asm-stage') ? 'on-stage' : '');
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    const first = panel.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <header className={`top ${under}`}>
      <Link href="/" className="top-logo" aria-label="Sifars home">
        <span className="top-logo-full">
          <Logo size={30} />
        </span>
        <span className="top-logo-mark">
          <Logo size={30} word={false} />
        </span>
      </Link>

      <div className="island-slot">
        <motion.div
          ref={panel}
          layout
          transition={spring}
          className={`island ${open ? 'is-open' : ''}`}
          style={{ borderRadius: open ? 30 : 999 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!open ? (
              <motion.button
                key="bar"
                ref={trigger}
                type="button"
                className="island-bar"
                onClick={() => setOpen(true)}
                aria-expanded={false}
                aria-controls="island-menu"
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.25 }}
              >
                <span className={status.live ? 'dot' : 'idle'} aria-hidden="true" />
                <span className="island-label" aria-live="polite">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={label}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {label}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {status.steps > 0 && (
                  <span className="island-step mono num" aria-hidden="true">
                    {String(status.step).padStart(2, '0')}/{String(status.steps).padStart(2, '0')}
                  </span>
                )}
                <span className="island-menu-ico" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="sr-only">Open menu</span>
                <motion.span className="island-progress" style={{ scaleX: progress }} aria-hidden="true" />
              </motion.button>
            ) : (
              <motion.nav
                key="menu"
                id="island-menu"
                aria-label="Site"
                className="island-menu"
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)', transition: { delay: 0.12, duration: 0.35 } }}
                exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.15 } }}
              >
                <div className="im-head">
                  <span className="im-status">
                    <span className={status.live ? 'dot' : 'idle'} aria-hidden="true" />
                    {label}
                  </span>
                  <button type="button" className="im-close" onClick={() => setOpen(false)}>
                    Close
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <ul className="im-links">
                  {nav.map((n, i) => {
                    const active = n.href === '/' ? path === '/' : path.startsWith(n.href);
                    return (
                      <motion.li
                        key={n.href}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.14 + i * 0.035, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                      >
                        <Link href={n.href} aria-current={active ? 'page' : undefined}>
                          <span>{n.label}</span>
                          <Arrow className="im-arrow" />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
                <div className="im-foot">
                  <a href={`mailto:${site.email.sales}`} className="mono">
                    {site.email.sales}
                  </a>
                  <div className="im-foot-r">
                    <ThemeToggle className="theme--island" />
                    <Link href="/contact/" className="btn btn--sm im-cta">
                      <Arrow />
                      Book a call
                    </Link>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="top-right">
        <ThemeToggle />
        <Link href="/contact/" className="btn btn--sm top-cta">
          <Arrow />
          Book a call
        </Link>
      </div>
    </header>
  );
}
