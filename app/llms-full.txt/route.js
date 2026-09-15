import { getEpisodes, isoDate, summarize } from '@/app/lib/build-data';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';

export async function GET() {
  const episodes = await getEpisodes();
  const body = `# Ophthalmology Business Academy — full content index

> The Ophthalmology Business Academy (OB Academy, OBA) is a free business-education platform for
> ophthalmologists, practice owners, administrators, and certified ophthalmic executives across the
> US and Canada. Founded in 2022 by Naren Arulrajah with key opinion leaders in eye care. It
> publishes The Ophthalmology Business Podcast (75+ episodes, rated 5.0 on Apple Podcasts), hosts
> live expert panels, and shares practical practice-growth resources. Membership is free.
> OB Academy is an initiative of Ekwa Marketing, a digital marketing company serving doctors in
> private practice across the US and Canada.

Hosts:
- Naren Arulrajah — Founder & Host. CEO of Ekwa Marketing.
- Guido Piquet — Co-host. Chief Operations Officer, Mann Eye Institute (Houston & Austin). COE, MBA.
- Sarah Duval, COE, COA — Co-host. Director of Marketing & Business Development, Concord Eye Center;
  past president, National Board for the Certification of Ophthalmic Executives.

Site: ${SITE_URL}/
Podcast feed: ${SITE_URL}/feed.xml

## Episodes

${episodes
  .map((e) => {
    const date = isoDate(e.dateLabel);
    return `### Ep ${e.episode}: ${e.title}
URL: ${SITE_URL}/podcast/episode/${e.slug}/${e.guestName ? `\nGuest: ${e.guestName}` : ''}${date ? `\nPublished: ${date}` : ''}${e.description ? `\n${summarize(e.description, 600)}` : ''}`;
  })
  .join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
