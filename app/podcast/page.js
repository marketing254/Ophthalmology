'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import './podcast.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizePodcast } from '@/app/lib/models';
import { isUnlocked } from '@/app/lib/leads';
import PodcastThumb from '@/components/PodcastThumb';
import Tilt from '@/components/Tilt';
import Pagination from '@/components/Pagination';

const PER_PAGE = 12;

export default function PodcastPage() {
  const { rows, loading } = useSheet('podcasts', normalizePodcast);
  const [filter, setFilter] = useState('All');
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    document.title = 'The Podcast';
    setLocked(!isUnlocked('podcast'));
  }, []);

  const categories = useMemo(() => {
    const seen = [];
    for (const ep of rows) if (ep.category && !seen.includes(ep.category)) seen.push(ep.category);
    return seen;
  }, [rows]);

  const [page, setPage] = useState(0);
  const newestFirst = useMemo(() => [...rows].sort((a, b) => b.epNum - a.epNum), [rows]);
  const latest = newestFirst[0];
  const episodes = useMemo(
    () => (filter === 'All' ? newestFirst : newestFirst.filter((e) => e.category === filter)),
    [newestFirst, filter]
  );
  useEffect(() => setPage(0), [filter]);
  const totalPages = Math.ceil(episodes.length / PER_PAGE);
  const paged = episodes.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const goPage = (p) => {
    setPage(p);
    document.getElementById('pod-index')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pod">
      {/* Studio hero */}
      <section className="pod-hero">
        <span className="orb orb-teal" style={{ width: 360, height: 360, top: -120, right: '-4%' }} aria-hidden="true" />
        <span className="orb orb-blue o2" style={{ width: 300, height: 300, bottom: -140, left: '-5%' }} aria-hidden="true" />
        <div className="wrap pod-hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="pod-hero-copy">
            <div className="pod-onair">
              <span className="pod-dot" /> On the air
            </div>
            <h1>The business of eye care, one conversation at a time.</h1>
            <p>
              Candid conversations with surgeons, operators, and executives on marketing, operations,
              and growing an eye-care practice. Free to stream.
            </p>
            <div className="pod-eq" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />)}
            </div>
            <div className="pod-stats">
              <div><b>{rows.length || '75'}+</b><span>episodes</span></div>
              <div><b>5.0★</b><span>Apple Podcasts</span></div>
              <div><b>Free</b><span>to stream</span></div>
            </div>
          </div>

          {latest && (
            <div className="float-slow" style={{ position: 'relative' }}>
              <span className="glow-ring" aria-hidden="true" />
            <Tilt className="pod-feature" max={9}>
              <div className="pod-feature-art">
                <PodcastThumb src={latest.poster || latest.guestPhoto} episode={latest.episode} title={latest.title} guest={latest.guestName} />
                <span className="pod-feature-badge">Ep {latest.episode}</span>
              </div>
              <div className="pod-feature-body">
                <span className="pod-feature-kicker">Latest episode</span>
                <h3>{latest.title}</h3>
                <div className="pod-feature-guest">{latest.guestName || 'OB Academy'}</div>
                <Link className="btn btn-primary" href={`/podcast/episode/?e=${latest.slug}`}>Listen now</Link>
              </div>
            </Tilt>
            </div>
          )}
        </div>
      </section>

      {/* Episode index */}
      <section className="pod-index" id="pod-index">
        <div className="wrap">
          <div className="pod-index-head">
            <h2>All episodes</h2>
            {categories.length > 0 && (
              <div className="pod-filter">
                <button className={`pod-chip${filter === 'All' ? ' active' : ''}`} onClick={() => setFilter('All')}>All</button>
                {categories.map((c) => (
                  <button key={c} className={`pod-chip${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="state"><div className="spinner" />Loading episodes…</div>
          ) : episodes.length === 0 ? (
            <div className="state">No episodes published yet, check back soon.</div>
          ) : (
            <>
            <ol className="pod-list">
              {paged.map((ep) => (
                <li key={ep.slug}>
                  <Link href={`/podcast/episode/?e=${ep.slug}`} className="pod-row">
                    <div className="pod-row-art">
                      <PodcastThumb src={ep.poster || ep.guestPhoto} episode={ep.episode} title={ep.title} guest={ep.guestName} compact />
                      <span className="pod-row-play">{locked ? lockSvg : playSvg}</span>
                    </div>
                    <div className="pod-row-main">
                      <div className="pod-row-meta">
                        <span className="pod-row-ep">Ep {ep.episode}</span>
                        {ep.epNum >= 21 && <span className="pod-row-new">New</span>}
                        {[ep.dateLabel, ep.category].filter(Boolean).join(' · ')}
                      </div>
                      <h3>{ep.title}</h3>
                      <div className="pod-row-guest">
                        {ep.isPanel ? `Panel of ${Math.max(1, ep.speakers.length - 1)}` : (ep.guestName || 'OB Academy')}
                      </div>
                    </div>
                    <span className="pod-row-cta">Listen</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Pagination page={page} totalPages={totalPages} onPage={goPage} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

const playSvg = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
);
const lockSvg = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 0 1 6 0v3H9z" /></svg>
);
