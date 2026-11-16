'use client';
import { useSyncExternalStore } from 'react';

/** Mutable scene state read every frame by the 3D canvas (no React re-render). */
export const scene = {
  progress: 0, // 0..1 through the pinned assembly
  draw: 0, // auto intro drawing 0..1
};

type Status = { label: string; live: boolean; step: number; steps: number };
let status: Status = { label: '', live: false, step: 0, steps: 0 };
const listeners = new Set<() => void>();

export function setStatus(next: Partial<Status>) {
  const merged = { ...status, ...next };
  if (merged.label === status.label && merged.live === status.live && merged.step === status.step && merged.steps === status.steps) return;
  status = merged;
  listeners.forEach((l) => l());
}

export function useStatus() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
    () => status,
  );
}

/* ---------- theme ---------- */
export type Theme = 'light' | 'dark';
const themeListeners = new Set<() => void>();

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem('sifars-v2-theme', t);
  } catch {
    /* storage unavailable */
  }
  themeListeners.forEach((l) => l());
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      themeListeners.add(cb);
      return () => themeListeners.delete(cb);
    },
    getTheme,
    () => 'light',
  );
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
