'use client';

import Link from 'next/link';
import './webinars.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeEvent } from '@/app/lib/models';
import { parseDate } from '@/app/lib/sheets';
import Tilt from '@/components/Tilt';

const clock = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

export default function WebinarsPage() {
  const { rows, loading } = useSheet('webinars', normalizeEvent);
  const upcoming = [...rows].sort((a, b) => {
    const da = parseDate(a.dateRaw);
    const db = parseDate(b.dateRaw);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  });
  const next = upcoming[0];

  return (
    <div className="wb">
      {/* Programme hero */}
      <section className="wb-hero">
        <div className="wrap wb-hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="wb-hero-copy">
            <span className="eyebrow">Live Webinars</span>
            <h1>An open programme of live, practical sessions.</h1>
            <p>
              Join our live sessions with leading ophthalmic practices, on growth, marketing, and
              operations. Reserve your seat, or catch up on demand.
            </p>
            <div className="wb-hero-actions">
              <Link className="btn btn-primary" href="#programme">View the programme</Link>
              <Link className="btn btn-light" href="/webinars/replays">Watch replays</Link>
            </div>
          </div>

          {next && (
            <div className="float-slow" style={{ position: 'relative' }}>
              <span className="glow-ring" aria-hidden="true" />
            <Tilt className="wb-next" max={8}>
              <span className="wb-next-flag">Next session</span>
              <div className="wb-next-date">
                <span className="wb-next-day">{next.day || '—'}</span>
                <span className="wb-next-mo">{next.monthYear || ''}</span>
              </div>
              <h3>{next.title}</h3>
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
            </div>
          )}
        </div>
      </section>

      {/* Agenda */}
      <section className="wb-agenda" id="programme">
        <div className="wrap">
          <h2 className="wb-agenda-title">Upcoming sessions</h2>
          {loading ? (
            <div className="state"><div className="spinner" />Loading webinars…</div>
          ) : upcoming.length === 0 ? (
            <div className="state">
              <p style={{ marginBottom: 16 }}>No upcoming webinars scheduled right now.</p>
              <Link className="btn btn-primary" href="/webinars/replays">Watch all replays</Link>
            </div>
          ) : (
            <ol className="wb-list">
              {upcoming.map((w) => (
                <li className="wb-item" key={w.id}>
                  <div className="wb-item-date">
                    <span className="wb-d">{w.day || '—'}</span>
                    <span className="wb-m">{(w.monthYear || '').split(' ')[0]}</span>
                  </div>
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
        </div>
      </section>

      {/* Replays strip */}
      <div className="wb-replays-strip">
        <div className="wrap">
          <div>
            <h2>Missed a session?</h2>
            <p>Browse the full on-demand library of past webinars.</p>
          </div>
          <Link className="btn btn-white" href="/webinars/replays">Watch all replays</Link>
        </div>
      </div>
    </div>
  );
}
