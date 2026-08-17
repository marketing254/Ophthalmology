import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import './dynamic.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import CardTilt from '@/components/CardTilt';

// Fresh type system: Outfit for headings, DM Sans for body/UI.
const display = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketing254.github.io/Ophthalmology';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ophthalmology Business Academy | The Business of Eye Care',
    template: '%s | Ophthalmology Business Academy',
  },
  description:
    'Live expert panels, a 75-episode podcast, and practical playbooks on the business of ophthalmology. Free membership for practice owners, surgeons, administrators, and COEs.',
  alternates: { canonical: '/' },
  icons: { icon: `${BASE}/favicon.svg` },
  openGraph: {
    type: 'website',
    siteName: 'Ophthalmology Business Academy',
    url: SITE_URL,
    title: 'Ophthalmology Business Academy | The Business of Eye Care',
    description:
      'Live expert panels, a free podcast, and practical playbooks on growing an ophthalmology practice.',
    images: [{ url: `${SITE_URL}/og-cover.png`, width: 1200, height: 630, alt: 'Ophthalmology Business Academy, The Business of Eye Care' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ophthalmology Business Academy',
    description:
      'Live expert panels, a free podcast, and practical playbooks on growing an ophthalmology practice.',
    images: [`${SITE_URL}/og-cover.png`],
  },
  robots: { index: true, follow: true },
};

// Organization + WebSite structured data (rendered server-side into static HTML).
const JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Ophthalmology Business Academy',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    email: 'team@obacademy.org',
    sameAs: [
      'https://www.facebook.com/Opthos/',
      'https://www.instagram.com/ophthalmology_business_podcast/',
      'https://www.linkedin.com/company/ophthalmology-business-academy/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ophthalmology Business Academy',
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
        <CardTilt />
      </body>
    </html>
  );
}
