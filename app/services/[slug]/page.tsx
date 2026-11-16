import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/Reveal';
import { Arrow } from '@/components/Arrow';
import { Sketch } from '@/components/Sketch';
import { Solo } from '@/components/Solo';
import { TrustLine } from '@/components/home/TrustLine';
import { Start } from '@/components/home/Start';
import { practices, practiceBySlug } from '@/lib/services';
import { caseBySlug } from '@/lib/work';
import { CaseDrawing } from '@/components/home/CaseDrawing';

export const dynamicParams = false;
export function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = practiceBySlug((await params).slug);
  return p ? { title: p.name, description: p.summary } : {};
}

const solo = { web: 0, mobile: 1, agent: 2, flow: 3 } as const;

export default async function Practice({ params }: { params: Promise<{ slug: string }> }) {
  const p = practiceBySlug((await params).slug);
  if (!p) notFound();
  const related = p.cases.map(caseBySlug).filter((c) => c !== undefined);
  const others = practices.filter((o) => o.slug !== p.slug);
  return (
    <>
      <PageHead
        status={p.name}
        crumbs={[
          { label: 'Services', href: '/services/' },
          { label: p.name, href: `/services/${p.slug}/` },
        ]}
        title={p.name}
        lead={p.outcome}
        side={
          <Link href="/contact/" className="btn">
            <Arrow />
            Discuss your project
          </Link>
        }
      >
        <div className="solo sheet">
          <span className="ticks" aria-hidden="true" />
          {p.deliverable ? <Solo which={solo[p.deliverable]} /> : <Sketch kind="shield" className="solo-sketch" />}
          <p className="mono solo-cap">{p.deliverable ? 'Drag to rotate · drawn, built and running in your browser' : 'Security is designed in, then tested from the outside'}</p>
        </div>
      </PageHead>

      <section className="pr section" aria-labelledby="pr-h">
        <div className="wrap pr-grid">
          <div className="pr-side">
            <Reveal>
              <h2 id="pr-h" className="h2">
                What we build
              </h2>
              <p className="lead pr-sum">{p.summary}</p>
            </Reveal>
            <Reveal delay={0.1} className="pr-under">
              <p className="mono">Under the hood</p>
              <ul>
                {p.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <ol className="pr-list">
            {p.offerings.map((o, i) => (
              <Reveal as="li" key={o.title} delay={(i % 3) * 0.05}>
                <span className="mono num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{o.title}</h3>
                <p className="muted">{o.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {(p.slug === 'ai-agents' || p.slug === 'automation') && <TrustLine />}

      {related.length > 0 && (
        <section className="rel section" aria-labelledby="rel-h">
          <div className="wrap">
            <Reveal>
              <h2 id="rel-h" className="h2">
                In production
              </h2>
            </Reveal>
            <div className="rel-grid">
              {related.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.06}>
                  <Link href={`/work/${c.slug}/`} className="rel-card sheet">
                    <span className="rel-art" aria-hidden="true">
                      <CaseDrawing slug={c.slug} />
                    </span>
                    <span className="mono">{c.client}</span>
                    <span className="rel-t">{c.title}</span>
                    <span className="rel-shift">
                      {c.shift[0]} <Arrow /> <span className="live">{c.shift[1]}</span>
                    </span>
                    <span className="muted">{c.summary}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="others wrap section" aria-label="Other practices">
        <p className="mono others-h">Other practices</p>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/services/${o.slug}/`}>
                {o.name} <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Start />
    </>
  );
}
