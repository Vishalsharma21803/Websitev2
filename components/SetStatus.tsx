'use client';
import { useEffect } from 'react';
import { setStatus } from '@/lib/store';

/** Lets a page name what the Dynamic Island shows. */
export function SetStatus({ label, live = false }: { label: string; live?: boolean }) {
  useEffect(() => {
    setStatus({ label, live, step: 0, steps: 0 });
    return () => setStatus({ label: '', live: false, step: 0, steps: 0 });
  }, [label, live]);
  return null;
}
