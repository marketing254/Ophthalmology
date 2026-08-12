'use client';

import { useRef, useState } from 'react';
import { submitLead, spamCheck, markUnlocked } from '@/app/lib/leads';

/**
 * LeadGate, a compact 5-field capture form that unlocks gated media.
 * On success it marks the whole `type` unlocked and calls onUnlock().
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
    const first = v('first'), last = v('last');
    const email = v('email'), phone = v('phone'), practice = v('practice');

    if (spamCheck({ honeypot: hp, first, last, since: since.current })) return;
    if (!first || !last || !email || !phone || !practice) {
      setErr('All fields are required.');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      await submitLead({
        form: type === 'podcast' ? 'podcast_gate' : 'webinar_replay_gate',
        tab: type === 'podcast' ? 'Podcast Gate' : 'Webinar Replay Gate',
        first_name: first, last_name: last, email, phone, practice_name: practice,
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
      <div className="lg-row">
        <input name="first" placeholder="First name *" autoComplete="given-name" required />
        <input name="last" placeholder="Last name *" autoComplete="family-name" required />
      </div>
      <div className="lg-row">
        <input name="email" type="email" placeholder="Email *" autoComplete="email" required />
        <input name="phone" type="tel" placeholder="Phone *" autoComplete="tel" required />
      </div>
      <input name="practice" placeholder="Practice name *" autoComplete="organization" required />
      {err && <p className="lg-error" role="alert">{err}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Unlocking…' : submitLabel || (type === 'podcast' ? 'Listen now' : 'Watch replay')}
      </button>
    </form>
  );
}
