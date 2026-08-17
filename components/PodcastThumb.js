'use client';

import { useState } from 'react';

/**
 * Podcast episode thumbnail.
 * When the sheet provides a real thumbnail (poster_image Drive link) it is
 * shown full-bleed. If it is missing or fails to load, a branded generated
 * cover (palette from the episode number, waveform, EP badge) renders instead,
 * so no episode ever looks broken.
 */
const BARS = [38, 62, 46, 80, 58, 92, 50, 72, 40, 84, 60, 46, 76, 54, 66];

export default function PodcastThumb({ src, episode, title, guest, compact = false }) {
  // attempt 0: given URL; attempt 1: alternate Google image host (dodges a
  // cached failed response on the first URL); attempt 2: generated cover.
  const [attempt, setAttempt] = useState(src ? 0 : 2);
  const n = parseInt(episode, 10) || 0;
  const palette = n % 5;

  const driveId = (String(src || '').match(/[-\w]{25,}/) || [])[0];
  const urls = [src, driveId ? `https://lh3.googleusercontent.com/d/${driveId}=w1200` : null];

  if (attempt < 2 && urls[attempt]) {
    return (
      <img
        className="pthumb-full"
        src={urls[attempt]}
        alt={title || (episode ? `Episode ${episode}` : 'Podcast episode')}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setAttempt(attempt + 1)}
      />
    );
  }

  // Generated branded cover fallback.
  return (
    <div className={`pthumb pt-p${palette}${compact ? ' pt-compact' : ''}`} aria-label={title}>
      <span className="pt-orb" aria-hidden="true" />
      <div className="pt-top">
        <span className="pt-brand">The Business of Eye Care</span>
        {episode ? <span className="pt-ep">EP {episode}</span> : null}
      </div>
      <div className="pt-photo" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {guest ? <div className="pt-guest">{guest}</div> : null}
      <div className="pt-wave" aria-hidden="true">
        {BARS.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
