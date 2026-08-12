import './guest.css';
import GuestForm from './GuestForm';

export const metadata = {
  title: 'Apply as a Guest or Speaker',
  description:
    'Apply to be a guest on the Ophthalmology Business Podcast or a panelist at our live events, share your expertise with practice owners, surgeons, and administrators.',
};

const PERKS = [
  { h: 'Reach an engaged audience', p: 'Practice owners, surgeons, COEs and administrators who actively invest in growing their practices.' },
  { h: 'Build your authority', p: 'Being featured positions you as a go-to expert, credibility, referrals, and a stronger personal brand.' },
  { h: 'Evergreen exposure', p: 'Your episode or panel lives on across the podcast, replays, and our channels long after recording.' },
];

export default function GuestSpeakerPage() {
  return (
    <section className="gs-hero">
      <span className="orb orb-teal" style={{ width: 340, height: 340, top: -130, right: '-3%', position: 'absolute' }} aria-hidden="true" />
      <span className="orb orb-blue o2" style={{ width: 280, height: 280, bottom: -150, left: '20%', position: 'absolute' }} aria-hidden="true" />
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="gs-hero-grid">
          <div className="gs-lead">
            <p className="gs-eyebrow">Ophthalmology Business Podcast</p>
            <h1>Share your expertise. Reach the people growing eye-care practices.</h1>
            <p className="gs-sub">
              We feature surgeons, practice owners, operators, and marketing experts on the podcast
              and live panels. If you have something practical to share, we&apos;d love to hear from you.
            </p>
            <ol className="gs-perks">
              {PERKS.map((x, i) => (
                <li className="gs-perk" key={x.h}>
                  <span className="gs-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{x.h}</h3>
                    <p>{x.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="gs-form-col">
            <GuestForm />
          </div>
        </div>
      </div>
    </section>
  );
}
