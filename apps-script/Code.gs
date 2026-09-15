/**
 * ════════════════════════════════════════════════════════════════════════
 *  OPHTHALMOLOGY BUSINESS ACADEMY — Google Sheets Form Handler + Proxy
 *
 *  The Next.js site READS content directly from this Sheet via the public
 *  gviz endpoint. This script handles the WRITE side: form submissions
 *  (lead gates, newsletter, contact) and a transcript/file proxy.
 *
 *  ─── DEPLOY ────────────────────────────────────────────────────────────
 *   1. script.google.com → New project → paste this whole file.
 *   2. Set SHEET_ID below to this workbook's id.
 *   3. Deploy → New deployment → Web app
 *        Execute as:    Me
 *        Who has access: Anyone
 *   4. Copy the /exec URL → set NEXT_PUBLIC_APPS_SCRIPT_URL in the site env
 *      (or paste into app/lib/sheets-config.js).
 *
 *  Also: Share the Sheet "Anyone with the link → Viewer" so the site can READ.
 *
 *  ─── TABS (auto-created on first submission) ────────────────────────────
 *    • Podcast Gate     • Webinar Replay Gate
 *    • Contact Us       • Newsletter        • Guest Speaker
 *
 *  NOTE (2026-09): the lead gates now collect only Name / Email / Practice.
 *  If a "Podcast Gate" or "Webinar Replay Gate" tab already exists with the
 *  old First/Last/Phone columns, RENAME it (e.g. "Podcast Gate (old)") so
 *  the script recreates it with the new headers — otherwise new rows would
 *  land under the old column titles.
 * ════════════════════════════════════════════════════════════════════════
 */

var SHEET_ID      = '1aWs2_hb5dr2c-bAHxEk6y1TE-_hmg1wO8Yx6bIyJ8zQ';
// Internal notifications (comma-separated; MailApp accepts a list)
var NOTIFY_EMAIL  = 'chamika.p@ekwa.com, lester@ekwa.com, rushdhaakbar82@gmail.com, dakkshin@ekwa.com, faith@ekwa.com';
var CONTACT_INBOX = 'team@obacademy.org';               // public contact inbox

var SHEET_HEADERS = {
  'Podcast Gate':        ['Timestamp', 'Name', 'Email', 'Practice Name', 'Podcast Episode', 'Podcast Title', 'Page URL'],
  'Webinar Replay Gate': ['Timestamp', 'Name', 'Email', 'Practice Name', 'Webinar Title', 'Webinar Date', 'Replay ID', 'Vimeo Link', 'Page URL'],
  'Contact Us':          ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
  'Newsletter':          ['Timestamp', 'First Name', 'Email', 'Source'],
  'Strategy Meeting':    ['Timestamp', 'First Name', 'Last Name', 'Email', 'Practice Name', 'Role', 'Page URL'],
  'Guest Speaker':       ['Timestamp', 'First Name', 'Last Name', 'Title', 'Organization', 'Email', 'Phone', 'Topic', 'Bio', 'Links']
};

/* ── helpers ─────────────────────────────────────────────────────────── */
function styleHeader(sheet, n) {
  sheet.getRange(1, 1, 1, n).setBackground('#081d31').setFontColor('#fff').setFontWeight('bold').setFontSize(11);
  sheet.setFrozenRows(1);
}
function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader(sheet, headers.length);
  }
  return sheet;
}
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
// Accepts the new single `name` field, falls back to legacy first/last.
function leadName(data) {
  return (data.name || ((data.first_name || '') + ' ' + (data.last_name || '')).trim() || '').trim();
}
function sendAdminEmail(tabName, fields, ss) {
  if (!NOTIFY_EMAIL) return;
  try {
    var body = 'New ' + tabName + ' submission — obacademy.org\n\nTime: ' + new Date().toLocaleString() + '\n\n';
    fields.forEach(function (f) { body += f[0] + ': ' + (f[1] || '-') + '\n'; });
    body += '\nView all: ' + ss.getUrl();
    MailApp.sendEmail(NOTIFY_EMAIL, 'New ' + tabName + ' — OB Academy', body);
  } catch (e) { Logger.log('Email error: ' + e); }
}

/* ── POST: route every form ──────────────────────────────────────────── */
function doPost(e) {
  try {
    var data;
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (_) { data = e.parameter || {}; }
    } else {
      data = (e && e.parameter) || {};
    }
    return routeForm(data);
  } catch (err) {
    Logger.log(err);
    return jsonOut({ status: 'error', message: err.toString() });
  }
}

