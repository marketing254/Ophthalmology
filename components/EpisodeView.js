'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import '@/app/podcast/episode/podepisode.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizePodcast } from '@/app/lib/models';
import { parseDescription } from '@/app/lib/sheets';
import { isUnlocked } from '@/app/lib/leads';
import SmartImage from '@/components/SmartImage';
import PodcastThumb from '@/components/PodcastThumb';
import LeadGate from '@/components/LeadGate';
import Transcript from '@/components/Transcript';
import DrivePlayer from '@/components/DrivePlayer';
import PodcastPlayer from '@/components/PodcastPlayer';
import BrandIcon from '@/components/BrandIcon';

const linkHref = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? `mailto:${v}` : /^https?:/i.test(v) ? v : v ? `https://${v}` : '#';

function EpisodeContent({ slug = '', initial = null }) {
  const { rows, loading } = useSheet('podcasts', normalizePodcast);
  const [unlocked, setUnlocked] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => setUnlocked(isUnlocked('podcast')), []);

  const list = useMemo(() => [...rows].sort((a, b) => b.epNum - a.epNum), [rows]);
  const idx = useMemo(
    () => list.findIndex((e) => e.slug === slug || String(e.episode) === slug),
    [list, slug]
  );
  const epLive = idx > -1 ? list[idx] : null;
  const ep = epLive || (initial ? initial.ep : null);

  useEffect(() => {
    if (ep) document.title = `${ep.title} | The Podcast`;
    if (typeof window !== 'undefined') setShareUrl(encodeURIComponent(window.location.href));
  }, [ep]);

  if (loading && !ep) {
    return <div className="wrap" style={{ padding: '72px 0' }}><div className="state"><div className="spinner" />Loading…</div></div>;
  }
  if (!ep) {
    return (
      <div className="wrap" style={{ padding: '72px 0' }}>
        <div className="state"><p>Episode not found</p><Link className="btn btn-primary" href="/podcast">Browse all episodes</Link></div>
      </div>
    );
  }

  const prev = idx > -1 ? (idx < list.length - 1 ? list[idx + 1] : null) : (initial ? initial.prev : null); // older
  const next = idx > -1 ? (idx > 0 ? list[idx - 1] : null) : (initial ? initial.next : null); // newer
  const parsed = parseDescription(ep.description);
  const paras = (ep.description || '').split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const panelists = ep.speakers.filter((s) => s.role !== 'host');


  const player = ep.audioKind === 'embed'
    ? <div className="audio-embed"><iframe src={ep.episodeEmbed || ep.audioSource} allow="autoplay; encrypted-media" title={ep.title} loading="lazy" /></div>
    : ep.audioKind === 'drive'
      ? <div className="audio-card"><div className="audio-card-head"><span className="ac-ico" aria-hidden="true">🎧</span><div className="ac-info"><div className="ac-kicker">Episode {ep.episode}</div><div className="ac-title">{ep.title}</div></div></div><div className="ac-player"><DrivePlayer src={ep.audioSource} title={ep.title} /></div></div>
      : ep.audioSource
        ? <PodcastPlayer src={ep.audioSource} title={ep.title} episode={ep.episode} guest={ep.guestName} />
        : null;

  return (
    <div className="pe">
      {/* Hero: brand artwork on the dark post ground (per the UI draft) */}
      <section className="pe2-hero">
        <span className="pe2-lobe" aria-hidden="true" />
        <span className="pe2-glow" aria-hidden="true" />
        <span className="pe2-dots dot-field" aria-hidden="true" />
        <span className="pe2-scrim" aria-hidden="true" />
        <div className="wrap pe2-in">
          <nav className="pe2-crumbs" aria-label="Breadcrumb">
            <Link href="/podcast">Episodes</Link>
            <span aria-hidden="true">/</span>
            <span className="pe2-cur">{ep.title}</span>
          </nav>

          <div className="pe2-grid">
            <div className="pe2-copy">
              <p className="pe2-eyebrow">
                <span className="pe2-dot" aria-hidden="true" />
                Episode {ep.episode}
                {ep.dateLabel && <><span aria-hidden="true">·</span><time>{ep.dateLabel}</time></>}
              </p>
              <h1 className="pe2-title">{ep.title}</h1>
            </div>

            <div className="pe2-banner">
              <PodcastThumb src={ep.poster || ep.guestPhoto} episode={ep.episode} title={ep.title} guest={ep.guestName} />
            </div>
          </div>

          {/* Transport: the episode's player (or its unlock gate) under a hairline */}
          <div className="pe2-transport">
            {unlocked ? player : (
              <LeadGate
                type="podcast"
                title="Unlock this episode"
                meta={{ podcast_episode: ep.episode, podcast_title: ep.title }}
                submitLabel="Listen now"
                onUnlock={() => setUnlocked(true)}
              />
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pe-body">
        <div className="wrap">
          <div className="pe-grid">
            <div className="pe-main">
              {/* Key Notes, from the sheet description */}
              {(parsed.keyPointGroups.length > 0 || paras.length > 0) && (
                <div className="pe-card pe-notes">
                  <h2>Key Notes</h2>
                  {parsed.keyPointGroups.length > 0 ? (
                    <ul className="kp-list">
                      {parsed.keyPointGroups.map((g, i) => (
                        <li className="kp-group" key={i}>
                          <h3>{i + 1}. {g.topic}</h3>
                          {g.bullets.length > 0 && <ul>{g.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    paras.map((p, i) => <p key={i}>{p}</p>)
                  )}
                </div>
              )}

              {ep.isPanel && panelists.length > 0 && (
                <div className="pe-card">
                  <h2>Panelists</h2>
                  <div className="pe-spk-grid">
                    {ep.speakers.map((s, i) => (
                      <div className="pe-spk" key={i}>
                        <SmartImage className="ph" src={ep.speakerPhotos[i]} alt={s.name} fallback={s.name} />
                        <div className="nm">{s.name}</div>
                        <div className="rl">{s.roleLabel}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsed.bio.length > 0 && (
                <div className="pe-card pe-notes">
                  <h2>About {parsed.bioName || ep.guestName}</h2>
                  <ul className="kp-list">{parsed.bio.map((b, i) => <li key={i}>{b}</li>)}</ul>
                </div>
              )}

              <div className="pe-card">
                <Transcript transcriptUrl={ep.transcriptUrl} speakers={ep.speakers} />
              </div>
            </div>

            {/* Side */}
            <aside className="pe-side">
              {(ep.episodeUrl || ep.contact.length > 0) && (
                <div className="pe-side-card">
                  <h4>Listen &amp; connect</h4>
                  <div className="pe-links">
                    {ep.episodeUrl && (
                      <a href={ep.episodeUrl} target="_blank" rel="noopener noreferrer">
                        <BrandIcon type="website" size={16} /> Episode page
                      </a>
                    )}
                    {ep.contact.map((c, i) => (
                      <a key={i} href={linkHref(c.value)} target="_blank" rel="noopener noreferrer">
                        <BrandIcon type={c.type} size={16} /> {c.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pe-side-card">
                <h4>Share</h4>
                <div className="pe-share">
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener" aria-label="Share on LinkedIn"><BrandIcon type="linkedin" size={17} /></a>
                  <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener" aria-label="Share on X"><BrandIcon type="twitter" size={17} /></a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" aria-label="Share on Facebook"><BrandIcon type="facebook" size={17} /></a>
                </div>
              </div>
            </aside>
          </div>

          {(prev || next) && (
            <div className="pe-nav">
              {prev ? (
                <Link href={`/podcast/episode/${prev.slug}/`}><div className="dir">← Previous</div><div className="t">{prev.title}</div></Link>
              ) : <span />}
              {next ? (
                <Link href={`/podcast/episode/${next.slug}/`} className="right"><div className="dir">Next →</div><div className="t">{next.title}</div></Link>
              ) : <span />}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const pageFallback = (
  <div className="wrap" style={{ padding: '72px 0' }}>
    <div className="state"><div className="spinner" />Loading…</div>
  </div>
);

// Query-string reader lives in its own Suspense island so useSearchParams
// never forces the statically generated [slug] pages into CSR bailout.
function EpisodeFromQuery() {
  const slug = useSearchParams().get('e') || '';
  return <EpisodeContent slug={slug} />;
}

export default function EpisodeView({ slug = null, initial = null }) {
  if (slug) {
    // Static per-episode route: fully prerendered at build, refreshed live on the client.
    return <EpisodeContent slug={slug} initial={initial} />;
  }
  return (
    <Suspense fallback={pageFallback}>
      <EpisodeFromQuery />
    </Suspense>
  );
}
