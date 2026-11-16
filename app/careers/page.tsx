import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { ContactForm } from '@/components/ContactForm';
import { Reveal } from '@/components/Reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Careers', description: 'Careers at Sifars. We are not hiring for open roles right now, but we read every application.' };

const values = [
  { t: 'Production is the bar', b: 'We judge work by how it behaves with real users and real data, not by how it demos.' },
  { t: 'Ownership end to end', b: 'From planning to support and maintenance, the team that builds a system stays accountable for it.' },
  { t: 'Senior engineering depth', b: 'Architecture, AI logic and integrations handled by people who have shipped them before.' },
];

export default function Careers() {
  return (
    <>
      <PageHead
        status="Careers"
        title={
          <>
            A great team, and a career <span className="live">to build with it.</span>
          </>
        }
        lead="We are not hiring for open roles right now. We still read every application and reach out when a matching role opens."
      />
      <section className="wrap section vals" aria-label="How we work">
        {values.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.06} className="val">
            <span className="mono num">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="h3">{v.t}</h2>
            <p className="muted">{v.b}</p>
          </Reveal>
        ))}
      </section>
      <section className="wrap ct ct--careers" aria-labelledby="apply-h">
        <div>
          <h2 id="apply-h" className="h2">
            Send an open application
          </h2>
          <p className="lead">Tell us what you build and link to work you are proud of.</p>
        </div>
        <div className="ct-form sheet">
          <span className="ticks" aria-hidden="true" />
          <ContactForm careers to={site.email.info} subject="Open application" />
        </div>
      </section>
    </>
  );
}
