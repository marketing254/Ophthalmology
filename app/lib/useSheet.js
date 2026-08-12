'use client';

import { useEffect, useState, useCallback } from 'react';
import { loadTab } from './sheets';

/**
 * useSheet(key, mapFn), fetch a Sheet tab on the client and keep it fresh.
 * Returns { rows, loading, error, refresh }.
 *
 * "Instant" updates: re-fetches whenever the tab regains focus / becomes
 * visible, so editing the Sheet and switching back shows new data. The
 * in-memory cache (SHEET_TTL_MS) prevents hammering during a single session.
 */
export function useSheet(key, mapFn) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    try {
      const raw = await loadTab(key);
      const mapped = typeof mapFn === 'function' ? raw.map(mapFn) : raw;
      setRows(mapped);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    let alive = true;
    run().then(() => alive);
    const onFocus = () => run();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      alive = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [run]);

  return { rows, loading, error, refresh: run };
}
