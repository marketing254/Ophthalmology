import { Inter, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './dynamic.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import CardTilt from '@/components/CardTilt';

// OBA design system type: Inter for everything, IBM Plex Mono for eyebrow labels.
const display = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ophthalmology Business Academy | The Business of Eye Care',
    template: '%s | Ophthalmology Business Academy',
  },
  description:
    'Live expert panels, a 75-episode podcast, and practical playbooks on the business of ophthalmology. Free for practice owners, surgeons, and administrators.',
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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* The sheet (data) and Drive (episode art) are on the critical path
            for every dynamic section: warm the connections early. */}
        <link rel="preconnect" href="https://docs.google.com" />
        <link rel="preconnect" href="https://drive.google.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://traffic.libsyn.com" />
        <link rel="preconnect" href="https://script.google.com" />
        <link rel="preconnect" href="https://script.googleusercontent.com" />
      </head>
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-6GDGK5QGS4" strategy="afterInteractive" />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6GDGK5QGS4');`}
        </Script>
      </body>
    </html>
  );
}
