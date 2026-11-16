import { trustControls, trustFlow } from '@/lib/approach';
import { Reveal } from '../Reveal';

export function TrustLine() {
  return (
    <section className="trust section" aria-labelledby="trust-h">
      <div className="wrap">
        <div className="trust-sheet sheet">
          <span className="ticks" aria-hidden="true" />
          <div className="sec-head">
            <Reveal>
              <h2 id="trust-h" className="h2">
                AI needs a trust layer before it enters your business.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead">AI systems should not freely act inside real operations without access limits, validation, human oversight, and monitoring.</p>
            </Reveal>
          </div>
          <div className="tl">
            <ol className="tl-nodes" aria-label="How an AI action is controlled">
              {trustFlow.map((n, i) => (
                <li key={n} className={n === 'Human review' ? 'is-human' : ''} style={{ ['--n' as string]: i }}>
                  <span className="tl-dot mono num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="tl-name">{n}</span>
                </li>
              ))}
            </ol>
            <span className="tl-rail" aria-hidden="true">
              <i className="tl-packet" />
            </span>
          </div>
          <ul className="tl-controls">
            {trustControls.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 3) * 0.06}>
                <h3>{c.title}</h3>
                <p className="muted">{c.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