function routeForm(data) {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  /* Podcast gate — Name / Email / Practice only */
  if (data.form === 'podcast_gate' || data.tab === 'Podcast Gate') {
    getOrCreateSheet(ss, 'Podcast Gate', SHEET_HEADERS['Podcast Gate']).appendRow([
      new Date(), leadName(data), data.email || '',
      data.practice_name || data.firm_name || '',
      data.podcast_episode || '', data.podcast_title || '', data.page_url || ''
    ]);
    sendAdminEmail('Podcast Gate', [['Name', leadName(data)], ['Email', data.email], ['Practice', data.practice_name], ['Episode', data.podcast_episode]], ss);
    return jsonOut({ status: 'ok' });
  }

  /* Webinar replay gate — Name / Email / Practice only */
  if (data.form === 'webinar_replay_gate' || data.tab === 'Webinar Replay Gate') {
    getOrCreateSheet(ss, 'Webinar Replay Gate', SHEET_HEADERS['Webinar Replay Gate']).appendRow([
      new Date(), leadName(data), data.email || '',
      data.practice_name || data.firm_name || '',
      data.webinar_title || '', data.webinar_date || '', data.replay_id || '',
      data.vimeo_link || '', data.page_url || ''
    ]);
    sendAdminEmail('Webinar Replay Gate', [['Name', leadName(data)], ['Email', data.email], ['Practice', data.practice_name], ['Webinar', data.webinar_title]], ss);
    return jsonOut({ status: 'ok' });
  }

  /* Generic tab-based forms (Contact Us, Newsletter, Guest Speaker) */
  var tabName = data.tab;
  if (!tabName || !SHEET_HEADERS[tabName]) {
    return jsonOut({ status: 'error', message: 'Unknown tab: ' + tabName });
  }
  var headers = SHEET_HEADERS[tabName];
  var row = headers.map(function (h) {
    if (h === 'Timestamp') return new Date();
    var snake = h.toLowerCase().replace(/\s+/g, '_');
    return data[h] || data[snake] || '';
  });
  getOrCreateSheet(ss, tabName, headers).appendRow(row);

  if (tabName === 'Contact Us') {
    try {
      var fromName = (data.first_name || '') + ' ' + (data.last_name || '');
      MailApp.sendEmail({
        to: CONTACT_INBOX, cc: NOTIFY_EMAIL, replyTo: data.email || '',
        subject: 'Contact form: ' + (data.subject || 'New message') + ' — ' + (fromName.trim() || data.email),
        body: 'From: ' + fromName + '\nEmail: ' + (data.email || '') + '\nPhone: ' + (data.phone || '-') +
              '\nSubject: ' + (data.subject || '-') + '\n\n' + (data.message || '-'),
        name: 'OB Academy Contact Form'
      });
    } catch (cErr) { Logger.log('Contact email error: ' + cErr); }
  } else {
    sendAdminEmail(tabName, headers.filter(function (h) { return h !== 'Timestamp'; })
      .map(function (h) { return [h, data[h] || data[h.toLowerCase().replace(/\s+/g, '_')]]; }), ss);
  }

  return jsonOut({ status: 'ok' });
}

/* ── GET: health check + transcript proxy ────────────────────────────── */
function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  if (p.action === 'getTranscript') {
    try {
      if (!p.id) throw new Error('No file ID');
      var file = DriveApp.getFileById(p.id);
      var mime = file.getMimeType();
      var content = '';
      if (mime === 'application/vnd.google-apps.document') {
        // Native Google Doc → read text (getBlob would give a PDF).
        try {
          content = DocumentApp.openById(p.id).getBody().getText();
        } catch (docErr) {
          // Fallback: export endpoint with the script's OAuth token.
          var exportUrl = 'https://docs.google.com/document/d/' + p.id + '/export?format=txt';
          var resp = UrlFetchApp.fetch(exportUrl, {
            headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
            muteHttpExceptions: true
          });
          content = resp.getContentText('UTF-8');
        }
      } else {
        content = file.getBlob().getDataAsString('UTF-8');
      }
      content = String(content).replace(/^﻿/, '');
      return jsonOut({ status: 'ok', filename: file.getName(), content: content });
    } catch (err) {
      return jsonOut({ status: 'error', error: err.toString() });
    }
  }
  return jsonOut({ ok: true, service: 'OB Academy — Form Handler' });
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SHEET → SITE AUTOMATION
 *  Pages read the Sheet live, so content updates instantly on their own.
 *  What needs a rebuild is the machine layer: new episode/event PAGES, the
 *  sitemap, feed.xml and llms.txt. This block automates that:
 *    sheet edited → (debounced) trigger a Vercel deploy → ~8 min later
 *    submit the fresh sitemap to IndexNow (Bing/Yandex/etc).
 *
 *  SETUP (once):
 *   1. Vercel → Project → Settings → Git → Deploy Hooks → create one
 *      (name: "sheet-update", branch: main) and paste the URL below.
 *   2. Run setupSheetAutomation() from the editor (authorizes + installs
 *      the onChange trigger).
 *   3. Redeploy the web app (Manage deployments → Edit → New version).
 * ═══════════════════════════════════════════════════════════════════════ */

