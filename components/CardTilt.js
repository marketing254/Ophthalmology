'use client';

import { useEffect } from 'react';

/**
 * Global mouse-follow 3D tilt for every card, applied via event delegation so
 * it also covers cards rendered later from Sheet data. Respects reduced-motion.
 */
const SEL = '.media-card,.person-card,.resource-card,.review-card,.mk-card';

export default function CardTilt() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let cur = null;
    let raf = 0;

    const reset = (el) => {
      if (!el) return;
      el.style.transition = 'transform .35s ease';
      el.style.transform = '';
    };

    const onMove = (e) => {
      const card = e.target.closest ? e.target.closest(SEL) : null;
      if (card !== cur) {
        reset(cur);
        cur = card;
        if (card) card.style.transition = 'transform .08s ease';
      }
      if (!card) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = 3;
        card.style.transform =
          `perspective(950px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-2px)`;
      });
    };

    const onLeaveAll = () => {
      reset(cur);
      cur = null;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('blur', onLeaveAll);
    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', onLeaveAll);
      reset(cur);
    };
  }, []);

  return null;
}
