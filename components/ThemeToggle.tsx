'use client';
import { setTheme, useTheme } from '@/lib/store';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === 'dark';
  const flip = () => {
    const next = dark ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(() => setTheme(next));
    } else setTheme(next);
  };
  return (
    <button type="button" className={`theme ${className}`} onClick={flip} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={dark}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" className="theme-half" />
      </svg>
    </button>
  );
}
