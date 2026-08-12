'use client';

import { useEffect, useState } from 'react';

const PARTS = [
  { key: 'd', label: 'Days' },
  { key: 'h', label: 'Hours' },
  { key: 'm', label: 'Mins' },
  { key: 's', label: 'Secs' },
];

export default function Countdown({ target = '2026-07-15T16:00:00Z' }) {
  const [t, setT] = useState(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="countdown" aria-label="Countdown to panel">
      {PARTS.map((p) => (
        <div className="cd" key={p.key}>
          <b>{t ? t[p.key] : '–'}</b>
          <small>{p.label}</small>
        </div>
      ))}
    </div>
  );
}
