'use client';

import Link from 'next/link';
import PodcastThumb from '@/components/PodcastThumb';
import { useSheet } from '@/app/lib/useSheet';
import { normalizePodcast } from '@/app/lib/models';

export default function HomeEpisodes() {
  const { rows, loading } = useSheet('podcasts', normalizePodcast);
  if (loading || rows.length === 0) return null; // hide until the sheet has data

  const latest = [...rows].sort((a, b) => b.epNum - a.epNum).slice(0, 3);

  return (
    <section className="episodes" id="episodes">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The Ophthalmology Business Podcast</span>
          <h2>Latest from the show</h2>
          <p>New conversations on the business of eye care, pulled live from our library.</p>
        </div>
        <div className="ep-grid">
          {latest.map((ep) => (
            <article className="ep-card reveal" key={ep.slug}>
              <div className="ep-art">
                <PodcastThumb src={ep.poster || ep.guestPhoto} episode={ep.episode} title={ep.title} guest={ep.guestName} />
              </div>
              <div className="ep-body">
                <div className="ep-num">Episode {ep.episode}</div>
                <h3>{ep.title}</h3>
                <div className="ep-people">
                  <span>
                    {ep.isPanel
                      ? `Panel of ${Math.max(1, ep.speakers.length - 1)}`
                      : ep.guestName
                        ? `With ${ep.guestName}`
                        : 'OB Academy'}
                  </span>
                </div>
                <Link className="ep-link" href={`/podcast/episode/?e=${ep.slug}`}>
                  Listen to the episode
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="ep-more reveal">
          <Link className="btn btn-light" href="/podcast">
            Browse all episodes
          </Link>
        </div>
      </div>
    </section>
  );
}
