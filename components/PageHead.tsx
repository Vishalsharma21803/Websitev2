import Link from 'next/link';
import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SetStatus } from './SetStatus';

export function PageHead({
  title,
  lead,
  status,
  crumbs,
  side,
  children,
}: {
  title: ReactNode;
  lead?: string;
  status: string;
  crumbs?: { label: string; href: string }[];
  side?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="phead">
      <SetStatus label={status} />
      <div className="wrap">
        {crumbs && (
          <nav className="crumbs mono" aria-label="Breadcrumb">
            {crumbs.map((c, i) =>
              i < crumbs.length - 1 ? (
                <Link key={c.href} href={c.href}>
                  {c.label}
                </Link>
              ) : (
                <span key={c.href} aria-current="page">
                  {c.label}
                </span>
              ),
            )}
          </nav>
        )}
        <div className="phead-grid">
          <Reveal>
            <h1 className="h1">{title}</h1>
          </Reveal>
          <Reveal delay={0.12} className="phead-side">
            {lead && <p className="lead">{lead}</p>}
            {side}
          </Reveal>
        </div>
        {children}
      </div>
    </section>
  );
}
