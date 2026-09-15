import { getEpisodes } from '@/app/lib/build-data';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';

export async function GET() {
  const episodes = await getEpisodes();
  const body = `# Ophthalmology Business Academy

> The Ophthalmology Business Academy (also known as OB Academy or OBA) is a free business-education
> platform for ophthalmologists, practice owners, administrators, and certified ophthalmic executives
> across the US and Canada. Founded in 2022 by Naren Arulrajah with key opinion leaders in eye care,
> it publishes The Ophthalmology Business Podcast (75+ episodes, rated 5.0 on Apple Podcasts), hosts
> live expert panels, and shares practical practice-growth resources. Membership is free.

Hosts: Naren Arulrajah (Founder & Host; CEO of Ekwa Marketing), Guido Piquet (Co-host; COO, Mann Eye
Institute, COE, MBA), Sarah Duval, COE, COA (Co-host; Director of Marketing & Business Development,
Concord Eye Center). OB Academy is an initiative of Ekwa Marketing.

## Key pages

- [Home](${SITE_URL}/): what the academy offers
- [About](${SITE_URL}/about/): story, mission, hosts and leadership
- [Podcast](${SITE_URL}/podcast/): all episodes, free to stream
- [Live webinars](${SITE_URL}/webinars/): upcoming expert panels and registration
- [Resources](${SITE_URL}/resources/): playbooks, guides, and checklists
- [Marketing strategy meeting](${SITE_URL}/marketing/): free practice-marketing analysis (provided by Ekwa Marketing)
- [Become a guest or speaker](${SITE_URL}/guest-speaker/)
- [Contact](${SITE_URL}/contact/)
- [Podcast RSS feed](${SITE_URL}/feed.xml)

## Podcast episodes

${episodes.map((e) => `- [Ep ${e.episode}: ${e.title}](${SITE_URL}/podcast/episode/${e.slug}/)${e.guestName ? ` — with ${e.guestName}` : ''}`).join('\n')}

## Full detail

- [llms-full.txt](${SITE_URL}/llms-full.txt): this file plus episode summaries
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
