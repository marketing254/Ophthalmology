import { notFound } from 'next/navigation';
import EpisodeView from '@/components/EpisodeView';
import { getEpisodes, isoDate, summarize } from '@/app/lib/build-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';

export async function generateStaticParams() {
  const eps = await getEpisodes();
  return eps.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const eps = await getEpisodes();
  const ep = eps.find((e) => e.slug === params.slug);
  if (!ep) return {};
  const desc = summarize(ep.description) ||
    `Episode ${ep.episode} of The Ophthalmology Business Podcast${ep.guestName ? ` with ${ep.guestName}` : ''}.`;
  const url = `${SITE_URL}/podcast/episode/${ep.slug}/`;
  const img = ep.poster || `${SITE_URL}/og-cover.png`;
  return {
    title: ep.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: ep.title,
      description: desc,
      images: [{ url: img, width: 1200, height: 630, alt: ep.title }],
    },
    twitter: { card: 'summary_large_image', title: ep.title, description: desc, images: [img] },
    robots: { index: true, follow: true },
  };
}

export default async function EpisodePage({ params }) {
  const eps = await getEpisodes();
  const idx = eps.findIndex((e) => e.slug === params.slug);
  if (idx === -1) notFound();
  const ep = eps[idx];
  const prev = idx < eps.length - 1 ? { slug: eps[idx + 1].slug, title: eps[idx + 1].title } : null;
  const next = idx > 0 ? { slug: eps[idx - 1].slug, title: eps[idx - 1].title } : null;

  const url = `${SITE_URL}/podcast/episode/${ep.slug}/`;
  const published = isoDate(ep.dateLabel);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    '@id': url,
    url,
    name: ep.title,
    ...(ep.epNum ? { episodeNumber: ep.epNum } : {}),
    ...(published ? { datePublished: published } : {}),
    description: summarize(ep.description, 400) || undefined,
    ...(ep.audioSource && /\.mp3(\?|$)/i.test(ep.audioSource)
      ? { associatedMedia: { '@type': 'MediaObject', contentUrl: ep.audioSource, encodingFormat: 'audio/mpeg' } }
      : {}),
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: 'The Ophthalmology Business Podcast',
      url: `${SITE_URL}/podcast/`,
    },
    ...(ep.guestName ? { actor: [{ '@type': 'Person', name: ep.guestName }] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EpisodeView slug={ep.slug} initial={{ ep, prev, next }} />
    </>
  );
}
