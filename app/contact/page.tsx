import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { ContactForm } from '@/components/ContactForm';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact', description: 'Start a project with Sifars. Every enquiry is covered by an NDA.' };

export default function Contact() {
  return (
    <>
      <PageHead
        status="Start a project"
        titleParts={['Tell us what', { live: 'has to work.' }]}
        art={{ kind: 'route', caption: 'How an enquiry moves · covered by an NDA from the first message' }}
        lead="Share the workflow, the users and the systems involved. Your idea stays yours: every enquiry is covered by a non-disclosure agreement."
      />
      <section className="wrap ct" aria-label="Contact">
        <div className="ct-form sheet">
          <span className="ticks" aria-hidden="true" />
          <ContactForm />
        </div>
        <dl className="ct-dl">
          <div>
            <dt className="mono">New projects</dt>
            <dd>
              <a href={`mailto:${site.email.sales}`}>{site.email.sales}</a>
            </dd>
          </div>
          <div>
            <dt className="mono">General</dt>
            <dd>
              <a href={`mailto:${site.email.contact}`}>{site.email.contact}</a>
            </dd>
          </div>
          <div>
            <dt className="mono">Phone</dt>
            <dd>
              {site.phones.map((p) => (
                <a key={p} className="num" href={`tel:${p.replace(/\s/g, '')}`}>
                  {p}
                </a>
              ))}
            </dd>
          </div>
          <div>
            <dt className="mono">Office</dt>
            <dd>
              <address>
                {site.address.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
