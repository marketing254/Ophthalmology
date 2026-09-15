# OB Academy — SEO Action Plan (2026-09-14)

## Do now (you)

1. **Commit + push this batch, let Vercel deploy.** Everything below assumes the deploy is live.
2. **Verify after deploy** (2 minutes):
   - `https://www.obacademy.org/podcast/episode/the-science-and-art-of-patient-recall/` loads with content
   - `/sitemap.xml` shows ~85 URLs, `/feed.xml`, `/llms.txt` respond
   - `https://www.obacademy.org/msm/` 301-redirects to `/marketing/`
   - `curl -I https://www.obacademy.org/` shows the new security headers
3. **Search Console — sitemap.** You do NOT re-upload anything: the sitemap is a URL Google refetches on its own after you deploy. To nudge it: GSC → Sitemaps → click the existing `sitemap.xml` row → ⋮ isn't needed — just type `sitemap.xml` in the "Add a new sitemap" box and press Submit again. Submitting the same path re-queues a fresh fetch. (Deleting and re-adding does the same; neither loses history.)
4. **GSC — request indexing** (URL Inspection → Request indexing) for: `/`, `/podcast/`, `/about/`, `/marketing/`, and 3–5 top episode URLs. The rest follow via the sitemap.
5. **Bing Webmaster Tools**: import the site from GSC (one click) and submit the same sitemap.

## This week

6. **Fix the four pages Google currently thinks are homepage duplicates**: after deploy, use URL Inspection on `/about/`, `/marketing/`, `/guest-speaker/`, `/contact/` and request indexing so the corrected canonicals get picked up fast.
7. **Enhancements report watch**: within ~2 weeks GSC should surface FAQ rich results (About + Marketing) — check Enhancements → FAQ.
8. **Add the Apple Podcasts show URL** next to the 5.0 rating claims (source + citation-ready), and YouTube channel to Organization `sameAs` if one exists.

## This month — content & structure

9. **Transcripts into the pages** (biggest remaining on-site win): prerender episode transcripts into the static pages at build time (I can wire this; it reuses the existing transcript URLs). Each episode page then carries thousands of crawlable, quotable words — the exact material AI engines cite. Start with the 10–15 highest-intent episodes.
10. **Prerender webinars/resources/reviews lists** the same way episodes were done (build-time initial data + live refresh).
11. **Publishing cadence**: nothing new since June 2024 is the #1 freshness limiter. Even one new episode/panel per month moves every freshness signal at once (sitemap lastmod, feed, homepage).

## Backlinks (off-site — nothing in code can do this)

Priority order for a niche B2B brand like this:
1. **Reclaim existing mentions**: Mann Eye Institute, Concord Eye Center, Ekwa, NBCOE — the hosts' own organizations should link to obacademy.org (highest-trust, easiest wins).
2. **Guest-loop links**: every past podcast guest (59 named people) has a practice/company site — send each a "your episode" link kit (episode URL + pull-quote + cover image). Even a 20% hit rate = 12+ relevant backlinks.
3. **Podcast directories** already link the Libsyn feed — make sure the *show notes* on Apple/Spotify/Libsyn point to `www.obacademy.org/podcast/episode/<slug>/` pages, not the old WordPress URLs (those now 301, but direct links are better).
4. **Industry press**: Ophthalmology Times, EyeWorld, Review of Ophthalmology accept contributed practice-management articles — one byline per quarter with an author-bio link.
5. **Event cross-links**: panelists for Sept 17/24 webinars should get a promo kit linking to `reg.obacademy.org` AND `www.obacademy.org/webinars/`.
6. Directory/profile hygiene: LinkedIn company page website field, Crunchbase, podcast aggregators (Podchaser, ListenNotes claim pages).

## Later / decisions

- Block CCBot + Bytespider in robots.txt if you want AI citations without model-training reuse (doesn't affect citations).
- Square 3000×3000 podcast artwork only if you ever submit `/feed.xml` to a directory (don't — Libsyn's feed is already the canonical one on Apple; 5.0★ history lives there).
- Consider a monthly scheduled Vercel redeploy (Deploy Hook + cron) so new sheet episodes get their static pages without a manual push.
