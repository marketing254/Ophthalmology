import Link from 'next/link';
import TeamPhoto from '@/components/TeamPhoto';
import './about.css';

export const metadata = {
  title: 'About',
  description:
    'Why Ophthalmology Business Academy exists: actionable business education for ophthalmologists, founded by Naren Arulrajah with key opinion leaders across eye care.',
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

const TIMELINE = [
  {
    yr: '2022',
    h: 'The podcast launches',
    p: 'The Ophthalmology Business Podcast debuts with co-host Guido Piquet, COO of Mann Eye Institute, and quickly earns 5-star reviews from ophthalmic leaders.',
  },
  {
    yr: '2023',
    h: 'The faculty grows',
    p: 'Surgeons and executives join as hosts and contributors, including retina specialists, refractive surgeons, and certified ophthalmic executives.',
  },
  {
    yr: '2024',
    h: '75 episodes & live events',
    p: 'The library passes 75 episodes, joined by webinars and expert panels covering marketing, operations, and emerging technology.',
  },
  {
    yr: '2026',
    h: 'The relaunch',
    p: 'OB Academy returns with a new biweekly live panel series, a rebuilt platform, and a growing community of practice leaders across North America.',
  },
];

const TEAM = [
  {
    img: `${BASE}/team/naren.jpg`,
    initials: 'NA',
    name: 'Naren Arulrajah',
    role: 'Founder & Host',
    bio: 'CEO of Ekwa Marketing. Has personally consulted with ophthalmology practices across the US, helping them scale from startups to multi-million-dollar organizations. AceTech Ontario Leadership Initiative Award recipient.',
  },
  {
    img: `${BASE}/team/guido-piquet.jpg`,
    initials: 'GP',
    name: 'Guido Piquet',
    role: 'Co-host',
    bio: 'Chief Operations Officer at Mann Eye Institute (Houston & Austin). Certified Ophthalmic Executive and MBA. Under his operational leadership the practice has more than doubled in size.',
  },
  {
    img: `${BASE}/team/sarah-duval.jpg`,
    initials: 'SD',
    name: 'Sarah Duval, COE, COA',
    role: 'Co-host',
    bio: 'Director of Marketing & Business Development at Concord Eye Center and past president of the National Board for the Certification of Ophthalmic Executives. Twenty-plus years in ophthalmology, from technician to leadership.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Dark slate hero, centered */}
      <section className="ab-hero">
        <div className="wrap reveal">
          <span className="eyebrow">About OB Academy</span>
          <h1>
            Great surgeons deserve <em>great businesses.</em>
          </h1>
          <p className="sub">
            Ophthalmology Business Academy exists for one reason: to give every ophthalmologist the
            business education their clinical training skipped.
          </p>
          <div className="ab-hero-stats">
            <div><b>2022</b><span>founded</span></div>
            <div><b>75+</b><span>episodes published</span></div>
            <div><b>3</b><span>hosts &amp; growing faculty</span></div>
            <div><b>100%</b><span>free to members</span></div>
          </div>
        </div>
      </section>

      {/* Story, centered narrative */}
      <section className="ab-story">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Our story</span>
            <h2>It started with a pattern we couldn&apos;t ignore</h2>
          </div>
          <p className="lead-line reveal">
            Brilliant clinicians, held back by <b>the business side of medicine.</b>
          </p>
          <div className="ab-chapters reveal">
            <div className="chapter">
              <span className="ch-k">01 · The pattern</span>
              <p>
                After consulting with ophthalmology practices across the US and Canada, our founder
                kept seeing the same thing: marketing that didn&apos;t work, operations that leaked
                revenue, and growth decisions made on instinct instead of evidence.
              </p>
            </div>
            <div className="chapter">
              <span className="ch-k">02 · The gap</span>
              <p>
                The knowledge to fix this existed, but it was scattered across conference hallways,
                private peer groups, and the hard-won experience of a few standout practices. There
                was no single place where a practice owner, administrator, or early-career surgeon
                could learn the business of eye care.
              </p>
            </div>
            <div className="chapter">
              <span className="ch-k">03 · The academy</span>
              <p>
                So in 2022, together with key opinion leaders across ophthalmology, we built one.
                OB Academy brings practitioners together, on the podcast, in live panels, and
                through practical resources, to share what actually works, including the
                disagreements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="ab-quote">
        <div className="wrap reveal">
          <div className="card">
            <div className="ph">
              <TeamPhoto src={`${BASE}/team/naren.jpg`} alt="Naren Arulrajah" initials="NA" />
            </div>
            <blockquote>
              Success is a by-product of our dedication to <span>serving others.</span> The academy
              is how we give back to the community that built us.
            </blockquote>
            <cite>
              <b>Naren Arulrajah</b>
              Founder, Ophthalmology Business Academy · CEO, Ekwa Marketing
            </cite>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="ab-tl">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">The journey</span>
            <h2>From one podcast to a growing academy</h2>
          </div>
          <div className="ab-tl-grid reveal">
            {TIMELINE.map((t) => (
              <div className="tl-item" key={t.yr}>
                <span className="yr">{t.yr}</span>
                <h3>{t.h}</h3>
                <p>{t.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission">
        <div className="wrap-narrow reveal">
          <span className="eyebrow">Our mission</span>
          <p className="big">
            To help every ophthalmologist find{' '}
            <span>personal, professional, and financial success</span>, by making world-class
            business education free and accessible.
          </p>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">What we stand for</span>
            <h2>Three principles behind everything we publish</h2>
          </div>
          <div className="values-grid">
            <article className="value reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Practitioners, not theorists</h3>
              <p>
                Every panelist and guest runs or operates a real practice. Advice comes from people
                with skin in the game, not consultants reading slides.
              </p>
            </article>
            <article className="value reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M8 12h8M12 8v8" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3>Debate over consensus</h3>
              <p>
                The best learning happens where smart people disagree. Our panels surface genuine
                tensions, premium pricing, private equity, AI adoption, instead of safe
                generalities.
              </p>
            </article>
            <article className="value reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Actionable or it doesn&apos;t ship</h3>
              <p>
                Every episode, panel, and resource has to pass one test: can a practice apply this on
                Monday morning? If not, we cut it.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Who&apos;s behind it</span>
            <h2>Hosts &amp; leadership</h2>
            <p>The people who plan the panels, host the show, and keep the academy running.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m) => (
              <article className="member reveal" key={m.name}>
                <div className="ph">
                  <TeamPhoto src={m.img} alt={m.name} initials={m.initials} />
                </div>
                <h3>{m.name}</h3>
                <span className="role">{m.role}</span>
                <p>{m.bio}</p>
              </article>
            ))}
          </div>
          <p className="team-note reveal">
            Plus a contributing faculty of surgeons and specialists across North America.
          </p>
        </div>
      </section>

      {/* Ekwa band */}
      <section className="ekwa">
        <div className="wrap reveal">
          <span className="eyebrow">Powered by Ekwa Marketing</span>
          <h2>Backed by a team that serves doctors every day</h2>
          <p>
            OB Academy is an initiative of Ekwa Marketing, a digital marketing company that works
            exclusively with doctors in private practice, including ophthalmologists, dentists,
            dermatologists, and plastic surgeons across the US and Canada.
          </p>
          <p>
            That foundation means the academy isn&apos;t guessing about what works in practice
            marketing and growth. It&apos;s drawn from thousands of real client engagements.
          </p>
          <a className="btn btn-ghost" href="https://www.ekwa.com/" style={{ marginTop: 8 }}>
            About Ekwa Marketing
          </a>
          <div className="ekwa-stats">
            <div className="ekwa-stat"><b>200+</b><span>team members</span></div>
            <div className="ekwa-stat"><b>15,000+</b><span>physicians served</span></div>
            <div className="ekwa-stat"><b>95%</b><span>client retention</span></div>
            <div className="ekwa-stat"><b>US + CA</b><span>private practices</span></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="wrap">
          <div className="inner reveal">
            <h2>Be part of the next chapter</h2>
            <p>
              Join free for live panel access, curated episode playlists, and one practical email
              every other week.
            </p>
            <div className="row">
              <Link className="btn btn-white" href="/contact">Join the academy, free</Link>
              <Link className="btn btn-outline" href="/podcast">Browse the podcast</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
