'use client';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  const path = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.current = l;
    window.__lenis = l;
    let id = 0;
    const raf = (t: number) => {
      l.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      l.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [path]);

  return null;
}
