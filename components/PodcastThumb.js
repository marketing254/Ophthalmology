'use client';

import { useState } from 'react';

/**
 * Generated podcast cover-art thumbnail.
 * Every episode gets branded art: a deterministic color scheme (from the
 * episode number), the guest photo in a ringed circle (when it loads),
 * a waveform, the episode number, and the show mark. Works for any
 * episode added to the sheet, no manual asset needed.
 */
const BARS = [38, 62, 46, 80, 58, 92, 50, 72, 40, 84, 60, 46, 76, 54, 66];

export default function PodcastThumb({ src, episode, title, guest, compact = false }) {
  const [photoOk, setPhotoOk] = useState(Boolean(src));
  const n = parseInt(episode, 10) || 0;
  const palette = n % 5;

  return (
    <div className={`pthumb pt-p${palette}${compact ? ' pt-compact' : ''}`} aria-label={title}>
      <span className="pt-orb" aria-hidden="true" />

      <div className="pt-top">
        <span className="pt-brand">The Business of Eye Care</span>
        {episode ? <span className="pt-ep">EP {episode}</span> : null}
      </div>

      <div className="pt-photo" aria-hidden="true">
        {photoOk ? (
          <img src={src} alt="" loading="lazy" onError={() => setPhotoOk(false)} />
        ) : (
          <svg viewBox="0 0 24 24">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
            <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
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
