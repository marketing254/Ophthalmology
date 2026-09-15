'use client';

import Link from 'next/link';
import './webinars.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeEvent } from '@/app/lib/models';
import { parseDate } from '@/app/lib/sheets';
import Tilt from '@/components/Tilt';
import SmartImage from '@/components/SmartImage';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Local banner fallbacks for events whose sheet row has no banner_image yet.
// The sheet value always wins once it exists.
const LOCAL_BANNERS = [
  { match: 'dry-eye', src: `${BASE}/events/dry-eye-service-line.webp` },
];
const bannerFor = (ev) =>
  ev.banner || (LOCAL_BANNERS.find((b) => (ev.id || '').includes(b.match))?.src ?? '');

const clock = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

export default function WebinarsPage() {
  const { rows, loading } = useSheet('webinars', normalizeEvent);

  // Split on today: upcoming soonest-first on top, past sessions below.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dated = rows.map((w) => ({ ...w, _d: parseDate(w.dateRaw) }));
  const upcoming = dated
    .filter((w) => !w._d || w._d >= today)
    .sort((a, b) => (a._d && b._d ? a._d - b._d : a._d ? -1 : 1));
  const past = dated
    .filter((w) => w._d && w._d < today)
    .sort((a, b) => b._d - a._d);
  const next = upcoming[0];

  return (
    <div className="wb">
      {/* Programme hero */}
      <section className="wb-hero">
        <div className="wrap wb-hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="wb-hero-copy">
            <span className="eyebrow">Live Webinars</span>
            <h1>
              An open programme of
              <br />
              <span className="title-dim">live, practical sessions.</span>
            </h1>
            <p>
              Join our live sessions with leading ophthalmic practices, on growth, marketing, and
              operations. Reserve your seat, or catch up on demand.
            </p>
            <div className="wb-hero-actions">
              <Link className="btn btn-primary" href="#programme">View the programme</Link>
              <Link className="btn btn-light" href="/podcast">Browse the podcast</Link>
            </div>
          </div>

          {next && (
            <Tilt className="wb-next" max={6}>
              {bannerFor(next) && (
                <div className="wb-next-banner">
                  <SmartImage src={bannerFor(next)} alt={next.title} fallback="" />
                </div>
              )}
              <span className="wb-next-flag">Next session</span>
              <div className="wb-next-date">
                <span className="wb-next-day">{next.day || '—'}</span>
                <span className="wb-next-mo">{next.monthYear || ''}</span>
              </div>
              <h3>{next.title}</h3>
              {next.subtitle && <p className="wb-next-sub">{next.subtitle}</p>}
              {next.time && <div className="wb-next-time">{clock}{next.time}</div>}
              <a
                className="btn btn-primary"
                href={next.registerUrl || '/contact'}
                target={next.registerUrl ? '_blank' : undefined}
                rel={next.registerUrl ? 'noopener' : undefined}
              >
                Reserve my seat
              </a>
            </Tilt>
          )}
        </div>
      </section>

      {/* Programme */}
      <section className="wb-agenda" id="programme">
        <div className="wrap">
          <h2 className="wb-agenda-title">Upcoming sessions</h2>
          {loading ? (
            <div className="state"><div className="spinner" />Loading webinars…</div>
          ) : upcoming.length === 0 ? (
            <div className="state">
              <p style={{ marginBottom: 16 }}>No upcoming webinars scheduled right now.</p>
              <Link className="btn btn-primary" href="/podcast">Browse the podcast</Link>
            </div>
          ) : (
            <ol className="wb-list">
              {upcoming.map((w) => (
                <li className={`wb-item${bannerFor(w) ? ' has-banner' : ''}`} key={w.id}>
                  <div className="wb-item-date">
                    <span className="wb-d">{w.day || '—'}</span>
                    <span className="wb-m">{(w.monthYear || '').split(' ')[0]}</span>
                  </div>
                  {bannerFor(w) && (
                    <div className="wb-item-banner">
                      <SmartImage src={bannerFor(w)} alt={w.title} fallback="" />
                    </div>
                  )}
                  <div className="wb-item-main">
                    <h3>{w.title}</h3>
                    {w.subtitle && <p className="wb-item-sub">{w.subtitle}</p>}
                    <div className="wb-item-meta">
                      {w.time && <span className="wb-item-time">{clock}{w.time}</span>}
                      {w.panelists.length > 0 && <span className="wb-item-panel">{w.panelists.join(' · ')}</span>}
                    </div>
                  </div>
                  <div className="wb-item-action">
                    <a
                      className="btn btn-primary"
                      href={w.registerUrl || '/contact'}
                      target={w.registerUrl ? '_blank' : undefined}
                      rel={w.registerUrl ? 'noopener' : undefined}
                    >
                      Reserve my seat
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {past.length > 0 && (
            <>
              <h2 className="wb-agenda-title wb-past-title">Past sessions</h2>
              <ol className="wb-list wb-past">
                {past.map((w) => (
                  <li className="wb-item" key={w.id}>
                    <div className="wb-item-date">
                      <span className="wb-d">{w.day || '—'}</span>
                      <span className="wb-m">{(w.monthYear || '').split(' ')[0]}</span>
                    </div>
                    <div className="wb-item-main">
                      <h3>{w.title}</h3>
                      {w.subtitle && <p className="wb-item-sub">{w.subtitle}</p>}
                      {w.panelists.length > 0 && (
                        <div className="wb-item-meta"><span className="wb-item-panel">{w.panelists.join(' · ')}</span></div>
                      )}
                    </div>
                    <div className="wb-item-action">
                      <span className="wb-ended">Session ended</span>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>

      {/* Podcast strip */}
      <div className="wb-replays-strip">
        <div className="wrap">
          <div>
            <h2>Can&apos;t make a live session?</h2>
            <p>The podcast covers the same ground, 75+ episodes, free to stream.</p>
          </div>
          <Link className="btn btn-white" href="/podcast">Browse the podcast</Link>
        </div>
      </div>
    </div>
  );
}
