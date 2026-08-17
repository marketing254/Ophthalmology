import Link from 'next/link';
import '../webinars.css';

export default function WebinarReplaysPage() {
  return (
    <div className="rp">
      <section className="rp-hero">
        <span className="orb orb-teal" style={{ width: 300, height: 300, top: -110, right: '0%' }} aria-hidden="true" />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <Link className="rp-back" href="/webinars">← Upcoming webinars</Link>
          <span className="eyebrow" style={{ color: '#B7CCDE' }}>On-Demand Library</span>
          <h1>Webinar replays</h1>
          <p>Full-length sessions from leading ophthalmic practices, free, on your schedule.</p>
        </div>
      </section>

      <section className="rp-body">
        <div className="wrap">
          <div className="state" style={{ padding: '72px 24px' }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>Replays are coming soon</h2>
            <p style={{ maxWidth: 460, margin: '0 auto 22px' }}>
              Recordings of our live sessions will appear here after each event. The programme is
              being scheduled now, check back soon.
            </p>
            <Link className="btn btn-primary" href="/podcast">Browse the podcast meanwhile</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
