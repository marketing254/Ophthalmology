// ===========================================================================
//  Build-time data access (server only).
//  Fetches the same Google Sheet the client reads, but during `next build`,
//  so episode pages / sitemap / feed / llms.txt ship prerendered content.
//  The client layer (useSheet) still refreshes live in the browser, so the
//  instant-updates behaviour is unchanged.
// ===========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { loadTab } from './sheets';
import { normalizePodcast } from './models';

let _episodes = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CACHE_FILE = path.join(process.cwd(), '.sheet-cache.json');
const CACHE_TTL = 15 * 60 * 1000;

function readFileCache() {
  try {
    const j = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (j.episodes?.length && Date.now() - j.at < CACHE_TTL) return j.episodes;
  } catch {}
  return null;
}

export async function getEpisodes() {
  if (_episodes) return _episodes;
  // Next builds pages in parallel workers, each its own process; Google
  // throttles the resulting burst of identical gviz requests. So: a shared
  // on-disk cache (first successful worker feeds the rest) plus retries with
  // backoff. An empty result after all retries throws: better a loud build
  // failure than 75 silently 404ing episode pages or an empty feed.
  let lastErr = null;
  for (let attempt = 1; attempt <= 6; attempt++) {
    const cached = readFileCache();
    if (cached) {
      _episodes = cached;
      return _episodes;
    }
    try {
      const rows = await loadTab('podcasts');
      const eps = rows
        .map((r, i) => normalizePodcast(r, i))
        .filter((e) => e.slug && e.title)
        .sort((a, b) => b.epNum - a.epNum);
      if (eps.length > 0) {
        try {
          fs.writeFileSync(CACHE_FILE, JSON.stringify({ at: Date.now(), episodes: eps }));
        } catch {}
        _episodes = eps;
        return _episodes;
      }
      lastErr = new Error('sheet returned 0 episodes');
    } catch (err) {
      lastErr = err;
    }
    await sleep(1000 * attempt + Math.random() * 800);
  }
  throw new Error(`[build-data] could not load episodes from the sheet: ${lastErr?.message}`);
}

/** Best-effort ISO date from the sheet's formatted date label. */
export function isoDate(label) {
  if (!label) return null;
  const d = new Date(label);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/** Meta-description-safe summary (<=155 chars, whole words). */
export function summarize(text, max = 155) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}
