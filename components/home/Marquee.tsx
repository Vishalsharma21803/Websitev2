import { clients, industries } from '@/lib/site';

export function Marquee() {
  const row = [...clients, ...clients];
  return (
    <section className="mq" aria-label="Clients and industries">
      <div className="wrap mq-head">
        <p className="mq-title">Built for teams at</p>
        <p className="mono mq-ind">{industries.join(' · ')}</p>
      </div>
      <div className="mq-track-wrap">
        <ul className="mq-track">
          {row.map((c, i) => (
            <li key={i} aria-hidden={i >= clients.length ? true : undefined}>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
