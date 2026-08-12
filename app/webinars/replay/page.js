'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeWebinar } from '@/app/lib/models';
import { isUnlocked } from '@/app/lib/leads';
import SmartImage from '@/components/SmartImage';
import LeadGate from '@/components/LeadGate';
import Transcript from '@/components/Transcript';

function ReplayContent() {
  const slug = useSearchParams().get('e') || '';
  const { rows, loading } = useSheet('replays', normalizeWebinar);

  const [unlocked, setUnlocked] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => setUnlocked(isUnlocked('webinar')), []);
  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href);
  }, [slug]);

  if (loading) {
    return (
      <div className="wrap" style={{ padding: '64px 0' }}>
        <div className="state">
          <div className="spinner" />
          Loading replay…
        </div>
      </div>
    );
  }

  const w = rows.find((r) => r.slug === slug || r.id === slug);

  if (!w) {
    return (
      <div className="wrap" style={{ padding: '64px 0' }}>
        <div className="state">
          <p style={{ marginBottom: 18 }}>Replay not found</p>
          <Link className="btn btn-primary" href="/webinars/replays">
            Back to replays
          </Link>
        </div>
      </div>
    );
  }

  const idx = rows.indexOf(w);
  // previous = next item in list (older); next = previous item (newer)
  const previous = idx >= 0 && idx < rows.length - 1 ? rows[idx + 1] : null;
  const next = idx > 0 ? rows[idx - 1] : null;

  const open = unlocked;
  const speakers = w.speakersList || [];
  const tags = [w.dateLabel, w.duration, w.category, 'Free replay'].filter(Boolean);
  const hasGroups = w.noteGroups && w.noteGroups.length > 0;
  const hasNotes = w.notes && w.notes.length > 0;
  const hasTakeaways = hasGroups || hasNotes;
  // Show the overview paragraph only when it's prose not already broken out as notes.
  const showOverview = w.summary && !hasTakeaways;

  const share = (network) => {
    const u = encodeURIComponent(shareUrl);
    const t = encodeURIComponent(w.title);
    switch (network) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
      default:
        return '#';
    }
  };

  return (
    <>
      <section className="detail-hero">
        <div className="wrap">
          <span className="eyebrow">On-Demand Webinar</span>
          <h1>{w.title}</h1>
          {w.subtitle && (
            <p style={{ color: '#bcd4e8', fontSize: 16, maxWidth: 720, margin: '0 0 16px' }}>
              {w.subtitle}
            </p>
          )}
          <div className="detail-tags">
            {tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-body">
        <div className="wrap">
          <div className="detail-grid">
            <div className="detail-main">
              {open || isUnlocked('webinar') ? (
                <div className="player-wrap">
                  <iframe
                    src={w.embedUrl}
                    title={w.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <LeadGate
                  type="webinar"
                  title="Unlock the replay"
                  meta={{
                    webinar_title: w.title,
                    webinar_date: w.dateLabel,
                    replay_id: w.id,
                    vimeo_link: w.vimeoLink,
                  }}
                  submitLabel="Watch replay"
                  onUnlock={() => setUnlocked(true)}
                />
              )}

              {showOverview && (
                <>
                  <h2 style={{ marginTop: 36 }}>Overview</h2>
                  <p style={{ color: 'var(--ink-soft)', fontSize: 15.5, lineHeight: 1.7 }}>
                    {w.summary}
                  </p>
                </>
              )}

              {hasTakeaways && (
                <>
                  <h2 style={{ marginTop: 36 }}>Key takeaways</h2>
                  <ul className="kp-list">
                    {hasGroups
                      ? w.noteGroups.map((g, i) => (
                          <li className="kp-group" key={i}>
                            <h3>{`${i + 1}. ${g.topic}`}</h3>
                            <ul>
                              {g.bullets.map((b, j) => (
                                <li key={j}>{b}</li>
                              ))}
                            </ul>
                          </li>
                        ))
                      : w.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </>
              )}

              {speakers.length > 1 && (
                <>
                  <h2 style={{ marginTop: 36 }}>Speakers</h2>
                  <div className="spk-grid">
                    {speakers.map((s) => (
                      <div className="spk" key={s.num}>
                        <span className="ph">
                          <SmartImage src="" alt={s.name} fallback={s.name} />
                        </span>
                        <div className="nm">{s.name}</div>
                        <div className="rl">{s.roleLabel}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Transcript transcriptUrl={w.transcriptUrl} speakers={w.speakersList} />
            </div>

            <aside className="detail-side">
              <div className="side-card">
                <h3 style={{ marginBottom: 12 }}>Share this replay</h3>
                <p style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 14 }}>
                  Pass it along to a colleague who would find it useful.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                  <a className="btn btn-light" href={share('facebook')} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                  <a className="btn btn-light" href={share('linkedin')} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                  <a className="btn btn-light" href={share('twitter')} target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                </div>
                <Link
                  className="btn btn-light"
                  href="/webinars/replays"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  Back to all replays
                </Link>
              </div>
            </aside>
          </div>

          {(previous || next) && (
            <div className="prev-next">
              {previous ? (
                <Link href={`/webinars/replay/?e=${previous.slug}`}>
                  <div className="dir">← Previous</div>
                  <div className="t">{previous.title}</div>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/webinars/replay/?e=${next.slug}`} className="right">
                  <div className="dir">Next</div>
                  <div className="t">{next.title}</div>
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const pageFallback = (
  <div className="wrap" style={{ padding: '72px 0' }}>
    <div className="state"><div className="spinner" />Loading…</div>
  </div>
);

export default function WebinarReplayPage() {
  return (
    <Suspense fallback={pageFallback}>
      <ReplayContent />
    </Suspense>
  );
}
