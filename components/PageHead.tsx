import Link from 'next/link';
import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SetStatus } from './SetStatus';
import { SplitHeading } from './SplitHeading';
import { DrawSheet, type SheetKind } from './DrawSheet';

type Part = string | { live: string };

export function PageHead({
  title,
  titleParts,
  lead,
  status,
  crumbs,
  side,
  children,
  variant,
  art,
}: {
  title?: ReactNode;
  /** Words rise into place; `{ live }` parts are set in the live blue. */
  titleParts?: Part[];
  lead?: string;
  status: string;
  crumbs?: { label: string; href: string }[];
  side?: ReactNode;
  children?: ReactNode;
  variant?: 'post';
  art?: { kind: SheetKind; caption: string };
}) {
  return (
    <section className={`phead ${variant === 'post' ? 'phead--post' : ''}`}>
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
          {titleParts ? (
            <SplitHeading as="h1" className="h1" parts={titleParts} />
          ) : (
            <Reveal>
              <h1 className="h1">{title}</h1>
            </Reveal>
          )}
          <Reveal delay={0.25} className="phead-side">
            {lead && <p className="lead">{lead}</p>}
            {side}
          </Reveal>
        </div>
        {art && (
          <Reveal delay={0.1} className="phead-art">
            <DrawSheet kind={art.kind} caption={art.caption} />
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
