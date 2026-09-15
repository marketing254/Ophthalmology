import { getEpisodes, isoDate } from './lib/build-data';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';
const BUILD_DATE = new Date();

// Static pages: lastModified is the build date, which is truthful because a
// deploy regenerates every page. Episodes carry their real publish dates.
const PAGES = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: 'podcast/', changeFrequency: 'daily', priority: 0.9 },
  { path: 'webinars/', changeFrequency: 'daily', priority: 0.8 },
  { path: 'about/', changeFrequency: 'monthly', priority: 0.7 },
  { path: 'resources/', changeFrequency: 'weekly', priority: 0.7 },
  { path: 'marketing/', changeFrequency: 'monthly', priority: 0.8 },
  { path: 'guest-speaker/', changeFrequency: 'monthly', priority: 0.6 },
  { path: 'contact/', changeFrequency: 'yearly', priority: 0.5 },
];

export default async function sitemap() {
  const episodes = await getEpisodes();
  return [
    ...PAGES.map((p) => ({
      url: `${SITE_URL}/${p.path}`,
      lastModified: BUILD_DATE,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...episodes.map((e) => ({
      url: `${SITE_URL}/podcast/episode/${e.slug}/`,
      lastModified: isoDate(e.dateLabel) || BUILD_DATE,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ];
}
