'use client';

import { useRef, useState } from 'react';
import { submitLead, spamCheck } from '@/app/lib/leads';

export default function ContactForm() {
  const formRef = useRef(null);
  const okRef = useRef(null);
  const since = useRef(Date.now());
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const val = (n) => (f.elements[n]?.value || '').trim();
    const fullName = val('name');
    const [first, ...rest] = fullName.split(' ');
    if (spamCheck({ first, last: rest.join(' '), since: since.current })) return;

    submitLead({
      tab: 'Contact Us',
      first_name: first || fullName,
      last_name: rest.join(' '),
      email: val('email'),
      phone: '',
      subject: `${val('subject')}${val('practice') ? ` · ${val('practice')}` : ''}${val('role') ? ` · ${val('role')}` : ''}`,
      message: val('message'),
    });

    setSent(true);
    f.reset();
    if (okRef.current) {
      okRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="form-card">
      <div className={`form-ok${sent ? ' show' : ''}`} id="formOk" role="status" ref={okRef}>
        <b>Thanks, your message is on its way.</b>
        We&apos;ll reply within one business day. For anything urgent, email{' '}
        <a href="mailto:team@obacademy.org">team@obacademy.org</a>.
      </div>
      <h2>Send us a message</h2>
      <p className="sub">Tell us a bit about you and how we can help.</p>
      <form id="contactForm" ref={formRef} onSubmit={onSubmit}>
        <div className="field row2">
          <div className="field">
            <label htmlFor="name">
              Full name <span className="req">*</span>
            </label>
            <input type="text" id="name" name="name" required autoComplete="name" placeholder="Dr. Jane Smith" />
          </div>
          <div className="field">
            <label htmlFor="email">
              Email <span className="req">*</span>
            </label>
            <input type="email" id="email" name="email" required autoComplete="email" placeholder="you@yourpractice.com" />
          </div>
        </div>
        <div className="field row2">
          <div className="field">
            <label htmlFor="practice">Practice / organization</label>
            <input type="text" id="practice" name="practice" placeholder="Clear Vision Eye Center" />
          </div>
          <div className="field">
            <label htmlFor="role">Your role</label>
            <select id="role" name="role">
              <option value="">Select one…</option>
              <option>Practice owner / surgeon</option>
              <option>Ophthalmologist (associate)</option>
              <option>Administrator / COE</option>
              <option>Marketing / business development</option>
              <option>Industry partner</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="subject">What&apos;s this about?</label>
          <select id="subject" name="subject">
            <option>General question</option>
            <option>The podcast</option>
            <option>Live panels &amp; events</option>
            <option>Membership / account</option>
            <option>Becoming a guest speaker</option>
            <option>Partnership / sponsorship</option>
            <option>Press / media</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="message">
            Message <span className="req">*</span>
          </label>
          <textarea id="message" name="message" required placeholder="How can we help?"></textarea>
        </div>
        <button className="btn btn-primary" type="submit">
          Send message
        </button>
        <p className="form-fine">
          By submitting, you agree to be contacted about your request. We never sell your information.
        </p>
      </form>
    </div>
  );
}
