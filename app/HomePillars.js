'use client';

import Link from 'next/link';
import Tilt from '@/components/Tilt';

const ICONS = {
  mic: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8" />
    </svg>
  ),
  panel: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="15" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  ),
};

const PILLARS = [
  { ico: 'mic', h: 'The Podcast', href: '/podcast', cta: 'Browse episodes',
    p: 'Candid conversations with surgeons, COEs, and executives on marketing, operations, leadership, and growth.' },
  { ico: 'panel', h: 'Live Expert Panels', href: '/webinars', cta: 'See the schedule',
    p: 'Biweekly debates where practice leaders disagree out loud, patient acquisition, dry eye revenue, AI diagnostics, and more.' },
  { ico: 'book', h: 'Playbooks & Resources', href: '/resources', cta: 'Join free to access',
    p: 'Practical guides, checklists, and replays members use to act on what they hear, free with your OB Academy membership.' },
];

export default function HomePillars() {
  return (
    <div className="p-grid">
      {PILLARS.map((x) => (
        <Tilt className="p-card reveal" key={x.h}>
          <div className="p-ico">{ICONS[x.ico]}</div>
          <h3>{x.h}</h3>
          <p>{x.p}</p>
          <Link href={x.href}>{x.cta}</Link>
        </Tilt>
      ))}
    </div>
  );
}
