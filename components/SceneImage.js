'use client';

import { useState } from 'react';

/**
 * Scenic photography with a guaranteed fallback: if the remote image fails,
 * swaps to the local hero photo so the layout never shows a broken frame.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function SceneImage({ src, alt = '', className, style, fallback = `${BASE}/hero.jpg` }) {
  const [cur, setCur] = useState(src);
  return (
    <img
      src={cur}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      style={style}
      onError={() => { if (cur !== fallback) setCur(fallback); }}
    />
  );
}
