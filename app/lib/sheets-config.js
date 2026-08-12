// ===========================================================================
//  OB Academy, Google Sheets configuration (single source of truth)
//
//  The website reads CONTENT directly from the Google Sheet via the public
//  gviz endpoint (client-side), so any edit in the Sheet reflects on the site
//  on the next page load, no rebuild/deploy needed.
//
//  ⚠️ REQUIRED ONE-TIME SETUP IN GOOGLE:
//    1. Open the Sheet Share General access
//       "Anyone with the link" Viewer.
//       (Also recommended: File Share Publish to web Entire document.)
//       Without this the gviz read returns a sign-in page and the site shows
//       empty states.
//    2. Deploy the Apps Script (see /apps-script/Code.gs) as a Web App
//       (Execute as: Me, Access: Anyone) and paste its /exec URL below.
// ===========================================================================

export const SHEET_ID = '1aWs2_hb5dr2c-bAHxEk6y1TE-_hmg1wO8Yx6bIyJ8zQ';

// Apps Script Web App /exec URL, handles form writes + transcript proxy.
// Falls back to '' (forms still validate; submissions are no-op until set).
export const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

// How long (ms) a fetched tab is cached in memory before re-fetching.
// Lower = fresher; the gviz CDN itself caches a few minutes regardless.
export const SHEET_TTL_MS = 60 * 1000;

// Content tabs EXACT sheet tab names (verified against the live workbook).
// IMPORTANT: gviz silently returns the FIRST sheet for any name it can't find,
// so these MUST be exact. Each key maps to its real tab name.
export const TABS = {
  podcasts: ['podcats'],            // (sheet tab is spelled "podcats")
  webinars: ['webinars'],           // upcoming live sessions (date/register_url)
  events: ['webinars'],             // alias, same tab as upcoming webinars
  replays: ['webinar-replays'],     // on-demand replays (vimeo_url)
  resources: ['resources'],
  reviews: ['reviews'],
  experts: ['experts'],             // hosts / speakers
  partners: ['featured partners'],  // partner orgs/people
  caseStudies: ['case-studies'],
  faqs: ['faqs'],
};

// The default/first sheet, used to detect gviz's silent fallback.
export const FIRST_SHEET = 'webinars';

// Optional Kit (ConvertKit) form IDs for parallel newsletter/lead capture.
// Leave blank to skip Kit and write only to the Sheet via Apps Script.
export const KIT_FORM_IDS = {
  podcast_gate: '',
  webinar_replay_gate: '',
  newsletter_signup: '',
  contact_us: '',
};
