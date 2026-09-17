import type { Metadata, Viewport } from 'next';
import { Nunito_Sans, Cinzel } from 'next/font/google';
import './globals.css';

/* next/font downloads and self-hosts these at build time — the page makes
   no request to Google at runtime. Nunito Sans, requested directly
   (fonts.google.com/specimen/Nunito+Sans) — a rounded/soft grotesque
   rather than Archivo's neutral Helvetica character, and the page's only
   sans face: body copy at its default weight, `.display` pins it to 200.

   Cinzel is the second display face, also requested directly — a
   classical engraved-stone serif, alternating with Nunito Sans across
   the page's four titles (see `.display-alt` in globals.css and where
   it's applied in BriefForm.tsx). Cinzel ships no weight below 400
   (a classical serif like this was never cut light), so it's used as-is. */
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-alt',
});

/* Private link, not a search result — robots stays noindex. OG/Twitter
   tags are separate from indexing: they only control how the link looks
   when pasted into a message (WhatsApp/iMessage/Slack), which is the
   actual point of dressing this up. metadataBase pins the domain the
   share preview resolves og.jpg against; update if the final home ends
   up being ailive.fr/dr-brief instead of the standalone Vercel deploy. */
const TITLE = 'Tes deux sites, en deux minutes';
const DESCRIPTION = 'Le site du cabinet et le site piano, en un seul brief. Deux minutes, rien que des cases à cocher.';

export const metadata: Metadata = {
  metadataBase: new URL('https://dr-brief.vercel.app'),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/dr-brief',
    siteName: 'Ailive.fr',
    locale: 'fr_FR',
    type: 'website',
    // Source photo is 300x200 — below the ~1200x630 platforms prefer, so
    // it may render smaller/less sharp in some previews. It's the only
    // photo on hand; swap in a larger one if a sharper preview matters.
    images: [{ url: '/dr-brief/og.jpg', width: 300, height: 200, alt: 'Dr Patrick Lellouche, dans son cabinet' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/dr-brief/og.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0f151c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${nunitoSans.variable} ${cinzel.variable}`}>
      <body>
        <div className="ground" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
