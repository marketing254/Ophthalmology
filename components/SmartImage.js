'use client';

import { useState } from 'react';

/**
 * Plain <img> with a graceful initials fallback when the (often Drive-hosted)
 * source fails to load. Used everywhere we render Sheet-supplied photos.
 */
export default function SmartImage({ src, alt, fallback, className, style, ...rest }) {
  const [failed, setFailed] = useState(!src);
  const initials =
    fallback || (alt || 'OB').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  if (failed) {
    return (
      <span className={className} style={{ ...style }} data-fallback aria-label={alt}>
        {initials}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      style={style}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
