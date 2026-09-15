# OB Academy — Full SEO Audit Report

**Site:** https://www.obacademy.org · **Audited:** 2026-09-14 · **Business type:** B2B education / media brand (podcast + events) for ophthalmology practices
**Method:** /seo-audit with parallel subagents (content quality, GEO/AI-readiness) against the live site, plus technical/schema verification against the build output. Skill references used: `D:\Optho\skills\ai-seo`, `content-strategy`, and related SEO skill files.

---

## Executive summary

| | Score |
|---|---|
| **Live site today (before this batch deploys)** | **≈ 52 / 100** |
| **After deploying this batch (verified in build output)** | **≈ 80 / 100 projected** |

The single biggest problem found: the site's core asset — 75+ podcast episodes — was **invisible to search and AI crawlers**. Episodes rendered only client-side from the Google Sheet ("Loading episodes…" was all a crawler saw), had no individual URLs, no schema, and no sitemap entries. Four pages also carried a **critical canonical bug** telling Google they were duplicates of the homepage.

Everything in the "Fixed in this batch" column below is implemented and verified in the build output; it goes live on your next push.

## Critical findings and their status

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | Episodes client-rendered only; invisible to GPTBot/ClaudeBot/PerplexityBot and no per-episode URLs | Critical | **FIXED** — 75 static pages at `/podcast/episode/<slug>/`, each with ~250 words of prerendered content, self-canonical, unique meta, PodcastEpisode JSON-LD. Live sheet layer still refreshes on top (instant updates preserved). |
| 2 | Canonical tag on About/Marketing/Guest-speaker/Contact pointed at the homepage (self-cannibalization) | Critical | **FIXED** — every page now emits a correct self-canonical; root default removed. |
| 3 | og:url identical (homepage) on all pages; one shared OG description | High | **FIXED** — per-page og:url, unique OG titles/descriptions, and 9 page-specific OG images in `/og/`. |
| 4 | No per-episode sitemap entries, no lastmod anywhere | High | **FIXED** — sitemap now build-generated: 85 URLs (10 pages + 75 episodes) with truthful lastmod (build date for pages, publish date for episodes). |
| 5 | `/llms.txt` and `/llms-full.txt` missing (404) | High | **FIXED** — both generated at build from the sheet: entity summary, aliases (OB Academy, OBA), hosts with credentials, key pages, all 75 episode links (+summaries in the full version). Referenced from robots.txt. |
| 6 | No podcast RSS feed on-domain | High | **FIXED** — `/feed.xml`: valid RSS 2.0 + iTunes namespace, 73 items, every enclosure carrying a real measured byte length (HEAD-verified at build). |
| 7 | No Person schema for the three credentialed hosts | High | **FIXED** — Person entities with stable @ids for Naren Arulrajah, Guido Piquet (COE, MBA), Sarah Duval (COE, COA) on /about/, linked to the Organization node. |
| 8 | No FAQPage schema despite FAQ content | Medium | **FIXED** — FAQPage JSON-LD + a visible Q&A block on /about/ (4 citable answers built strictly from existing facts), FAQPage JSON-LD on /marketing/'s existing FAQs. |
| 9 | Legacy WordPress / old-route URLs 404 with no redirects; no security headers | High | **FIXED** — `vercel.json`: 60+ permanent redirects (msm→marketing, speak→guest-speaker, podcast/episodes/:slug→episode pages, about-us, blog, membership, etc.) + nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS. |
| 10 | Ekwa relationship disclosed only deep in /marketing/ FAQ | Medium | **FIXED** — disclosure line added in the marketing hero ("A free service provided by Ekwa Marketing, the team behind OB Academy…"). |
| 11 | Meta descriptions over 160 chars on 5 pages; duplicated og descriptions | Medium | **FIXED** — all trimmed ≤155 and made unique. |
| 12 | Back-compat `?e=` episode route would duplicate the new static pages | Medium | **FIXED** — old query route kept working but noindexed; all internal links point at the static URLs. |
| 13 | "OBA" alias never appeared in HTML | Low | **FIXED** — added on /about/ and in llms.txt. |

## Remaining gaps (not fixable in this batch, or your call)

| Finding | Severity | What to do |
|---|---|---|
| Webinars / resources / reviews lists still render client-side only (same pattern episodes had) | Medium | Same prerender treatment can be applied next; webinars matter most while panels are running. |
| Transcripts aren't in the HTML (fetched from Google Drive on click) | Medium | Highest-value content-SEO project: served transcripts would give each episode page 3,000+ crawlable words. Needs a build-time transcript fetch — say the word. |
| The 5.0★ Apple Podcasts claim isn't linked/dated to its source | Low | Add the Apple Podcasts show link next to the claim when you have the show URL handy. |
| No square podcast artwork for the feed (Apple requires 3000×3000 if you ever submit this feed) | Low | Only matters if you submit /feed.xml to directories — the show is already on Apple via Libsyn, so **don't** double-submit; the on-domain feed is for crawlers/SEO. |
| No YouTube in Organization sameAs (strongest AI-citation brand signal) | Low | If a channel exists, add it. |
| Homepage ~371 words (thin) | Low | Optional: one more substantive section. |
| CCBot / Bytespider (model-training crawlers) currently allowed | Info | Business decision: block them if you want citations without training reuse; doesn't affect ChatGPT/Claude/Perplexity citations. |

## GEO / AI-readiness scorecard

Live today ≈ **39/100** (agent-scored). After this batch: citability and technical accessibility jump (episodes readable, llms.txt, feed, FAQPage/Person schema) → estimated **~70/100**; the remaining ceiling is transcripts-in-HTML, webinar prerendering, and off-site brand signals (YouTube/Wikipedia-grade mentions).

## Verified build-output checks (post-fix state)

- Episode page sample: 245 visible words, `PodcastEpisode` JSON-LD, self-canonical, unique title ✓
- sitemap.xml: 85 URLs, lastmod on all ✓ · feed.xml: 73 items, 0 zero-length enclosures ✓
- llms.txt: 75 episode links ✓ · About JSON-LD: FAQPage + 4 Q&A + 3 Person ✓ · Marketing: FAQPage ✓
- Old `?e=` route: noindex,follow ✓ · robots.txt: AI crawlers allowed, sitemap + llms.txt referenced ✓
