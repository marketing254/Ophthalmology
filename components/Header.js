'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Marquee from './Marquee';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Ordered to mirror the reference site's information architecture.
const NAV = [
  { href: '/about', label: 'About Us' },
  {
    href: '/webinars',
    label: 'Events',
    children: [
      { href: '/webinars', label: 'Upcoming Webinars', desc: 'Register for the next live session' },
      { href: '/webinars/replays', label: 'Webinar Replays', desc: 'Watch past sessions on demand' },
    ],
  },
  { href: '/podcast', label: 'Podcast' },
  { href: '/reviews', label: 'Reviews' },
  {
    href: '/resources',
    label: 'Resources',
    children: [
      { href: '/resources', label: 'Free Resources', desc: 'Guides, checklists & playbooks' },
      { href: '/podcast', label: 'Podcast Library', desc: 'Every episode, free to stream' },
    ],
  },
  { href: '/guest-speaker', label: 'Guest / Speaker' },
  { href: '/marketing', label: 'Marketing' },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Announcement marquee, latest podcast + next webinar */}
      <Marquee />

      <header className={`site${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <Link className="logo" href="/" aria-label="Ophthalmology Business Academy home">
            <img src={`${BASE}/logo-nav.svg`} alt="Ophthalmology Business Academy" width="185" height="52" />
          </Link>

          <nav className="main" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div className="has-dd" key={item.label}>
                  <Link href={item.href} className={isActive(item.href) ? 'active' : undefined}>
                    {item.label}
                    <svg className="dd-caret" viewBox="0 0 10 6" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Link>
                  <div className="dropdown">
                    {item.children.map((c) => (
                      <Link key={c.label} href={c.href}>
                        <span className="dd-l">{c.label}</span>
                        {c.desc && <span className="dd-d">{c.desc}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : undefined}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="nav-cta">
            <Link className="nav-book" href="/contact">
              Contact Now <Arrow />
            </Link>
            <button
              className="menu-btn"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav className={`mobile-nav${open ? ' open' : ''}`} aria-label="Mobile">
          {NAV.map((item) => (
            <div key={item.label} className="m-group">
              <Link href={item.href}>{item.label}</Link>
              {item.children &&
                item.children.map((c) => (
                  <Link key={c.label} href={c.href} className="m-sub">
                    {c.label}
                  </Link>
                ))}
            </div>
          ))}
          <Link href="/contact" className="m-cta">Contact Now →</Link>
        </nav>
      </header>
    </>
  );
}
