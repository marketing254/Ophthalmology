'use client';

import { useSheet } from '@/app/lib/useSheet';
import { normalizeReview } from '@/app/lib/models';

export default function HomeReviews() {
  const { rows, loading } = useSheet('reviews', normalizeReview);
  if (loading || rows.length === 0) return null;

  const reviews = rows.slice(0, 3);

  return (
    <section className="reviews">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">What listeners say</span>
          <h2>Rated by the people it&apos;s made for</h2>
        </div>
        <div className="r-grid">
          {reviews.map((r, i) => (
            <div className="r-card reveal" key={i}>
              <div className="stars">{'★'.repeat(Math.min(5, r.rating || 5))}</div>
              <p>“{r.text}”</p>
              <cite>
               , {r.name}
                {r.firm ? `, ${r.firm}` : ''}
                {r.platform ? ` · ${r.platform}` : ''}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
