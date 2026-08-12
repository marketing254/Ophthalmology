'use client';

// ===========================================================================
//  OB Academy, Transcript
//  Fetches a Google-Doc / Drive transcript via the Apps Script proxy
//  (CORS-safe), parses speaker / timestamp / text lines, and renders a
//  searchable, collapsible, downloadable transcript block.
//
//  Renders nothing unless BOTH a transcriptUrl and APPS_SCRIPT_URL exist.
// ===========================================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { APPS_SCRIPT_URL } from '@/app/lib/sheets-config';
import { driveId } from '@/app/lib/sheets';

// WebVTT block header:  "[00:00:00.080 --> 00:01:55.080] Angie:"
const RE_VTT = /^\[(\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?)\s*-->\s*[\d:.]+\]\s*(.*?)\s*:?\s*$/;
// Inline w/ leading timestamp + speaker:  "[00:00:00] Dr. Amanda Landis-Hanna: text"
const RE_TIME_SPK = /^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([A-Z][^:]{0,48}?):\s+(.+)$/;
// "Speaker 1␠␠00:00:12␠␠text"
const RE_NUMBERED = /^(Speaker\s+(\d+))\s{2,}(\d{1,2}:\d{2}(?::\d{2})?)\s{2,}(.+)$/;
// "Jane Doe␠␠0:04␠␠text"
const RE_NAMED = /^([A-Za-z][A-Za-z .'\-]{0,58}[A-Za-z.])\s{2,}(\d{1,2}:\d{2}(?::\d{2})?)\s{2,}(.+)$/;
// "[00:01:23] Speaker: text"  or  "[00:01:23] text"
const RE_TIME_LEAD = /^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(.+)$/;

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// "00:00:00.080" "00:00", "01:02:03" "1:02:03"
function shortTime(t) {
  const m = String(t).match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return t;
  if (m[3] != null) {
    // HH:MM:SS drop a zero hour so 00:01:55 shows as 1:55
    const h = parseInt(m[1], 10);
    return h > 0 ? `${h}:${m[2]}:${m[3]}` : `${parseInt(m[2], 10)}:${m[3]}`;
  }
  return `${m[1]}:${m[2]}`;
}

// True if the payload looks like binary/PDF (old proxy exported Docs as PDF).
function looksBinary(s) {
  if (!s) return true;
  if (/^%PDF/.test(s.trim())) return true;
  const sample = s.slice(0, 4000);
  for (let i = 0; i < sample.length; i += 1) {
    const c = sample.charCodeAt(i);
    if (c < 9 || (c > 13 && c < 32)) return true; // control char
  }
  return false;
}

function parseTranscript(raw, speakers = []) {
  const byNum = new Map();
  const byName = new Map();
  (speakers || []).forEach((s) => {
    if (!s) return;
    if (s.num != null) byNum.set(Number(s.num), s);
    if (s.name) byName.set(String(s.name).toLowerCase(), s);
  });

  let lines = String(raw || '').split(/\r?\n/);

  // Drop the Doc's header block: title / subtitle / date / "…, Transcript"
  // lines that sit before the first real speaker/timestamp line.
  const firstReal = lines.findIndex((l) => {
    const t = l.trim();
    return t && (RE_VTT.test(t) || RE_NUMBERED.test(t) || RE_NAMED.test(t) || RE_TIME_LEAD.test(t));
  });
  if (firstReal > 0) lines = lines.slice(firstReal);

  const isHeading = (t) =>
    /(?:^|[—–-])\s*transcript\s*$/i.test(t) || /^transcript$/i.test(t);

  const roleOf = (name) => {
    const k = byName.get(String(name).toLowerCase());
    return k ? k.role || 'guest' : 'guest';
  };

  const entries = [];
  let current = null; // accumulates block-format text under one speaker turn
  const flush = () => {
    if (current) {
      const text = current.parts.join('\n\n').replace(/[ \t]+/g, ' ').trim();
      if (text) entries.push({ speaker: current.speaker, role: current.role, time: current.time, text });
    }
    current = null;
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t || t === '<silence>' || isHeading(t)) continue;

    // WebVTT block:  "[start --> end] Speaker:"  starts a new turn
    let m = t.match(RE_VTT);
    if (m) {
      flush();
      const spk = (m[2] || '').replace(/:+$/, '').trim();
      current = { speaker: spk, role: spk ? roleOf(spk) : '', time: shortTime(m[1]), parts: [] };
      continue;
    }

    // Inline w/ leading timestamp + speaker: "[00:00:00] Name: text"
    m = t.match(RE_TIME_SPK);
    if (m) {
      flush();
      const name = m[2].trim();
      entries.push({ speaker: name, role: roleOf(name), time: shortTime(m[1]), text: m[3].trim() });
      continue;
    }

    // Inline formats (one entry per line)
    m = t.match(RE_NUMBERED);
    if (m) {
      flush();
      if (m[4].trim() === '<silence>') continue;
      const k = byNum.get(parseInt(m[2], 10));
      entries.push({ speaker: k ? k.name : `Speaker ${m[2]}`, role: k ? k.role || 'guest' : 'guest', time: m[3], text: m[4].trim() });
      continue;
    }
    m = t.match(RE_NAMED);
    if (m) {
      flush();
      if (m[3].trim() === '<silence>') continue;
      entries.push({ speaker: m[1].trim(), role: roleOf(m[1].trim()), time: m[2], text: m[3].trim() });
      continue;
    }
    m = t.match(RE_TIME_LEAD);
    if (m) {
      flush();
      entries.push({ speaker: '', role: '', time: shortTime(m[1]), text: m[2].trim() });
      continue;
    }

    // Plain text, belongs to the open block turn, else floats on its own.
    if (current) current.parts.push(t);
    else entries.push({ speaker: '', role: '', time: '', text: t });
  }
  flush();
  return entries;
}

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.split(re).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark className="ts-hl" key={i}>{part}</mark>
    ) : (
      part
    )
  );
}

