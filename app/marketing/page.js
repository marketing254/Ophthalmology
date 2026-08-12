import './marketing.css';
import SceneImage from '@/components/SceneImage';

export const metadata = {
  title: 'Free Marketing Strategy Meeting',
  description:
    "Book a free Marketing Strategy Meeting: a one-on-one analysis of your practice's digital marketing, Google rankings, website conversion, and patient acquisition, with no obligation.",
};

export default function MarketingPage() {
  return (
    <>
      {/* Booking-first hero, the calendar leads */}
      <section className="mk-hero" id="book">
        <div className="wrap">
          <div className="mk-hero-grid">
            {/* Booking card, first in markup so it leads on mobile; CSS order
                puts it on the right on desktop. */}
            <div className="mk-book reveal" id="form">
              <div className="mk-book-head">
                <span className="tag">Pick a time</span>
                <h2>Book your free strategy meeting</h2>
                <p className="sub">Choose a slot below, most practices meet within the week.</p>
              </div>
              <div className="mk-book-body">
                <iframe
                  src="https://ekwasales-withoutceo.youcanbook.me/?noframe=true&skipHeaderFooter=true"
                  title="Schedule your free strategy meeting"
                  className="cal-embed"
                  style={{ width: '100%', height: 560, border: 0, background: 'transparent' }}
                  allowTransparency="true"
                />
              </div>
            </div>

            <div className="mk-hero-copy reveal">
              <span className="eyebrow">Free marketing strategy meeting</span>
              <h1>
                Find out why your practice isn&apos;t getting <em>the patients it should.</em>
              </h1>
              <ul className="mk-checks">
                <li>
                  <svg viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>
                    <b>See exactly where you rank</b> for the procedures that drive your revenue
                  </span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>
                    <b>Learn what competitors near you are doing</b> to win the patients you&apos;re
                    missing
                  </span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>
                    <b>Leave with a written action plan</b> that&apos;s yours to keep, free, no
                    obligation
                  </span>
                </li>
              </ul>
              <div className="mk-hero-actions">
                <a className="btn btn-light" href="#how">
                  How it works
                </a>
              </div>
              <p className="mk-hero-note">
                Built on the experience of serving 15,000+ physicians across the US and Canada.
              </p>
              <div className="img-frame mk-hero-img">
                <SceneImage
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=70"
                  alt="Strategy meeting between practice partners"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we analyze */}
      <section>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">What we analyze</span>
            <h2>A complete picture of your digital presence</h2>
            <p>
              Before the meeting, our team researches your practice the way a prospective patient
              would. In the session, we walk you through what we found.
            </p>
          </div>
          <div className="card-grid cols-2">
            <article className="mk-card reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3>Google visibility</h3>
              <p>
                Where you rank for high-value searches in your market, &quot;cataract surgeon near
                me,&quot; LASIK, premium lens options, and who outranks you.
              </p>
            </article>
            <article className="mk-card reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M8 21h8M12 18v3" />
                </svg>
              </div>
              <h3>Website conversion</h3>
              <p>
                Whether your site turns visitors into booked consultations, speed, mobile
                experience, and the click-to-consultation journey.
              </p>
            </article>
            <article className="mk-card reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 17.3l-5.4 3.2 1.4-6.1L3.3 10l6.2-.5L12 3.8l2.5 5.7 6.2.5-4.7 4.4 1.4 6.1z" />
                </svg>
              </div>
              <h3>Reviews &amp; reputation</h3>
              <p>
                How your ratings, review volume, and responses compare to the practices competing
                for your patients.
              </p>
            </article>
            <article className="mk-card reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M3 12h4l2-7 4 14 2-7h6" />
                </svg>
              </div>
              <h3>Growth opportunities</h3>
              <p>
                The specific gaps worth fixing first, prioritized by revenue impact, so you know
                exactly where to start.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: 'var(--mist)' }}>
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">How it works</span>
            <h2>Three steps, about an hour of your time</h2>
          </div>
          <div className="card-grid">
            <article className="mk-card mk-step reveal">
              <span className="num">Step 01</span>
              <h3>Book your session</h3>
              <p>
                Pick a time that works for you. We&apos;ll confirm by email and ask a few quick
                questions about your practice and goals.
              </p>
            </article>
            <article className="mk-card mk-step reveal">
              <span className="num">Step 02</span>
              <h3>We do the research</h3>
              <p>
                Before we meet, our team audits your rankings, website, and local competition, the
                same analysis we run for our own clients.
              </p>
            </article>
            <article className="mk-card mk-step reveal">
              <span className="num">Step 03</span>
              <h3>Walk through the findings</h3>
              <p>
                In a one-on-one meeting, we show you what we found and leave you with a prioritized,
                written action plan. It&apos;s yours either way.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Single compact stats band */}
      <div className="mk-stats">
        <div className="wrap">
          <div className="mk-stat">
            <b>15,000+</b>
            <span>physicians served across North America</span>
          </div>
          <div className="mk-stat">
            <b>95%</b>
            <span>of clients stay year after year</span>
          </div>
          <div className="mk-stat">
            <b>200+</b>
            <span>marketing specialists on the team</span>
          </div>
          <a className="revlink" href="https://www.ekwa.com/">
            Read client reviews
          </a>
        </div>
      </div>

      {/* Testimonial quote */}
      <section className="mk-quote">
        <div className="wrap reveal">
          <div className="stars" aria-label="5 out of 5 stars">
            ★★★★★
          </div>
          <blockquote>
            &quot;Naren has personally consulted with doctors who own and operate ophthalmology
            practices across the US, helping them scale{' '}
            <span>from startups to multi-million dollar practices.</span>&quot;
          </blockquote>
          <cite>
            <b>Why practices take this meeting</b>From the OB Academy faculty introduction
          </cite>
        </div>
      </section>

      {/* Trimmed FAQ */}
      <section>
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Common questions</span>
            <h2>Before you book</h2>
          </div>
          <div className="mk-faq reveal">
            <details>
              <summary>Is this really free? What&apos;s the catch?</summary>
              <p className="ans">
                Yes, completely free, and the written action plan is yours to keep regardless of
                what you decide. The honest reason we offer it: some practices that take the meeting
                choose to work with Ekwa afterward. There is no pressure either way, and many
                attendees simply implement the plan themselves.
              </p>
            </details>
            <details>
              <summary>Is this a sales call?</summary>
              <p className="ans">
                No. The session is spent walking through your specific data, rankings, website
                performance, and competitor activity. If you want to hear about working together at
                the end, ask. If you don&apos;t, we won&apos;t pitch you.
              </p>
            </details>
            <details>
              <summary>How long does it take?</summary>
              <p className="ans">
                Plan for about an hour. The research happens on our side before we meet, so your time
                is spent entirely on the findings and what to do about them.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Slim closer, one concise line, no repeated hero */}
      <div className="mk-closer">
        <div className="wrap">
          <p>
            Questions? <a className="link" href="mailto:team@obacademy.org">team@obacademy.org</a> ·{' '}
            <a className="link" href="https://www.ekwa.com/">Visit ekwa.com</a>
          </p>
          <a className="btn btn-primary" href="#book">
            Book now
          </a>
        </div>
      </div>
    </>
  );
}
