'use client';

import { useState } from 'react';
import { submitLead } from '@/app/lib/leads';

export default function NewsletterForm({
  className = 'nl-form',
  buttonLabel = 'Subscribe',
  placeholder = 'you@yourpractice.com',
}) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      submitLead({ tab: 'Newsletter', form: 'newsletter_signup', email: email.trim(), source: 'site' });
    }
    setEmail('');
    setDone(true);
  };

  return (
    <form className={className} onSubmit={onSubmit}>
      <input
        type="email"
        placeholder={placeholder}
        required
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        {done ? 'Thanks!' : buttonLabel}
      </button>
    </form>
  );
}
