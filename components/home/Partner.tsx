import Link from 'next/link';
import { Arrow } from '../Arrow';
import { Reveal } from '../Reveal';

export function Partner() {
  return (
    <section className="partner section" aria-labelledby="partner-h">
      <div className="wrap partner-grid">
        <Reveal>
          <h2 id="partner-h" className="h2">
            For consultants, CTOs and agencies
          </h2>
          <p className="lead partner-lead">Bring Sifars in when your client’s project needs deeper engineering than your internal team can provide.</p>
          <Link href="/contact/" className="btn">
            <Arrow />
            Discuss a partner build
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="eq">
            <div className="eq-col sheet">
              <p className="mono">You bring</p>
              <ul>
                <li>Client context</li>
                <li>The relationship</li>
                <li>The problem brief</li>
              </ul>
            </div>
            <span className="eq-op" aria-hidden="true">
              +
            </span>
            <div className="eq-col sheet eq-col--live">
              <p className="mono">Sifars brings</p>
              <ul>
                <li>Architecture</li>
                <li>Engineering capacity</li>
                <li>AI + integrations</li>
              </ul>
            </div>
            <p className="eq-res">
              <span className="eq-op" aria-hidden="true">
                =
              </span>
              One production-grade build, shipped under your name.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
