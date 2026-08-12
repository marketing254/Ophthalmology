'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reveals `.reveal` elements as they enter the viewport.
 * Robust against dynamically-rendered content (Sheet-driven sections mount
 * AFTER the first pass): a MutationObserver picks up newly-added `.reveal`
 * nodes, and a safety timer guarantees nothing is ever left invisible.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealAll = () =>
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'));

    if (reduce || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observeNew = () =>
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));

    observeNew();

    // Catch sections that mount later (async Sheet data).
    const mo = new MutationObserver(() => observeNew());
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: never leave content hidden if something blocks the observer.
    const safety = setTimeout(revealAll, 2500);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
