'use client';

import Link from 'next/link';
import Tilt from '@/components/Tilt';
import PodcastThumb from '@/components/PodcastThumb';
import { useSheet } from '@/app/lib/useSheet';
import { normalizePodcast } from '@/app/lib/models';

export default function HomeHeroCard() {
  const { rows } = useSheet('podcasts', normalizePodcast);
  const latest = [...rows].sort((a, b) => b.epNum - a.epNum)[0];
  if (!latest) return null;

  return (
    <Tilt className="hero-card" max={9}>
      <div className="hero-card-art">
        <PodcastThumb src={latest.poster || latest.guestPhoto} episode={latest.episode} title={latest.title} guest={latest.guestName} />
        <span className="hero-card-play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
        </span>
      </div>
      <div className="hero-card-body">
        <span className="hero-card-kicker">Latest episode · Ep {latest.episode}</span>
        <h3>{latest.title}</h3>
        <Link className="btn btn-primary" href={`/podcast/${latest.slug}`}>Listen now</Link>
      </div>
    </Tilt>
  );
}
