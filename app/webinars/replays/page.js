'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../webinars.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeWebinar } from '@/app/lib/models';
import { isUnlocked } from '@/app/lib/leads';
import SmartImage from '@/components/SmartImage';
import Pagination from '@/components/Pagination';

const PER_PAGE = 8;

export default function WebinarReplaysPage() {
  const { rows, loading } = useSheet('replays', normalizeWebinar);
  const [cat, setCat] = useState('All');
  const [page, setPage] = useState(0);

  const replays = rows.filter((w) => w.embedUrl);
  const categories = ['All', ...Array.from(new Set(replays.map((w) => w.category).filter(Boolean)))];
  const shown = cat === 'All' ? replays : replays.filter((w) => w.category === cat);
  const unlocked = isUnlocked('webinar');
  useEffect(() => setPage(0), [cat]);
  const totalPages = Math.ceil(shown.length / PER_PAGE);
  const paged = shown.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="rp">
      {/* Cinema header */}
      <section className="rp-hero">
        <span className="orb orb-teal" style={{ width: 300, height: 300, top: -110, right: '0%' }} aria-hidden="true" />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <Link className="rp-back" href="/webinars">← Upcoming webinars</Link>
          <span className="eyebrow" style={{ color: '#A8C8FF' }}>On-Demand Library</span>
          <h1>Webinar replays</h1>
          <p>Watch full-length sessions from leading ophthalmic practices, free, on your schedule.</p>
        </div>
      </section>

      <section className="rp-body">
        <div className="wrap">
          {categories.length > 2 && (
            <div className="rp-filter">
              {categories.map((c) => (
                <button key={c} className={`pod-chip${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="state"><div className="spinner" />Loading replays…</div>
          ) : shown.length === 0 ? (
            <div className="state">No replays yet, check back soon.</div>
          ) : (
            <div className="rp-grid">
              {paged.map((w) => (
                <Link key={w.id} href={`/webinars/replay/?e=${w.slug}`} className="rp-card">
                  <div className="rp-thumb">
                    <SmartImage src={w.thumbnail} alt={w.title} fallback={w.title} />
                    <span className="rp-play">
                      {unlocked
                        ? <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
                        : <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4V6z" /></svg>}
                    </span>
                    {w.duration && <span className="rp-dur">{w.duration}</span>}
                  </div>
                  <div className="rp-info">
                    <div className="rp-meta">{[w.dateLabel, w.category].filter(Boolean).join(' · ')}</div>
                    <h3>{w.title}</h3>
                    {w.speakers && <div className="rp-by">{w.speakers.replace(/\|/g, ' · ')}</div>}
                    <span className="rp-cta">Watch replay</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </section>
    </div>
  );
}
