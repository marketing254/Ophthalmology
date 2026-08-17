'use client';

import Link from 'next/link';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeExpert } from '@/app/lib/models';
import PersonCard from '@/components/PersonCard';

export default function HomeHosts() {
  const { rows, loading } = useSheet('experts', normalizeExpert);
  if (loading || rows.length === 0) return null;

  const featured = rows.slice(0, 4);

  return (
    <section style={{ background: 'var(--mist)' }}>
      <div className="wrap">
        <div className="sec-head center reveal">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Hosts &amp; faculty</p>
          <h2>Learn from people who run practices for a living</h2>
          <p>Surgeons, executives, and operators, the voices behind every episode and panel.</p>
        </div>
        <div className="card-grid reveal">
          {featured.map((p) => (
            <PersonCard key={p.id} p={p} />
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center', marginTop: 34 }}>
          <Link className="btn btn-light" href="/guest-speaker">Apply to speak</Link>
        </div>
      </div>
    </section>
  );
}
