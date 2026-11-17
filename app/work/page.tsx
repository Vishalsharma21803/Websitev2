import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Outcomes } from '@/components/home/Outcomes';
import { Quotes } from '@/components/home/Quotes';
import { Start } from '@/components/home/Start';
import { cases } from '@/lib/work';
import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = { title: 'Work', description: 'AI invoice automation, an autonomous AI sales agent and an AI health app: systems Sifars built that run in production.' };

export default function Work() {
  return (
    <>
      <PageHead
        status="Work"
        titleParts={['Systems running', { live: 'in production.' }]}
        lead="Three builds, three industries, one standard: real users, real data, and someone accountable when it has to work."
      >
        <ul className="proofs">
          {cases.map((c, i) => (
            // Revealed like the figures on /about and the case pages, so the final number never shows before counting.
            <Reveal as="li" key={c.slug} delay={i * 0.06}>
              <CountUp className="proof-v num" value={c.metrics[0].value} />
              <span>
                {c.metrics[0].label}
                <br />
                <span className="mono">{c.client}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </PageHead>
      <Outcomes heading="Case studies, read two ways." />
      <Quotes />
      <Start />
    </>
  );
}
