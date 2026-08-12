'use client';

import { useRef, useState } from 'react';
import { submitLead, spamCheck } from '@/app/lib/leads';

export default function MsmForm() {
  const [fields, setFields] = useState({ name: '', practice: '', email: '', role: '' });
  const [done, setDone] = useState(false);
  const since = useRef(Date.now());

  const onChange = (e) =>
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const [first, ...rest] = fields.name.trim().split(' ');
    if (spamCheck({ first, last: rest.join(' '), since: since.current })) return;

    submitLead({
      tab: 'Strategy Meeting',
      first_name: first || fields.name,
      last_name: rest.join(' '),
      email: fields.email,
      practice_name: fields.practice,
      role: fields.role,
    });

    setFields({ name: '', practice: '', email: '', role: '' });
    setDone(true);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="m-name">Your name</label>
        <input
          type="text"
          id="m-name"
          name="name"
          placeholder="Dr. Jane Smith"
          required
          autoComplete="name"
          value={fields.name}
          onChange={onChange}
        />
        <label htmlFor="m-practice">Practice name</label>
        <input
          type="text"
          id="m-practice"
          name="practice"
          placeholder="Smith Eye Center"
          required
          autoComplete="organization"
          value={fields.practice}
          onChange={onChange}
        />
        <label htmlFor="m-email">Email</label>
        <input
          type="email"
          id="m-email"
          name="email"
          placeholder="you@yourpractice.com"
          required
          autoComplete="email"
          value={fields.email}
          onChange={onChange}
        />
        <label htmlFor="m-role">Your role</label>
        <select id="m-role" name="role" required value={fields.role} onChange={onChange}>
          <option value="">Select one…</option>
          <option>Practice owner / surgeon</option>
          <option>Administrator / COE</option>
          <option>Marketing manager</option>
          <option>Other</option>
        </select>
        <button className="btn btn-primary" type="submit">
          Request my free analysis
        </button>
      </form>
      <p className="book-fine" id="m-msg">
        {done
          ? 'Thanks! Request received, we’ll email you within one business day to schedule.'
          : 'We’ll reply within one business day to schedule your session.'}
      </p>
      <div className="value-line">
        <b>100% free</b>
        <span>·</span>
        <span>No obligation</span>
        <span>·</span>
        <span>Yours to keep</span>
      </div>
    </>
  );
}
