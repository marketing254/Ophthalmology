'use client';

import EpisodeView from '@/components/EpisodeView';

// Back-compat route: /podcast/episode/?e=slug (links now point at the static
// per-episode pages; this stays so old shares keep working).
export default function PodcastEpisodePage() {
  return <EpisodeView />;
}
