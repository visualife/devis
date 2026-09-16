import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

/* next/font downloads and self-hosts these at build time — the page makes no
   request to Google at runtime. Same pairing as the bdimo devis. */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const metadata: Metadata = {
  title: 'Tes deux sites — quelques précisions',
  description: 'Brief en deux minutes pour le site du cabinet et le site piano.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0f151c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <div className="ground" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
