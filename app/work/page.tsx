import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Outcomes } from '@/components/home/Outcomes';
import { Quotes } from '@/components/home/Quotes';
import { Start } from '@/components/home/Start';
import { cases } from '@/lib/work';

export const metadata: Metadata = { title: 'Work', description: 'AI invoice automation, an autonomous AI sales agent and an AI health app: systems Sifars built that run in production.' };

export default function Work() {
  return (
    <>
      <PageHead
        status="Work"
        title={
          <>
            Systems running <span className="live">in production.</span>
          </>
        }
        lead="Three builds, three industries, one standard: real users, real data, and someone accountable when it has to work."
      >
        <ul className="proofs">
          {cases.map((c) => (
            <li key={c.slug}>
              <span className="proof-v num">{c.metrics[0].value}</span>
              <span>
                {c.metrics[0].label}
                <br />
                <span className="mono">{c.client}</span>
              </span>
            </li>
          ))}
        </ul>
      </PageHead>
      <Outcomes heading="Case studies, read two ways." />
      <Quotes />
      <Start />
    </>
  );
}
