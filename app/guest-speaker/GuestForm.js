'use client';

import { useRef, useState } from 'react';
import { submitLead, spamCheck } from '@/app/lib/leads';

const TOPICS = [
  'Practice Marketing & SEO',
  'Patient Acquisition & Conversion',
  'Practice Management & Operations',
  'Premium IOL & Refractive Growth',
  'Technology & AI in Ophthalmology',
  'Leadership & Team Culture',
  'Finance, Billing & Pricing',
  'Other',
];

export default function GuestForm() {
  const since = useRef(Date.now());
  const [f, setF] = useState({
    first: '', last: '', title: '', org: '', email: '', phone: '', type: '', topic: '', bio: '', links: '',
  });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [hp, setHp] = useState('');

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (spamCheck({ honeypot: hp, first: f.first, last: f.last, since: since.current })) return;
    if (!f.first || !f.last || !f.title || !f.org || !f.email || !f.type) {
      setErr('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      setErr('Please enter a valid email address.');
      return;
    }
    setErr('');
    submitLead({
      form: 'guest_speaker',
      tab: 'Guest Speaker',
      first_name: f.first, last_name: f.last, title: f.title, organization: f.org,
      email: f.email, phone: f.phone, type: f.type, topic: f.topic, bio: f.bio, links: f.links,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="sform-card">
        <div className="sform-ok">
          <div className="sform-ok-ic" aria-hidden="true">✓</div>
          <h3>Application received</h3>
          <p>Thank you, our team will review your application and get back to you within a few business days.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sform-card">
      <span className="tag">Apply now</span>
      <h2>Apply as a guest or speaker</h2>
      <p className="sform-intro">Tell us about yourself and what you&apos;d like to share.</p>
      <form className="sform" onSubmit={onSubmit} noValidate>
        <input
          type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
          className="sform-hp" value={hp} onChange={(e) => setHp(e.target.value)}
        />
        <div className="sform-row">
          <label>First name *<input value={f.first} onChange={set('first')} required autoComplete="given-name" /></label>
          <label>Last name *<input value={f.last} onChange={set('last')} required autoComplete="family-name" /></label>
        </div>
        <label>Professional title / designation *
          <input value={f.title} onChange={set('title')} placeholder="e.g. Managing Partner, Practice Owner" required />
        </label>
        <label>Practice / organization *
          <input value={f.org} onChange={set('org')} required autoComplete="organization" />
        </label>
        <div className="sform-row">
          <label>Email *<input type="email" value={f.email} onChange={set('email')} required autoComplete="email" /></label>
          <label>Phone<input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
        </div>
        <label>I&apos;m applying as a *
          <select value={f.type} onChange={set('type')} required>
            <option value="">Select…</option>
            <option>Podcast guest</option>
            <option>Panelist / speaker</option>
            <option>Both, podcast & panel</option>
          </select>
        </label>
        <label>Proposed topic / area of expertise
          <select value={f.topic} onChange={set('topic')}>
            <option value="">Select the closest match…</option>
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Brief bio / why you?
          <textarea value={f.bio} onChange={set('bio')} rows={4} placeholder="Your background and what value you'll bring to our audience…" />
        </label>
        <label>Website / LinkedIn / social profiles
          <input value={f.links} onChange={set('links')} placeholder="https://" />
        </label>
        {err && <p className="sform-err" role="alert">{err}</p>}
        <button className="btn btn-primary" type="submit">Submit application</button>
      </form>
    </div>
  );
}
