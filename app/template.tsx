import type { ReactNode } from 'react';

/**
 * Runs on every route change. CSS-only so content is never hidden waiting for JavaScript:
 * a quick fade, and a blue scan line sweeping down the page.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="scanline" aria-hidden="true" />
      <div className="page-in">{children}</div>
    </>
  );
}
