import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHead } from '@/components/PageHead';
import { Arrow } from '@/components/Arrow';
import { fmtDate, getPosts } from '@/lib/blog';

export const dynamicParams = false;
export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPosts().find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description } : {};
}

/** Minimal markdown: headings, blockquotes and paragraphs (all the placeholder posts use). */
function render(md: string) {
  return md.split(/\n{2,}/).map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>;
    if (block.startsWith('> ')) return <blockquote key={i}>{block.replace(/^> /gm, '')}</blockquote>;
    return <p key={i}>{block}</p>;
  });
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = posts[i];
  const next = posts[(i + 1) % posts.length];
  return (
    <>
      <PageHead variant="post" status="Blog" crumbs={[{ label: 'Blog', href: '/blog/' }, { label: p.category, href: `/blog/${p.slug}/` }]} title={p.title} lead={p.description}>
        <p className="mono post-meta">
          {fmtDate(p.date)} · {p.minutes} min read
        </p>
      </PageHead>
      <article className="wrap post">
        <div className="post-body">{render(p.body)}</div>
        <Link href={`/blog/${next.slug}/`} className="post-next">
          <span className="mono">Next article</span>
          <span className="post-next-t">
            {next.title} <Arrow />
          </span>
        </Link>
      </article>
    </>
  );
}