export default function Transcript({ transcriptUrl, speakers = [] }) {
  const fileId = transcriptUrl ? driveId(transcriptUrl) : '';
  const [raw, setRaw] = useState('');
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [query, setQuery] = useState('');
  const bodyRef = useRef(null);

  const configured = Boolean(transcriptUrl) && Boolean(APPS_SCRIPT_URL);

  useEffect(() => {
    if (!configured || !fileId) return undefined;
    let alive = true;
    setStatus('loading');
    (async () => {
      try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getTranscript&id=${encodeURIComponent(fileId)}`, { cache: 'no-store' });
        const json = await res.json();
        if (!alive) return;
        const content = (json && json.content) || '';
        if (json && json.status === 'ok' && content.trim() && !looksBinary(content)) {
          setRaw(content);
          setStatus('ok');
        } else {
          setStatus('error');
        }
      } catch (_) {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [configured, fileId]);

  const entries = useMemo(() => parseTranscript(raw, speakers), [raw, speakers]);

  const colorOf = useMemo(() => {
    const map = new Map();
    let n = 0;
    for (const e of entries) {
      if (!e.speaker || map.has(e.speaker)) continue;
      n += 1;
      map.set(e.speaker, ((n - 1) % 6) + 1);
    }
    return map;
  }, [entries]);

  const wordCount = useMemo(
    () => entries.reduce((a, e) => a + (e.text ? e.text.trim().split(/\s+/).length : 0), 0),
    [entries]
  );
  const minutes = Math.max(1, Math.round(wordCount / 200));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.text.toLowerCase().includes(q));
  }, [entries, query]);

  function download() {
    if (typeof window === 'undefined') return;
    const blob = new Blob([raw], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!configured || !fileId) return null;

  if (status === 'loading') {
    return (
      <div className="transcript">
        <h2>Transcript</h2>
        <div className="ts-loading">
          <div className="spinner" />
          <span>Loading transcript…</span>
        </div>
      </div>
    );
  }

  if (status === 'error' || !entries.length) {
    return (
      <div className="transcript">
        <h2>Transcript</h2>
        <p className="ts-note">
          Transcript unavailable.{' '}
          <a href={`https://drive.google.com/file/d/${fileId}/view`} target="_blank" rel="noopener noreferrer">
            Open it in Google Drive
          </a>
        </p>
      </div>
    );
  }

  let prevSpeaker = null;

  return (
    <div className="transcript">
      <h2>Transcript</h2>

      <div className="ts-head">
        <span className="ts-stat">{wordCount.toLocaleString()} words · ~{minutes} min read</span>
        <label className="ts-search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcript…"
            aria-label="Search transcript"
          />
        </label>
        <button type="button" className="ts-dl" onClick={download}>
          Download
        </button>
      </div>

      <div ref={bodyRef} className="ts-body">
        {filtered.length === 0 ? (
          <p className="ts-note">No matches for “{query}”.</p>
        ) : (
          filtered.map((e, i) => {
            const showBadge = !!e.speaker && (query.trim() ? true : e.speaker !== prevSpeaker);
            prevSpeaker = e.speaker || prevSpeaker;
            const cls = e.speaker ? colorOf.get(e.speaker) : null;
            return (
              <div className="ts-line" key={i}>
                <div className="ts-meta">
                  {showBadge && (
                    <span className={`ts-spk ts-spk-${cls}${e.role === 'host' ? ' is-host' : ''}`}>{e.speaker}</span>
                  )}
                  {e.time && <span className="ts-time">{e.time}</span>}
                </div>
                <p className="ts-text">{highlight(e.text, query.trim())}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
