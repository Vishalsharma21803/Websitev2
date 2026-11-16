import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/Reveal';
import { Quotes } from '@/components/home/Quotes';
import { Start } from '@/components/home/Start';
import { Clock } from '@/components/Clock';
import { CountUp } from '@/components/CountUp';
import { DrawSheet } from '@/components/DrawSheet';
import { credentials, site } from '@/lib/site';

export const metadata: Metadata = { title: 'About', description: 'Sifars is an engineering team in Mohali, India, building AI systems, automation and complex software for clients across the globe.' };

const pillars = [
  { name: 'Conceive', body: 'We turn an idea into something that can exist in reality: the workflow, the data, the architecture and the risks, decided before anyone writes code.' },
  { name: 'Nurture', body: 'We take on your goals as our own and build with the depth of a team that has shipped this kind of system before.' },
  { name: 'Support', body: 'We stay after launch: monitoring, updates and continuous improvement, so the system keeps earning its place.' },
];

export default function About() {
  return (
    <>
      <PageHead
        status="About"
        titleParts={['We were building AI systems before ChatGPT', { live: 'made it a buzzword.' }]}
        lead="For over a decade we’ve shipped machine learning, automation and data systems into production. Sifars treats every project as a personal affair."
      >
        <dl className="cred">
          {credentials.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <dt className="mono">{c.label}</dt>
              <dd>
                <CountUp value={c.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </PageHead>

      <section className="section" aria-labelledby="ab-h">
        <div className="wrap ab-grid">
          <Reveal>
            <h2 id="ab-h" className="h2">
              What we help you with
            </h2>
          </Reveal>
          <ol className="ab-list">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.06}>
                <span className="mono num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="ab-name">{p.name}</h3>
                <p className="muted">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Quotes />

      <section className="wrap section" aria-labelledby="office-h">
        <DrawSheet kind="office" caption="Illustrative floor plan · Mohali, Punjab" />
        <div className="office sheet">
          <span className="ticks" aria-hidden="true" />
          <h2 id="office-h" className="h2">
            Where the drawings happen
          </h2>
          <address>
            {site.address.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <div className="office-r">
            <p className="office-clock">
              <span className="dot" aria-hidden="true" />
              <Clock />
              <span className="mono">IST · Mohali</span>
            </p>
            <a href={`mailto:${site.email.info}`} className="link">
              {site.email.info}
            </a>
            <a href={`tel:${site.phones[0].replace(/\s/g, '')}`} className="link num">
              {site.phones[0]}
            </a>
          </div>
        </div>
      </section>
      <Start />
    </>
  );
}
