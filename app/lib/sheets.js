// ===========================================================================
//  OB Academy, Google Sheets data layer (client-side gviz reader)
//  Pure functions + a cached tab fetcher. Safe to import in client components.
// ===========================================================================
import { SHEET_ID, TABS, SHEET_TTL_MS, FIRST_SHEET } from './sheets-config';

// Column signature of the first sheet (gviz returns it for unknown tab names).
const FIRST_SHEET_SIG = 'date_iso|day|month_year|time|title|description|register_url';

// ── Low-level: fetch + parse one tab by exact name ────────────────────────
async function fetchTabByName(sheetName) {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&headers=1&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
  if (!m) throw new Error('Sheet not public or tab missing: ' + sheetName);
  const json = JSON.parse(m[1]);
  if (json.status === 'error') throw new Error((json.errors || []).map((e) => e.message).join('; '));
  const cols = (json.table.cols || []).map((c) => (c.label || '').trim());
  const sig = cols.filter(Boolean).slice(0, 7).join('|');
  const rows = (json.table.rows || [])
    .filter((row) => row.c && row.c.some((cell) => cell && cell.v !== null && cell.v !== ''))
    .map((row) => {
      const obj = {};
      row.c.forEach((cell, i) => {
        if (!cols[i]) return;
        obj[cols[i]] = cell && cell.v !== null ? String(cell.v).trim() : '';
      });
      return obj;
    });
  return { cols, sig, rows };
}

// ── Cached loader: fetch the exact tab for `key` ──────────────────────────
const _cache = new Map(); // key -> { at, rows }

export async function loadTab(key) {
  const names = TABS[key] || [key];
  const usesFirstSheet = names.includes(FIRST_SHEET);
  const cached = _cache.get(key);
  if (cached && Date.now() - cached.at < SHEET_TTL_MS) return cached.rows;

  for (const name of names) {
    try {
      const { sig, rows } = await fetchTabByName(name);
      // Guard: if a non-first-sheet tab comes back with the first sheet's
      // signature, gviz fell back (tab missing), treat as empty, not wrong data.
      if (!usesFirstSheet && sig === FIRST_SHEET_SIG) continue;
      _cache.set(key, { at: Date.now(), rows });
      return rows;
    } catch (_) {
      /* try next name */
    }
  }
  _cache.set(key, { at: Date.now(), rows: [] });
  return [];
}

