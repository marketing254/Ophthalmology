// ===========================================================================
//  OB Academy, lead / form submission helper
//  Writes to the Apps Script Web App (Sheet) and optionally mirrors to Kit.
//  Includes lightweight client-side spam protection (honeypot + speed + junk).
// ===========================================================================
'use client';

import { APPS_SCRIPT_URL, KIT_FORM_IDS } from './sheets-config';

const PAGE_LOADED = typeof window !== 'undefined' ? Date.now() : 0;

// Looks-random detector for bot-generated names.
export function looksSpam(text) {
  if (!text) return false;
  const s = String(text).trim();
  if (s.length > 40) return true;
  for (const w of s.split(/[\s\-']+/)) {
    if (w.length < 4) continue;
    const midUpper = w.slice(1).replace(/[^a-zA-Z]/g, '').split('').filter((c) => c >= 'A' && c <= 'Z').length;
    if (midUpper >= 3) return true;
  }
  if (/[^aeiouAEIOU\s\-']{8,}/.test(s)) return true;
  return false;
}

// Returns an error string if the submission looks like a bot, else ''.
export function spamCheck({ honeypot, first, last, since } = {}) {
  if (honeypot && honeypot.trim()) return 'bot';
  if (Date.now() - (since || PAGE_LOADED) < 2000) return 'too-fast';
  if (looksSpam(first) || looksSpam(last)) return 'junk-name';
  return '';
}

function pushToKit(formId, payload) {
  const p = new URLSearchParams();
  p.append('email_address', payload.email || '');
  if (payload.first_name) p.append('fields[first_name]', payload.first_name);
  if (payload.last_name) p.append('fields[last_name]', payload.last_name);
  if (payload.phone) p.append('fields[phone]', payload.phone);
  if (payload.practice_name) p.append('fields[practice_name]', payload.practice_name);
  if (payload.form) p.append('fields[source]', payload.form);
  if (payload.page_url) p.append('fields[page_url]', payload.page_url);
  return fetch(`https://app.kit.com/forms/${formId}/subscriptions`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: p.toString(),
  });
}

/**
 * submitLead(payload), payload must include `form` and/or `tab`.
 * Fire-and-forget to Kit (if configured); awaited write to the Sheet.
 * Resolves even if the network is offline (mode:no-cors hides the response).
 */
export async function submitLead(payload) {
  const body = { ...payload, page_url: typeof window !== 'undefined' ? window.location.href : '' };

  const kitId = KIT_FORM_IDS[payload.form];
  if (kitId) pushToKit(kitId, body).catch(() => {});

  if (!APPS_SCRIPT_URL) {
    // No backend configured yet, succeed locally so the UX still unlocks.
    if (typeof console !== 'undefined') console.warn('APPS_SCRIPT_URL not set, lead not persisted:', body.form);
    return;
  }
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
}

// ── Per-type unlock memory (fill once access all of that type) ──────────
const gateKey = (type) => `oba_unlocked_${type}`;
export function isUnlocked(type) {
  try { return localStorage.getItem(gateKey(type)) === '1'; } catch { return false; }
}
export function markUnlocked(type) {
  try { localStorage.setItem(gateKey(type), '1'); } catch { /* ignore */ }
}
