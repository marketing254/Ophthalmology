'use client';

import Link from 'next/link';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeEvent } from '@/app/lib/models';
import { parseDate } from '@/app/lib/sheets';

export default function HomeSchedule() {
  const { rows, loading } = useSheet('events', normalizeEvent);
  if (loading) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = rows
    .filter((e) => {
      const d = parseDate(e.dateRaw);
      return d && d >= today;
    })
    .sort((a, b) => parseDate(a.dateRaw) - parseDate(b.dateRaw))
    .slice(0, 4);

  if (upcoming.length === 0) return null;

  return (
    <section className="schedule" id="panels">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Upcoming panel series</span>
          <h2>Live expert panels</h2>
          <p>One hour. Real practitioners. Genuine disagreements, not consensus advice.</p>
        </div>
        <div className="sched-list">
          {upcoming.map((ev, i) => (
            <div className="s-row reveal" key={ev.id}>
              <div className="s-date">
                {ev.day || ''}
                <small>{ev.monthYear || ''}</small>
              </div>
              <div>
                <h3>{ev.title}</h3>
                <p>{ev.panelists.length ? ev.panelists.join(' · ') : ev.description}</p>
              </div>
              <Link
                className={`s-tag${i === 0 ? ' live' : ''}`}
                href={ev.registerUrl || '/webinars'}
              >
                {i === 0 ? 'Register' : 'Details'}
              </Link>
            </div>
          ))}
        </div>
        <div className="ep-more reveal" style={{ marginTop: 32 }}>
          <Link className="btn btn-light" href="/webinars">
            See all webinars
          </Link>
        </div>
      </div>
    </section>
  );
}
