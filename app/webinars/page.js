import Link from 'next/link';
import './webinars.css';

export default function WebinarsPage() {
  return (
    <div className="wb">
      <section className="wb-hero">
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="wb-hero-copy">
            <span className="eyebrow">Live Webinars &amp; Panels</span>
            <h1>An open programme of live, practical sessions.</h1>
            <p>
              Live webinars and expert panels with leading ophthalmic practices, on growth,
              marketing, and operations.
            </p>
          </div>
        </div>
      </section>

      <section className="wb-agenda">
        <div className="wrap">
          <div className="state" style={{ padding: '72px 24px' }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>Upcoming sessions are being scheduled</h2>
            <p style={{ maxWidth: 480, margin: '0 auto 22px' }}>
              Our live webinar and panel programme is coming soon. Join the newsletter on the home
              page and we will let you know the moment registration opens.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/contact">Get notified</Link>
              <Link className="btn btn-light" href="/podcast">Listen to the podcast meanwhile</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
