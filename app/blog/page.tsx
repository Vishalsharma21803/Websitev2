import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/Reveal';
import { Arrow } from '@/components/Arrow';
import { fmtDate, getPosts } from '@/lib/blog';

export const metadata: Metadata = { title: 'Blog', description: 'Guides on custom software, AI and automation from the Sifars engineering team.' };

export default function Blog() {
  const [lead, ...rest] = getPosts();
  return (
    <>
      <PageHead
        status="Blog"
        title={
          <>
            Notes from the <span className="live">drawing board.</span>
          </>
        }
        lead="Guides and thinking on custom software, AI and automation, from the team that builds it."
      />
      <section className="wrap blog" aria-label="Articles">
        <Reveal>
          <Link href={`/blog/${lead.slug}/`} className="blog-lead sheet">
            <span className="ticks" aria-hidden="true" />
            <span className="blog-t">{lead.title}</span>
            <span className="muted">{lead.description}</span>
            <span className="mono blog-meta">
              {lead.category} · {fmtDate(lead.date)} · {lead.minutes} min
            </span>
            <span className="blog-go" aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </Reveal>
        <ul className="blog-list">
          {rest.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.05}>
              <Link href={`/blog/${p.slug}/`} className="blog-row">
                <span className="blog-rt">{p.title}</span>
                <span className="mono blog-meta">
                  {p.category} · {fmtDate(p.date)} · {p.minutes} min
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
