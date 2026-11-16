import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import './chrome.css';
import './sections.css';
import { Island } from '@/components/Island';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: { default: 'Sifars | From blueprint to production', template: '%s | Sifars' },
  description:
    'Sifars engineers websites, mobile apps, AI agents and AI automation for businesses, from first blueprint to systems that run in production.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f3f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d10' },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('sifars-v2-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Island />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
