import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Sketch } from '@/components/Sketch';
import { Reveal } from '@/components/Reveal';
import { Arrow } from '@/components/Arrow';
import { Phases } from '@/components/Phases';
import { Start } from '@/components/home/Start';
import { practices } from '@/lib/services';

export const metadata: Metadata = { title: 'Services', description: 'Web platforms, mobile apps, AI agents, AI automation and security, engineered to one production standard.' };

const kinds = { web: 'web', mobile: 'mobile', 'ai-agents': 'agent', automation: 'flow', security: 'shield' } as const;

export default function Services() {
  return (
    <>
      <PageHead
        status="Services"
        title={
          <>
            Five practices. <span className="live">One production standard.</span>
          </>
        }
        lead="Every service is built by senior engineers and held to the same Production Layer, from the first workshop to support after launch."
      />
      <section className="svc wrap" aria-label="Practices">
        {practices.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.05}>
            <Link href={`/services/${p.slug}/`} className="svc-row sheet">
              <span className="ticks" aria-hidden="true" />
              <span className="svc-art">
                <Sketch kind={kinds[p.slug as keyof typeof kinds]} />
              </span>
              <span className="svc-main">
                <span className="mono svc-n num">0{i + 1}</span>
                <span className="svc-name">{p.name}</span>
                <span className="svc-out">{p.outcome}</span>
              </span>
              <span className="svc-under">
                <span className="mono">Under the hood</span>
                {p.under}
              </span>
              <span className="svc-go" aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
      <Phases />
      <Start />
    </>
  );
}
