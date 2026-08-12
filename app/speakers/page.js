'use client';

import Link from 'next/link';
import './speakers.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeExpert, normalizePartner } from '@/app/lib/models';
import PersonCard from '@/components/PersonCard';
import SmartImage from '@/components/SmartImage';
import Tilt from '@/components/Tilt';

function Grid({ rows, loading, empty }) {
  if (loading) return <div className="card-grid"><div className="state"><div className="spinner" />Loading…</div></div>;
  if (!rows.length) return <div className="state">{empty}</div>;
  return (
    <div className="card-grid">
      {rows.map((p) => <PersonCard key={p.id} p={p} />)}
    </div>
  );
}

export default function SpeakersPage() {
  const experts = useSheet('experts', normalizeExpert);
  const partners = useSheet('partners', normalizePartner);
  const faces = [...experts.rows, ...partners.rows].filter((p) => p.photo).slice(0, 6);

  return (
    <div className="spx">
      {/* Directory hero */}
      <section className="spx-hero">
        <div className="wrap spx-hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <span className="eyebrow">Speakers &amp; Partners</span>
            <h1>The faculty behind the podcast &amp; panels.</h1>
            <p>
              The surgeons, executives and operators who host our shows and panels, and the partner
              organisations that support the academy.
            </p>
            <Link className="btn btn-primary" href="/guest-speaker">Apply to speak</Link>
          </div>
          {faces.length > 0 && (
            <Tilt className="spx-cluster float-slow" max={10}>
              {faces.map((p, i) => (
                <span className="spx-face" key={p.id} style={{ zIndex: faces.length - i }}>
                  <SmartImage src={p.photo} alt={p.name} fallback={p.name} />
                </span>
              ))}
            </Tilt>
          )}
        </div>
      </section>

      {(experts.loading || experts.rows.length > 0) && (
        <section className="spx-sec">
          <div className="wrap">
            <div className="spx-sec-head"><span className="spx-kicker">01, Hosts &amp; experts</span><h2>Faculty &amp; speakers</h2></div>
            <Grid rows={experts.rows} loading={experts.loading} empty="Speakers will appear here soon." />
          </div>
        </section>
      )}

      {(partners.loading || partners.rows.length > 0) && (
        <section className="spx-sec spx-sec-alt">
          <div className="wrap">
            <div className="spx-sec-head"><span className="spx-kicker">02, Featured partners</span><h2>Organisations we partner with</h2></div>
            <Grid rows={partners.rows} loading={partners.loading} empty="Partners will appear here soon." />
          </div>
        </section>
      )}

      <div className="spx-cta">
        <div className="wrap">
          <h2>Want to be featured or speak on a panel?</h2>
          <Link className="btn btn-white" href="/contact">Get in touch</Link>
        </div>
      </div>
    </div>
  );
}
