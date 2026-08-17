import Link from 'next/link';
import './reviews.css';

export default function ReviewsPage() {
  return (
    <div className="rv2">
      <section className="rv2-hero">
        <span className="orb orb-teal" style={{ width: 320, height: 320, top: -120, right: '-2%' }} aria-hidden="true" />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="rv2-lead">
            <span className="eyebrow" style={{ color: '#A8C8FF' }}>Reviews</span>
            <h1>What listeners &amp; members say.</h1>
            <p>Real words from the ophthalmologists and teams who tune in and take part.</p>
          </div>
        </div>
      </section>

      <section className="rv2-body">
        <div className="wrap">
          <div className="state" style={{ padding: '72px 24px' }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>Reviews are on their way</h2>
            <p style={{ maxWidth: 460, margin: '0 auto 22px' }}>
              We are collecting feedback from our listeners and members right now. Check back soon,
              or be one of the first to share yours.
            </p>
            <Link className="btn btn-primary" href="/contact">Share your feedback</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
