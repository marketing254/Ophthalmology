const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketing254.github.io/Ophthalmology';

export const metadata = {
  title: 'The Ophthalmology Business Podcast',
  description:
    'Stream 75+ free episodes on the business of eye care: practice marketing, operations, premium IOL conversion and leadership, with surgeons, COEs and practice executives.',
  alternates: { canonical: '/podcast/' },
};

const PODCAST_LD = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'The Ophthalmology Business Podcast',
  url: `${SITE_URL}/podcast/`,
  description:
    'Candid conversations with surgeons, operators, and executives on marketing, operations, and growing an eye-care practice. Free to stream.',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default function PodcastLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PODCAST_LD) }}
      />
      {children}
    </>
  );
}
