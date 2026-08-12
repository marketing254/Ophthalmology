'use client';

import { useState } from 'react';
import SmartImage from './SmartImage';
import BrandIcon from './BrandIcon';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
const isUrl = (v) => /^(https?:)?\/\//i.test(v || '');

function hrefFor(v) {
  if (isEmail(v)) return `mailto:${v}`;
  if (isUrl(v)) return v.startsWith('http') ? v : `https://${v}`;
  return null;
}

const BIO_LIMIT = 200;

export default function PersonCard({ p }) {
  const [open, setOpen] = useState(false);
  const bio = p.bio || '';
  const long = bio.length > BIO_LIMIT;
  const shown = open || !long ? bio : `${bio.slice(0, BIO_LIMIT).trimEnd()}…`;

  const links = (p.links || []).filter((l) => hrefFor(l.value));

  return (
    <article className="person-card">
      <div className="ph">
        <SmartImage src={p.photo} alt={p.name} fallback={p.name} />
      </div>
      <h3>{p.name}</h3>
      {p.role && <div className="role">{p.role}</div>}
      {p.org && <div className="org">{p.org}</div>}

      {bio && (
        <p className="pc-bio">
          {shown}
          {long && (
            <button type="button" className="pc-more" onClick={() => setOpen((v) => !v)}>
              {open ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>
      )}

      {links.length > 0 && (
        <div className="pc-social">
          {links.map((l, i) => (
            <a
              key={i}
              href={hrefFor(l.value)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.type}
              title={l.type}
              className="pc-soc"
            >
              <BrandIcon type={l.type} size={15} />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
