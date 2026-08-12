'use client';

import { useState } from 'react';
import Link from 'next/link';
import './reviews.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeReview } from '@/app/lib/models';
import SmartImage from '@/components/SmartImage';
import Pagination from '@/components/Pagination';

const PER_PAGE = 15;

export default function ReviewsPage() {
  const { rows, loading } = useSheet('reviews', normalizeReview);
  const [page, setPage] = useState(0);
  const avg = rows.length > 0 ? (rows.reduce((s, r) => s + (r.rating || 0), 0) / rows.length).toFixed(1) : '5.0';
  const totalPages = Math.ceil(rows.length / PER_PAGE);
  const paged = rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="rv2">
      {/* Big-rating hero */}
      <section className="rv2-hero">
        <span className="orb orb-teal" style={{ width: 320, height: 320, top: -120, right: '-2%' }} aria-hidden="true" />
        <span className="orb orb-blue o2" style={{ width: 260, height: 260, bottom: -140, left: '20%' }} aria-hidden="true" />
        <div className="wrap rv2-hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="rv2-score">
            <div className="rv2-num">{avg}</div>
            <div className="rv2-stars">★★★★★</div>
            <div className="rv2-count">
              {loading ? 'Loading…' : `${rows.length || 0} review${rows.length === 1 ? '' : 's'}`}
            </div>
          </div>
          <div className="rv2-lead">
            <span className="eyebrow">Reviews</span>
            <h1>What listeners &amp; members say.</h1>
            <p>Real words from the ophthalmologists and teams who tune in and take part.</p>
          </div>
        </div>
      </section>

      {/* Testimonial wall */}
      <section className="rv2-body">
        <div className="wrap">
          {loading ? (
            <div className="state"><div className="spinner" />Loading reviews…</div>
          ) : rows.length === 0 ? (
            <div className="state">Reviews will appear here soon.</div>
          ) : (
            <div className="rv2-wall">
              {paged.map((r, i) => (
                <figure className="rv2-quote" key={i}>
                  <div className="rv2-q-stars">{'★'.repeat(Math.max(0, Math.min(5, r.rating)))}</div>
                  {r.text && <blockquote>{r.text}</blockquote>}
                  <figcaption>
                    <SmartImage className="rv2-avatar" src={r.photo} fallback={r.name} alt={r.name} />
                    <span>
                      <b>{r.name}</b>
                      {r.firm && <em>{r.firm}</em>}
                    </span>
                    {r.platform && <span className="rv2-plat">{r.platform}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPage={setPage} />

          {!loading && rows.length > 0 && (
            <div className="rv2-foot">
              <span>Listened to an episode?</span>
              <Link className="btn btn-primary" href="/contact">Share your feedback</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
