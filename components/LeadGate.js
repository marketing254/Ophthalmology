'use client';

import { useRef, useState } from 'react';
import { submitLead, spamCheck, markUnlocked } from '@/app/lib/leads';

/**
 * LeadGate, a compact 3-field capture form (name, practice, email) that
 * unlocks gated media. On success it marks the whole `type` unlocked and
 * calls onUnlock().
 *
 * props: type ('podcast'|'webinar'), title, meta (extra payload fields),
 *        submitLabel, onUnlock()
 */
export default function LeadGate({ type, title, meta = {}, submitLabel, onUnlock, compact }) {
  const since = useRef(Date.now());
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const v = (n) => (f.elements[n]?.value || '').trim();
    const name = v('name');
    const email = v('email');
    const practice = v('practice');

    if (spamCheck({ honeypot: hp, first: name, last: '', since: since.current })) return;
    if (!name || !email || !practice) {
      setErr('All fields are required.');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      // Keep first_name populated too so downstream tools (Kit, older sheet
      // tabs) still receive a usable name.
      await submitLead({
        form: type === 'podcast' ? 'podcast_gate' : 'webinar_replay_gate',
        tab: type === 'podcast' ? 'Podcast Gate' : 'Webinar Replay Gate',
        name,
        first_name: name,
        email,
        practice_name: practice,
        ...meta,
      });
      markUnlocked(type);
      onUnlock?.();
    } catch {
      setErr('Something went wrong. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form className={`lead-gate${compact ? ' compact' : ''}`} onSubmit={onSubmit}>
      <span className="lg-kicker">Free Access</span>
      {title && <h3 className="lg-title">{title}</h3>}
      <p className="lg-sub">Enter your details once to unlock all {type === 'podcast' ? 'episodes' : 'replays'}.</p>
      {/* honeypot */}
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="lg-hp" value={hp} onChange={(e) => setHp(e.target.value)}
      />
      <input name="name" placeholder="Name *" autoComplete="name" required />
      <div className="lg-row">
        <input name="practice" placeholder="Practice name *" autoComplete="organization" required />
        <input name="email" type="email" placeholder="Email *" autoComplete="email" required />
      </div>
      {err && <p className="lg-error" role="alert">{err}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Unlocking…' : submitLabel || (type === 'podcast' ? 'Listen now' : 'Watch replay')}
      </button>
    </form>
  );
}
