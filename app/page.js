import Link from 'next/link';
import './home.css';
import HomeEpisodes from './HomeEpisodes';

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

const FEATURES = [
  {
    href: '/podcast', cta: 'Browse episodes', title: 'The Podcast',
    text: 'Candid conversations with surgeons, COEs, and executives on marketing, operations, leadership, and growth.',
  },
  {
    href: '/webinars', cta: 'See the schedule', title: 'Live Expert Panels',
    text: 'Biweekly sessions where practice leaders share what actually works, patient acquisition, dry eye revenue, AI diagnostics, and more.',
  },
  {
    href: '/resources', cta: 'Join free to access', title: 'Playbooks & Resources',
    text: 'Practical guides, checklists, and replays members use to act on what they hear, free with your membership.',
  },
];

const PROOF = [
  { t: '75+ episodes', s: 'The Ophthalmology Business Podcast' },
  { t: '5.0 on Apple Podcasts', s: 'Rated by ophthalmic leaders' },
  { t: '100% free', s: 'Membership costs nothing' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero: dark cinematic, claim-first */}
      <section className="hx">
        <div className="wrap hx-inner">
          <div className="hx-copy">
            <p className="hx-kicker">For practice owners, surgeons &amp; administrators</p>
            <h1>
              <span>The business education ophthalmologists</span>
              <br />
              <span className="hx-dim">never got in residency.</span>
            </h1>
            <p className="hx-lead">
              Live expert panels, a podcast, and practical playbooks on growing an eye-care
              practice, from patient acquisition to premium IOL conversion.
            </p>
            <div className="hx-ctas">
              <Link className="btn btn-light" href="/contact">Join free, get panel access</Link>
              <Link className="btn btn-ghost" href="/podcast">Listen to the podcast</Link>
            </div>
          </div>

          <div className="hx-proof">
            {PROOF.map((m) => (
              <div key={m.t}>
                <p className="t">{m.t}</p>
                <p className="s">{m.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get: hairline-ruled band */}
      <section className="feats">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">What you get</span>
            <h2>
              Three ways to sharpen
              <br />
              <span className="title-dim">the business side of your practice.</span>
            </h2>
          </div>
          <div className="fc-grid reveal">
            {FEATURES.map((f, i) => (
              <Link className="fc" href={f.href} key={f.title}>
                <span className="fc-num">[{i + 1}]</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="fc-cta">{f.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Proof-by-numbers band */}
      <div className="stats-strip dot-field">
        <div className="wrap">
          <div><b>75+</b><span>podcast episodes</span></div>
          <div><b>5.0</b><span>on Apple Podcasts</span></div>
          <div><b>4</b><span>live panels this quarter</span></div>
          <div><b>100%</b><span>free membership</span></div>
        </div>
      </div>

      {/* Dynamic sections, pulled live from the Google Sheet */}
      <HomeEpisodes />

      {/* Closing CTA band */}
      <section className="cta-band">
        <div className="wrap">
          <div className="cta-inner reveal">
            <span className="eyebrow">Join the academy</span>
            <h2>
              Get the panel schedule, replays,
              <br />
              <span className="cta-dim">and episode drops in one email.</span>
            </h2>
            <p>
              Join OB Academy free. No spam, just the business of eye care, every other week.
              The newsletter sign-up lives at the bottom of every page.
            </p>
            <div className="cta-row">
              <Link className="btn btn-light" href="/contact">Join free</Link>
              <a className="btn btn-ghost" href="#newsletter">Get the newsletter</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
