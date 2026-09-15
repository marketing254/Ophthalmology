import { getEpisodes, isoDate, summarize } from '@/app/lib/build-data';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HEAD each enclosure for its byte size (Apple requires a length attribute). */
async function headLength(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    return parseInt(res.headers.get('content-length') || '0', 10) || 0;
  } catch {
    return 0;
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    })
  );
  return out;
}

export async function GET() {
  const episodes = (await getEpisodes()).filter(
    (e) => e.audioSource && /\.mp3(\?|$)/i.test(e.audioSource)
  );
  const lengths = await mapLimit(episodes, 8, (e) => headLength(e.audioSource));

  const items = episodes
    .map((e, i) => {
      const url = `${SITE_URL}/podcast/episode/${e.slug}/`;
      const date = isoDate(e.dateLabel);
      const pubDate = date ? new Date(`${date}T12:00:00Z`).toUTCString() : '';
      return `    <item>
      <title>${esc(e.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      <description>${esc(summarize(e.description, 700))}</description>
      <enclosure url="${esc(e.audioSource)}" type="audio/mpeg" length="${lengths[i]}"/>
      ${e.epNum ? `<itunes:episode>${e.epNum}</itunes:episode>` : ''}
      <itunes:explicit>false</itunes:explicit>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Ophthalmology Business Podcast</title>
    <link>${SITE_URL}/podcast/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <description>Candid conversations with surgeons, COEs, and executives on marketing, operations, leadership, and growing an eye-care practice. From the Ophthalmology Business Academy (OBA).</description>
    <itunes:author>Ophthalmology Business Academy</itunes:author>
    <itunes:image href="${SITE_URL}/og-cover.png"/>
    <itunes:category text="Business"/>
    <itunes:explicit>false</itunes:explicit>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
