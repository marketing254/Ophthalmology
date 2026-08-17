import Link from 'next/link';
import './home.css';
import NewsletterForm from '@/components/NewsletterForm';
import HomeEpisodes from './HomeEpisodes';
import LetterReveal from '@/components/LetterReveal';

const FEATURES = [
  {
    href: '/podcast', cta: 'Browse episodes', title: 'The Podcast',
    text: 'Candid conversations with surgeons, COEs, and executives on marketing, operations, leadership, and growth.',
    icon: <svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8" /></svg>,
  },
  {
    href: '/webinars', cta: 'See the schedule', title: 'Live Expert Panels',
    text: 'Biweekly sessions where practice leaders share what actually works, patient acquisition, dry eye revenue, AI diagnostics, and more.',
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="15" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>,
  },
  {
    href: '/resources', cta: 'Join free to access', title: 'Playbooks & Resources',
    text: 'Practical guides, checklists, and replays members use to act on what they hear, free with your membership.',
    icon: <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></svg>,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hx">
        <div className="hx-gyro" aria-hidden="true">
          <span className="gy gy-1" />
          <span className="gy gy-2" />
          <span className="gy gy-3" />
        </div>
        <div className="wrap hx-center">
          <div className="hx-copy">
            <span className="hx-kicker">For practice owners, surgeons &amp; administrators</span>
            <h1>
              <LetterReveal text="The business education ophthalmologists" />{' '}
              <span className="hx-accent">
                <LetterReveal text="never got in residency." delay={950} />
              </span>
            </h1>
            <p className="hx-lead">
              Live expert panels, a podcast, and practical playbooks on growing an eye-care practice,
              from patient acquisition to premium IOL conversion.
            </p>
            <div className="hx-ctas">
              <Link className="btn btn-primary" href="/contact">Join free, get panel access</Link>
              <Link className="btn btn-light" href="/podcast">Listen to the podcast</Link>
            </div>
            <div className="hx-stats">
              <div><b>75+</b><span>episodes</span></div>
              <div><b>5.0★</b><span>Apple Podcasts</span></div>
              <div><b>100%</b><span>free membership</span></div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="feats">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">What you get</span>
            <h2>Three ways to sharpen the business side of your practice</h2>
            <p>Everything is built for the people running eye-care practices, not generic business advice.</p>
          </div>
          <div className="fc-grid">
            {FEATURES.map((f) => (
              <Link className="fc reveal" href={f.href} key={f.title}>
                <span className="fc-ico" aria-hidden="true">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="fc-cta">{f.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="stats-strip">
        <div className="wrap">
          <div><b>75+</b><span>podcast episodes</span></div>
          <div><b>5.0★</b><span>on Apple Podcasts</span></div>
          <div><b>4</b><span>live panels this quarter</span></div>
          <div><b>100%</b><span>free membership</span></div>
        </div>
      </div>

      {/* Dynamic sections, pulled live from the Google Sheet */}
      <HomeEpisodes />

      {/* Newsletter CTA */}
      <section className="cta-band">
        <div className="wrap">
          <div className="inner reveal">
            <div>
              <h2>Get the panel schedule, replays, and episode drops in one email</h2>
              <p>Join the OB Academy newsletter. No spam, just the business of eye care, every other week.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
