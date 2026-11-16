import Link from 'next/link';
import { nav, site } from '@/lib/site';
import { practices } from '@/lib/services';
import { Clock } from './Clock';
import { FootMark } from './FootMark';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <p className="foot-lead">Websites, mobile apps, AI agents and automation, engineered from blueprint to production.</p>
            <p className="foot-clock mono">
              <span className="dot" aria-hidden="true" /> Mohali, India · <Clock /> IST
            </p>
          </div>
          <nav className="foot-col" aria-label="Company">
            <h2>Company</h2>
            <ul>
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="foot-col" aria-label="Services">
            <h2>Services</h2>
            <ul>
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}/`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="foot-col">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${site.email.sales}`}>{site.email.sales}</a>
              </li>
              <li>
                <a href={`mailto:${site.email.info}`}>{site.email.info}</a>
              </li>
              <li>
                <a className="num" href={`tel:${site.phones[0].replace(/\s/g, '')}`}>
                  {site.phones[0]}
                </a>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <FootMark />
        <div className="foot-legal">
          <span>© {new Date().getFullYear()} Sifars. Fourth Floor, Blue Sapphire, Sector 74, Mohali.</span>
          <span className="mono">Engineered in Mohali, India</span>
        </div>
      </div>
    </footer>
  );
}
