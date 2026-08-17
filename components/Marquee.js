'use client';

import Link from 'next/link';
import { useSheet } from '@/app/lib/useSheet';
import { normalizePodcast, normalizeEvent } from '@/app/lib/models';
import { parseDate } from '@/app/lib/sheets';

export default function Marquee() {
  const pods = useSheet('podcasts', normalizePodcast);
  const webs = useSheet('webinars', normalizeEvent);

  // Latest episode = highest episode number.
  const latest = [...pods.rows].sort((a, b) => b.epNum - a.epNum)[0];

  // Next webinar = soonest upcoming (fallback to first row).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [...webs.rows]
    .filter((w) => {
      const d = parseDate(w.dateRaw);
      return !d || d >= today;
    })
    .sort((a, b) => (parseDate(a.dateRaw) || 0) - (parseDate(b.dateRaw) || 0))[0] || webs.rows[0];

  const items = [];
  if (latest) {
    items.push(
      <Link className="mq-item" href={`/podcast/episode/?e=${latest.slug}`} key="pod">
        <span className="mq-tag">Latest Podcast</span>
        <span className="mq-text">Episode {latest.episode}: {latest.title}</span>
      </Link>
    );
  }

  if (items.length === 0) {
    // Graceful fallback before data loads / when empty.
    return (
      <div className="marquee">
        <div className="wrap mq-static">
          <span className="mq-text">Ophthalmology Business Academy, the business of eye care</span>
        </div>
      </div>
    );
  }

  // Duplicate the run so the scroll loops seamlessly.
  const run = (
    <div className="mq-run" aria-hidden={false}>
      {items}
    </div>
  );

  return (
    <div className="marquee" role="region" aria-label="Latest updates">
      <div className="mq-viewport">
        <div className="mq-track">
          {run}
          <div className="mq-run" aria-hidden="true">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}