// ── Field access: fuzzy column matching (case/space/punct-insensitive) ────
const norm = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function pick(row, names) {
  if (!row) return '';
  const keys = Object.keys(row);
  for (const name of names) {
    if (row[name] != null && String(row[name]).trim() !== '') return String(row[name]).trim();
    const wanted = norm(name);
    const k = keys.find((key) => norm(key) === wanted);
    if (k && row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
  }
  return '';
}

// ── Initials fallback for avatars ─────────────────────────────────────────
export function initials(name) {
  return (name || '??').split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// ── Dates: handle gviz "Date(Y,M,D)" or plain ISO/text ────────────────────
export function parseDate(str) {
  if (!str) return null;
  const m = String(str).match(/^Date\((\d+),(\d+),(\d+)/);
  if (m) return new Date(+m[1], +m[2], +m[3]);
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(str) {
  const d = parseDate(str);
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Duration cells come through as gviz "Date(1899,11,30,H,M,S)" time values,
// or plain text like "45 min". Normalise to a short "1h 5m" / "45 min" label.
export function formatDuration(str) {
  if (!str) return '';
  const m = String(str).match(/^Date\(\d+,\d+,\d+,(\d+),(\d+),(\d+)/);
  if (m) {
    const h = +m[1], mins = +m[2];
    if (h && mins) return `${h}h ${mins}m`;
    if (h) return `${h}h`;
    return `${mins} min`;
  }
  return String(str).trim();
}

// Pull the src out of an <iframe …> string (podcast episode_url sometimes holds one).
export function iframeSrc(str) {
  if (!str) return '';
  const m = String(str).match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return m ? m[1] : '';
}

// ── Google Drive helpers (accept any pasted Drive URL format) ─────────────
export function driveId(url) {
  if (!url) return '';
  url = url.trim();
  let m = url.match(/\/d\/([\w-]{20,})/);
  if (m) return m[1];
  m = url.match(/[?&]id=([\w-]{20,})/);
  if (m) return m[1];
  m = url.match(/googleusercontent\.com\/d\/([\w-]{20,})/);
  if (m) return m[1];
  if (/^[\w-]{20,}$/.test(url)) return url;
  return '';
}

export function driveImg(url, size = 'w800') {
  if (!url) return '';
  url = url.trim();
  if (
    !url.includes('drive.google.com') &&
    !url.includes('googleusercontent.com') &&
    !/^[\w-]{20,}$/.test(url)
  ) {
    return url; // already a normal image URL
  }
  if (url.includes('drive.google.com/thumbnail') && url.includes('sz=')) return url;
  const id = driveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=${size}` : url;
}

// ── Vimeo embed normaliser ────────────────────────────────────────────────
export function vimeoEmbed(url) {
  if (!url) return '';
  const raw = String(url).trim();
  const idM = raw.match(/player\.vimeo\.com\/video\/(\d+)/i) || raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (!idM) return raw;
  const hParam = raw.match(/[?&]h=([^&]+)/i);
  const pathHash = raw.match(/vimeo\.com\/\d+\/([A-Za-z0-9]+)/i);
  const hash = hParam ? hParam[1] : pathHash ? pathHash[1] : '';
  return `https://player.vimeo.com/video/${idM[1]}${hash ? `?h=${encodeURIComponent(hash)}` : ''}`;
}

export function vimeoId(url) {
  const m = String(url || '').match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  return m ? m[1] : '';
}

// ── Slugs ─────────────────────────────────────────────────────────────────
export function slugify(value) {
  return (
    String(value || 'item')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 72) || 'item'
  );
}

// ── Classify an audio_source URL ──────────────────────────────────────────
export function classifyAudio(url) {
  if (!url) return 'none';
  const u = url.trim();
  if (/html5-player\.libsyn\.com\/embed/i.test(u)) return 'embed';
  if (/\.(mp3|m4a|wav|ogg|aac)(\?|$)/i.test(u)) return 'file';
  if (/traffic\.libsyn\.com|libsynpro\.com/i.test(u)) return 'file';
  if (/drive\.google\.com/i.test(u)) return 'drive';
  if (/\/embed\//i.test(u)) return 'embed';
  if (/spotify\.com/i.test(u)) return 'embed';
  return 'file';
}

export function driveAudioPreview(url) {
  const id = driveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

// ── Parse a podcast/webinar "description" into key points + bio ───────────
export function parseDescription(desc) {
  if (!desc) return { keyPoints: [], keyPointGroups: [], bioName: '', bio: [] };
  const lines = desc.split('\n').map((l) => l.trim()).filter(Boolean);
  const keyPoints = [];
  const keyPointGroups = [];
  let currentGroup = null;
  let bio = [];
  let bioName = '';
  let section = '';

  for (const line of lines) {
    if (/^key\s+(?:discussion\s+|takeaway?s?\s*$|points?\s*$)/i.test(line) || /^key\s*points?$/i.test(line)) {
      section = 'kp';
      currentGroup = null;
      continue;
    }
    const moreMatch = line.match(/^(?:More\s+about|About|Meet\s+the)\s+(.+)/i);
    if (moreMatch) {
      section = 'bio';
      bioName = moreMatch[1].trim();
      currentGroup = null;
      continue;
    }
    const topicMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    if (section === 'kp' && topicMatch && !/^[•*\-–—>]/.test(line)) {
      currentGroup = { topic: topicMatch[2].replace(/\.\s*$/, '').trim(), bullets: [] };
      keyPointGroups.push(currentGroup);
      continue;
    }
    if (/^[•*\-–—>]/.test(line)) {
      const text = line.replace(/^[•*\-–—>]\s*/, '').replace(/\.\s*$/, '').trim();
      if (!text) continue;
      if (section === 'kp') {
        keyPoints.push(text);
        if (currentGroup) currentGroup.bullets.push(text);
      }
      if (section === 'bio') bio.push(text);
    }
  }
  if (!keyPoints.length && !keyPointGroups.length) {
    return {
      keyPoints: desc.split(/\.\s+/).map((s) => s.trim()).filter((s) => s.length > 1),
      keyPointGroups: [],
      bioName,
      bio,
    };
  }
  return { keyPoints, keyPointGroups, bioName, bio };
}

// ── Parse pipe-separated "speakers" string: "Name (Host)|Name2|..." ───────
export function parseSpeakers(str) {
  if (!str) return [];
  return str
    .split('|')
    .map((raw, i) => {
      const s = raw.trim();
      if (!s) return null;
      const m = s.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      if (m) {
        const role = /host|moderator/i.test(m[2]) ? 'host' : 'guest';
        return { num: i + 1, name: m[1].trim(), roleLabel: m[2].trim(), role };
      }
      return { num: i + 1, name: s, roleLabel: 'Speaker', role: 'guest' };
    })
    .filter(Boolean);
}

// ── Parse pipe-separated "contact_info": "Email: x|LinkedIn: y" ───────────
export function parseContact(str) {
  if (!str) return [];
  return str
    .split(/[\n|]+/) // newline- OR pipe-separated "Platform: URL"
    .map((item) => {
      const t = item.trim();
      if (!t) return null;
      const ci = t.indexOf(':');
      // keep "https://…" intact, the label colon is the first one before a space
      if (ci > -1 && !/^https?:/i.test(t)) {
        return { type: t.slice(0, ci).trim(), value: t.slice(ci + 1).trim() };
      }
      return { type: 'Link', value: t };
    })
    .filter((c) => c && c.value.length > 0);
}
