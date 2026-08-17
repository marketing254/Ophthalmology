'use client';

import { useState } from 'react';

// Headshot that degrades to a branded monogram circle when the photo
// is missing or fails to load (server components can't use onError).
export default function TeamPhoto({ src, alt, initials }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <span className="ph-mono" role="img" aria-label={alt}>{initials}</span>;
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
