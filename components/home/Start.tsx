import Link from 'next/link';
import { site } from '@/lib/site';
import { Arrow } from '../Arrow';
import { Reveal } from '../Reveal';

/** Closing call to action, set as the title block of a drawing sheet. */
export function Start({ title = 'Start with a blueprint.' }: { title?: string }) {
  return (
    <section className="start" aria-labelledby="start-h">
      <div className="wrap">
        <div className="start-sheet">
          <span className="ticks" aria-hidden="true" />
          <Reveal>
            <h2 id="start-h" className="display start-h">
              {title}
            </h2>
          </Reveal>
          <div className="start-grid">
            <Reveal delay={0.1}>
              <p className="lead start-lead">
                Tell us what has to work, for whom, and with which systems. We come back with questions and a clear view of what it takes to run in production.
              </p>
              <div className="start-cta">
                <Link href="/contact/" className="btn start-btn">
                  <Arrow />
                  Book a strategy call
                </Link>
                <a className="link" href={`mailto:${site.email.sales}`}>
                  {site.email.sales}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <table className="titleblock mono">
                <caption className="sr-only">Project title block</caption>
                <tbody>
                  <tr>
                    <th scope="row">Drawn by</th>
                    <td>Sifars engineering</td>
                  </tr>
                  <tr>
                    <th scope="row">Scope</th>
                    <td>Web · Mobile · AI agents · Automation</td>
                  </tr>
                  <tr>
                    <th scope="row">Covered by</th>
                    <td>NDA on every enquiry</td>
                  </tr>
                  <tr>
                    <th scope="row">Budgets</th>
                    <td>From $2,500</td>
                  </tr>
                  <tr>
                    <th scope="row">Status</th>
                    <td>
                      <span className="dot" aria-hidden="true" /> Accepting projects
                    </td>
                  </tr>
                </tbody>
              </table>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