var VERCEL_DEPLOY_HOOK = 'https://api.vercel.com/v1/integrations/deploy/prj_gXVzB1F1QMqtgoAwq0d3jbyFdxox/QMeONRfGGC';
var SITE_HOST          = 'www.obacademy.org';
var INDEXNOW_KEY       = '4415a94909a4e0790f3164c63410ba07';
var DEPLOY_DEBOUNCE_MS = 10 * 60 * 1000;   // at most one deploy per 10 min
var INDEXNOW_DELAY_MS  = 8 * 60 * 1000;    // give Vercel time to go live

// Installable onChange trigger target: fires on any sheet edit/change.
function onSheetChange(e) {
  if (!VERCEL_DEPLOY_HOOK) return; // not configured yet
  var props = PropertiesService.getScriptProperties();
  var last = Number(props.getProperty('lastDeployAt') || 0);
  if (Date.now() - last < DEPLOY_DEBOUNCE_MS) return; // debounce bursts of edits
  props.setProperty('lastDeployAt', String(Date.now()));

  try {
    UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK, { method: 'post', muteHttpExceptions: true });
    // One-shot follow-up: submit the fresh sitemap once the deploy is live.
    ScriptApp.newTrigger('submitIndexNow').timeBased().after(INDEXNOW_DELAY_MS).create();
    Logger.log('Deploy triggered; IndexNow scheduled.');
  } catch (err) {
    Logger.log('Deploy hook error: ' + err);
  }
}

// Submits every sitemap URL to IndexNow (covers Bing, Yandex, Seznam, Naver).
function submitIndexNow() {
  // Clean up finished one-shot triggers for this function.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'submitIndexNow') ScriptApp.deleteTrigger(t);
  });
  try {
    var xml = UrlFetchApp.fetch('https://' + SITE_HOST + '/sitemap.xml', { muteHttpExceptions: true }).getContentText();
    var urls = (xml.match(/<loc>([^<]+)<\/loc>/g) || []).map(function (m) { return m.replace(/<\/?loc>/g, ''); });
    if (!urls.length) { Logger.log('IndexNow: no sitemap URLs found'); return; }
    var res = UrlFetchApp.fetch('https://api.indexnow.org/indexnow', {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: 'https://' + SITE_HOST + '/' + INDEXNOW_KEY + '.txt',
        urlList: urls,
      }),
      muteHttpExceptions: true,
    });
    Logger.log('IndexNow: ' + urls.length + ' URLs submitted, HTTP ' + res.getResponseCode());
  } catch (err) {
    Logger.log('IndexNow error: ' + err);
  }
}

// Run once from the editor to install the onChange trigger.
function setupSheetAutomation() {
  var exists = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'onSheetChange';
  });
  if (!exists) {
    ScriptApp.newTrigger('onSheetChange')
      .forSpreadsheet(SHEET_ID)
      .onChange()
      .create();
  }
  Logger.log(exists ? 'Trigger already installed.' : 'onChange trigger installed.' +
    (VERCEL_DEPLOY_HOOK ? '' : ' NOTE: paste the Vercel Deploy Hook URL into VERCEL_DEPLOY_HOOK.'));
}

/* ── setup / tests ───────────────────────────────────────────────────── */

// RUN THIS ONCE from the editor (Run ▶ authorize) after pasting/editing this
// file. It triggers the consent screen so the web app gains every scope it
// needs (Drive, Docs, external fetch, Gmail, Sheets). THEN redeploy:
//   Deploy → Manage deployments → ✏️ Edit → Version: "New version" → Deploy
// (Editing keeps the same /exec URL — no env change needed.)
function authorize() {
  DriveApp.getRootFolder();                         // Drive scope
  try { UrlFetchApp.fetch('https://www.google.com'); } catch (e) {} // external_request scope
  SpreadsheetApp.openById(SHEET_ID).getName();      // Sheets scope
  Logger.log('Authorized. Now redeploy a NEW VERSION of the web app.');
}

// Confirms transcript export works for a given Google Doc id.
function testTranscript() {
  var id = '1jLsvb1BJ9y37Z4qFkLoPGlDX8BdtwccAmq30WDZ2_ms'; // a real transcript Doc id
  Logger.log(doGet({ parameter: { action: 'getTranscript', id: id } }).getContent().slice(0, 300));
}

function testContact() {
  Logger.log(routeForm({ tab: 'Contact Us', first_name: 'Test', last_name: 'User', email: 't@e.com', subject: 'general', message: 'Hi' }).getContent());
}

function testPodcastGate() {
  Logger.log(routeForm({ form: 'podcast_gate', name: 'Test User', email: 't@e.com', practice_name: 'Test Eye Care', podcast_episode: '75' }).getContent());
}
