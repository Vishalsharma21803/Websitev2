import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/Reveal';
import { Arrow } from '@/components/Arrow';
import { CaseDrawing } from '@/components/home/CaseDrawing';
import { Start } from '@/components/home/Start';
import { CaseChapter } from '@/components/CaseChapter';
import { Pipeline } from '@/components/Pipeline';
import { CountUp } from '@/components/CountUp';
import { cases, caseBySlug } from '@/lib/work';

export const dynamicParams = false;
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  return c ? { title: `${c.title} · ${c.client}`, description: c.summary } : {};
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const next = cases[(cases.indexOf(c) + 1) % cases.length];
  return (
    <>
      <PageHead
        status={c.client}
        crumbs={[
          { label: 'Work', href: '/work/' },
          { label: c.client, href: `/work/${c.slug}/` },
        ]}
        title={c.title}
        lead={c.summary}
        side={
          <p className="cs-shift">
            {c.shift[0]} <Arrow /> <span className="live">{c.shift[1]}</span>
          </p>
        }
      >
        <div className="cs-hero">
          <div className="cs-art sheet">
            <span className="ticks" aria-hidden="true" />
            <CaseDrawing slug={c.slug} />
          </div>
          <dl className="cs-facts">
            {c.facts.map((f) => (
              <div key={f.label}>
                <dt className="mono">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="cs-metrics">
          {c.metrics.map((m, i) => (
            <Reveal as="li" key={m.label} delay={i * 0.06}>
              <CountUp className="num" value={m.value} />
              {m.label}
            </Reveal>
          ))}
        </ul>
      </PageHead>

      <CaseChapter k="The challenge" title={c.challengeTitle}>
        <p className="muted cs-p">{c.problem}</p>
        <ul className="cs-ticks">
          {c.challenge.map((x, i) => (
            <Reveal as="li" key={x} delay={(i % 6) * 0.04}>
              {x}
            </Reveal>
          ))}
        </ul>
      </CaseChapter>

      <CaseChapter k="What we built" title={c.solutionTitle}>
        <p className="muted cs-p">{c.solution}</p>
        {c.steps && <Pipeline steps={c.steps} />}
        <div className="cs-feats">
          {c.features.map((f) => (
            <Reveal key={f.title} className="cs-feat">
              <h3>{f.title}</h3>
              <p className="muted">{f.body}</p>
            </Reveal>
          ))}
        </div>
        {c.stack && (
          <div className="cs-stack">
            <p className="mono">Under the hood</p>
            <ul>
              {c.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CaseChapter>

      <CaseChapter k="The outcome" title={c.outcomeTitle}>
        <ul className="cs-ticks cs-ticks--done">
          {c.outcome.map((x, i) => (
            <Reveal as="li" key={x} delay={i * 0.08}>
              {x}
            </Reveal>
          ))}
        </ul>
        {c.quote && (
          <figure className="cs-quote sheet">
            <blockquote>
              <p>“{c.quote.text}”</p>
            </blockquote>
            <figcaption className="mono">
              {c.quote.name} · {c.quote.role}
            </figcaption>
          </figure>
        )}
      </CaseChapter>

      <div className="wrap">
        <Link href={`/work/${next.slug}/`} className="cs-next sheet">
          <span className="mono">Next case</span>
          <span className="cs-next-t">
            {next.title} <Arrow />
          </span>
        </Link>
      </div>
      <Start />
    </>
  );
}
