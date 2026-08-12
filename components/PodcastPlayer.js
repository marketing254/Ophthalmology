'use client';

import { useEffect, useRef, useState } from 'react';
import SmartImage from './SmartImage';

const fmt = (s) => {
  if (!s || Number.isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const SPEEDS = [1, 1.25, 1.5, 2];

export default function PodcastPlayer({ src, title, episode, art, guest }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!a) return undefined;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => { setDur(a.duration); setReady(true); };
    const onEnd = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('durationchange', onMeta);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('durationchange', onMeta);
      a.removeEventListener('ended', onEnd);
    };
  }, [src]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
  };
  const seek = (e) => {
    const a = ref.current;
    if (!a || !dur) return;
    a.currentTime = (e.target.value / 1000) * dur;
    setCur(a.currentTime);
  };
  const nudge = (delta) => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(dur || 0, a.currentTime + delta));
  };
  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (ref.current) ref.current.playbackRate = next;
  };

  const pct = dur ? (cur / dur) * 1000 : 0;

  return (
    <div className="pplayer">
      <audio ref={ref} src={src} preload="metadata" />

      <div className="pp-head">
        <div className="pp-art">
          <SmartImage src={art} alt={title} fallback={guest || 'OB'} />
        </div>
        <div className="pp-meta">
          <span className="pp-kicker">▶ Now playing · Episode {episode}</span>
          <div className="pp-title">{title}</div>
        </div>
        <button className={`pp-play${playing ? ' is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>

      <div className="pp-scrub">
        <span className="pp-time">{fmt(cur)}</span>
        <input
          className="pp-range"
          type="range"
          min="0"
          max="1000"
          value={pct}
          onChange={seek}
          style={{ '--pp': `${pct / 10}%` }}
          aria-label="Seek"
        />
        <span className="pp-time">{ready ? fmt(dur) : '—:—'}</span>
      </div>

      <div className="pp-controls">
        <button className="pp-btn" onClick={() => nudge(-15)} aria-label="Back 15 seconds">
          <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M11 4 6 8l5 4M6 8h7a5 5 0 1 1 0 10H8" /></svg>
          15
        </button>
        <button className="pp-btn" onClick={() => nudge(30)} aria-label="Forward 30 seconds">
          30
          <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M13 4l5 4-5 4M18 8h-7a5 5 0 1 0 0 10h5" /></svg>
        </button>
        <button className="pp-btn pp-speed" onClick={cycleSpeed}>{speed}×</button>
        <a className="pp-btn pp-dl" href={src} target="_blank" rel="noopener" download>
          <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
          Download
        </a>
      </div>
    </div>
  );
}
