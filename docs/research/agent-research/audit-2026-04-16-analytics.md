# Analytics, Tracking & GSC Audit — 2026-04-16

**Auditor:** analytics-analyst
**Domain:** alexmayhew.dev
**GA4 Property:** `G-K4TLSRKMCV`
**GSC Property:** `sc-domain:alexmayhew.dev`
**Data window:** 90 days (2026-01-17 → 2026-04-17)

---

## Executive Summary

**Infrastructure is solid. Instrumentation has gaps. Domain authority is the bottleneck.**

- GA4 + Consent Mode v2 + Cloudflare Web Analytics + client Sentry are correctly deployed (verified on live HTML).
- **Major tracking gaps:** SaaS Scaling Quiz has zero instrumentation; no server-side Sentry (Cloudflare Workers runtime); contact form lead event lacks projectType/budget/referralSource parameters; no Gumroad cross-domain configured; no user_properties set on gtag.
- **GSC reality:** 4 clicks, 1,057 impressions, 0.38% CTR over 90 days. Sitemap reports `submitted=125, indexed=0` (API doesn't report indexed count for this property — inferred via URL Inspection: 3/8 sampled pages indexed). www versions of pages still outrank non-www in impressions (754 vs 529) despite the 2026-03-30 301 redirect.
- **28-day trend is positive:** impressions jumped 162 → 716 (+342%) from prior 28d. This is the first signal internal-linking fixes are landing.

Top priority for measurement improvement: instrument the quiz funnel (currently flying blind on a brand-new lead magnet).

---

## 1. GA4 Implementation — VERIFIED WORKING

### 1.1 Script loading — PASS

**Evidence:**

- `src/app/layout.tsx:174` loads `<GoogleAnalytics />` client component (dynamic import).
- `src/components/analytics/google-analytics.tsx:23-25` loads `https://www.googletagmanager.com/gtag/js?id=${measurementId}` with `strategy="afterInteractive"`.
- Live HTML fetch of `https://alexmayhew.dev/` confirms: `G-K4TLSRKMCV`, `cloudflareinsights`, `gtag` strings present in rendered source.
- `src/components/analytics/google-analytics.tsx:28-29` initializes `window.dataLayer` and `gtag` function before config.

### 1.2 Consent Mode v2 — PASS (region-specific defaults)

**Evidence:** `src/app/layout.tsx:150-154` inlines a `<script>` in `<head>` (before GA4 script loads) that sets:

- **EEA/UK/CH (31 regions):** `analytics_storage=denied, ad_storage=denied, ad_user_data=denied, ad_personalization=denied, wait_for_update=500`
- **All other regions:** `analytics_storage=granted, ad_storage=denied, ad_user_data=denied, ad_personalization=denied`
- Reads `localStorage['cookie-consent']` and calls `gtag('consent','update',...)` when user has granted.
- Region list: AT, BE, BG, HR, CY, CZ, DK, EE, FI, FR, DE, GR, HU, IE, IT, LV, LT, LU, MT, NL, PL, PT, RO, SK, SI, ES, SE, IS, LI, NO, CH, GB.

**[LOW] Minor polish:** The `wait_for_update:500` only applies to the EEA default, not the non-EEA default. This is correct per Google docs, but the inline script style is fragile — any edit risks breaking the first `gtag('consent','default', ...)` call. Consider moving to a typed component.

### 1.3 `conversion_linker` and `send_page_view` — PASS

`src/components/analytics/google-analytics.tsx:32-37` config:

- `send_page_view: false` — correct, PageAnalytics component fires SPA page_view events (src/components/analytics/page-analytics.tsx:30-44).
- `conversion_linker: true` — good for cross-page tracking.
- `allow_google_signals: true` — enables demographics/interests; worth confirming privacy policy covers this.
- `allow_ad_personalization_signals: false` — correct.

### 1.4 SPA page_view firing — PASS

`src/components/analytics/page-analytics.tsx:24-45` fires `page_view` events on pathname/searchParams changes with:

- `page_path`, `page_title`, `page_location`
- UTM params (source/medium/campaign/content/term) as separate params
- Custom dimensions: `page_category`, `content_type`, `user_type`

**[MEDIUM] Custom dimensions must be registered in GA4 Admin to be usable in reports.** Comment at `page-analytics.tsx:40` acknowledges this: "register them in GA4 admin." Unverified whether that has been done — report creator should check GA4 Admin > Custom Definitions.

### 1.5 Event tracking — PARTIAL

Tracking functions exported from `src/components/analytics/google-analytics.tsx`:

| Function                                       | Coverage            | File:line of caller                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trackCTAClick`                                | Good: 13 call sites | home-page.tsx:100,406; services-page-content.tsx:337; service-page-content.tsx:205,829; migration-page-content.tsx:886; integration-page-content.tsx:997; comparison-page-content.tsx:927; role-page-content.tsx:127,523; technology-page-content.tsx:450; for-hub-page.tsx:176; technologies-page-content.tsx:196; blog-article.tsx:245 |
| `trackEvent('form_start')`                     | contact form only   | contact-page.tsx:113                                                                                                                                                                                                                                                                                                                     |
| `trackLeadEvent('generate_lead')`              | contact form only   | contact-page.tsx:93                                                                                                                                                                                                                                                                                                                      |
| `trackNewsletterEvent('newsletter_subscribe')` | newsletter signups  | newsletter-signup.tsx:38 (5 sources tracked via `source` prop)                                                                                                                                                                                                                                                                           |
| `trackContentEvent` (scroll/engagement)        | blog + some pages   | use-content-analytics.ts hook                                                                                                                                                                                                                                                                                                            |
| `trackServiceEvent('view_item')`               | service pages       | use-content-analytics.ts:53-62                                                                                                                                                                                                                                                                                                           |

### 1.6 User properties — MISSING

- **[MEDIUM] No `gtag('set', 'user_properties', {...})` calls anywhere in codebase.**
- `src/components/analytics/page-analytics.tsx:86-107` computes `user_type` (bot / linkedin_visitor / twitter_visitor / search_visitor / developer / direct_visitor / referral_visitor) but passes it as an **event param**, not a user property.
- Event params are per-event; user properties persist across session for cohort/audience building.
- **Impact:** Cannot build GA4 audiences like "returning technical visitors" or segment behavior reports by traffic source category.
- **Recommendation:** Call `gtag('set', 'user_properties', { user_type, traffic_category })` once per session (e.g., in PageAnalyticsInner on first render). Also track `returning_visitor` via `localStorage` check.

### 1.7 UTM handling — PASS with gap

- `src/components/analytics/page-analytics.tsx:35-39` reads `utm_source/medium/campaign/content/term` from `searchParams` and sends as `campaign_source/medium/name/content/term` on every page_view.
- **[MEDIUM] UTM values sent as event params, not as campaign_id or standard GA4 campaign params.** GA4 already attributes traffic by UTM natively via `traffic_source` dimension. Sending custom `campaign_source` creates duplicate data that won't appear in default acquisition reports.
- **Recommendation:** Either remove these custom params (let GA4 handle natively) or map to GA4's standard event params when using Measurement Protocol. Native UTM attribution works without this code.

---

## 2. Cloudflare Web Analytics — VERIFIED WORKING

**Evidence:**

- `src/components/analytics/cloudflare-analytics.tsx:23-28` loads `https://static.cloudflareinsights.com/beacon.min.js` with beacon token from `NEXT_PUBLIC_CF_BEACON_TOKEN`.
- `data-cf-beacon` attribute is a stringified JSON (no spaces after colon intentional for beacon parser).
- Beacon token in memory: `7b99809687974163b0e4d3b22634c4e9`.
- Live HTML confirms `cloudflareinsights` string in rendered source.
- CSP allows `https://static.cloudflareinsights.com` in `script-src` and `https://cloudflareinsights.com` in `connect-src` (middleware.ts:9,13).

**[LOW]** The inline beacon script is fully blocked by `script-src 'self' 'unsafe-inline' ...` — works, but `'unsafe-inline'` is required for the inline gtag bootstrap. Converting to a nonce-based CSP is a future hardening task.

---

## 3. Sentry Configuration — PARTIAL (server-side disabled)

### 3.1 Client Sentry — PASS

**Evidence:** `sentry.client.config.ts:1-49`:

- DSN from `NEXT_PUBLIC_SENTRY_DSN`
- `enabled: process.env.NODE_ENV === "production"` — correct.
- `tracesSampleRate: 0.1` (10%) — reasonable for low traffic.
- `replaysSessionSampleRate: 0.1` (10% of sessions) + `replaysOnErrorSampleRate: 1.0` (100% on errors) — standard.
- `browserTracingIntegration({ enableInp: true })` — captures INP for Core Web Vitals.
- `replayIntegration({ maskAllText: false, blockAllMedia: false })` — **[LOW/medium]** Recording all text and media may expose PII (contact form inputs) in session replays. For a lead-gen site, consider `maskAllInputs: true` or at minimum mask the contact form.
- Noise filters: network errors, browser extensions, ResizeObserver — correct.

### 3.2 Server Sentry — DISABLED

**Evidence:** `src/instrumentation.ts:1-6`:

```ts
// Server-side Sentry is disabled: @sentry/nextjs uses AsyncLocalStorage
// bound functions that are incompatible with Cloudflare Workers runtime.
```

- **[HIGH]** No server error visibility. Contact form failures (Resend API 5xx, Listmonk API failures, Turnstile errors) only go to `console.error` which lands in Cloudflare logs but no alerting.
- `package.json` already has `@sentry/cloudflare@^10.43.0` installed — migration path exists per `docs/DEFERRED_AUDIT_ITEMS.md`.
- `sentry.server.config.ts` and `sentry.edge.config.ts` files exist but are effectively dead code because `register()` is a no-op.

### 3.3 CSP — PASS for Sentry

`middleware.ts:13` allows `https://*.ingest.sentry.io` and `https://*.ingest.us.sentry.io` in `connect-src`. Verified.

---

## 4. Conversion Funnel Audit

### 4.1 Funnel definition

Stage 1: Landing (homepage / blog / pSEO service pages)
→ Stage 2: Engagement (scroll, CTA click)
→ Stage 3: Contact form view (navigate to /contact OR view quiz)
→ Stage 4: Form start (focus on any input)
→ Stage 5: Lead (form submit success)

### 4.2 Stage-by-stage instrumentation

| Stage               | Event                              | Evidence                         | Gap                                                     |
| ------------------- | ---------------------------------- | -------------------------------- | ------------------------------------------------------- |
| 1. Landing          | `page_view`                        | page-analytics.tsx:30            | PASS                                                    |
| 2a. Scroll          | `scroll` at 25/50/75/90%           | use-content-analytics.ts:107-113 | PASS on blog/service pages                              |
| 2b. Time engagement | `user_engagement` at 30s/60s/2m/5m | use-content-analytics.ts:71-86   | PASS                                                    |
| 2c. CTA click       | `cta_click`                        | 13 call sites                    | PASS (homepage, services, roles, blog, technology, for) |
| 3. Contact view     | `page_view` for /contact           | page-analytics.tsx               | PASS                                                    |
| 4. Form start       | `form_start`                       | contact-page.tsx:113             | PASS (fires once on first focus)                        |
| 5. Lead submit      | `generate_lead`                    | contact-page.tsx:93              | **PARTIAL**                                             |

### 4.3 [HIGH] Contact form lead_event is missing form values

**Evidence:** `src/components/pages/contact-page.tsx:93-100`:

```ts
trackLeadEvent("generate_lead", {
	lead_source: "contact_form",
	project_type: "unknown",
	budget_range: "unknown",
	form_type: "consultation_request",
	referral_source: "not_specified",
});
```

The actual form values (`projectType`, `budget`, `referralSource` from the select fields at contact-page.tsx:200-300) are **never read** and passed to the lead event. The server action (`src/app/actions/contact.ts:151`) has them but the client-side `trackLeadEvent` is fired after server success without re-reading form state.

**Impact:** Cannot segment leads by budget range, project type, or referral source in GA4. This is the highest-value segmentation data and it's being discarded.

**Fix:** Capture form data in `onSubmit` / `useEffect` via `FormData` or state before the server action, or have the server action return the validated values so the client can track them.

### 4.4 [CRITICAL] SaaS Scaling Quiz has ZERO tracking

**Evidence:** `src/components/tools/saas-readiness-quiz.tsx` (316 lines).

- No import of `trackEvent`, `trackLeadEvent`, or any analytics function.
- `handleStart()` (line 26) — no tracking.
- `handleAnswer()` (line 30) — no tracking.
- `ResultsScreen` (line 191) — no tracking of completion, final score, weakest categories.
- "Book a Strategy Call" CTA on results (line 294-303) — no `trackCTAClick`.

This is a brand-new lead magnet (shipped 2026-04-05, coverage 88%→95%, 1099 tests per recent commit `2108306`) and it is completely invisible to analytics. There is no way to measure:

- Quiz start rate (intro view → start click)
- Per-question drop-off
- Completion rate
- Score distribution of completers
- Results → contact CTR (the actual conversion)

**Also [CRITICAL]:** Quiz has no email capture. The lead magnet loses the user at the top of funnel.

**Recommended events (GA4 recommended event names where possible):**

```
quiz_start                 { quiz_id: "saas-readiness" }
quiz_question_answered     { quiz_id, question_id, question_index, category, score_value }
quiz_complete              { quiz_id, total_score_percent, tier_label, weakest_category }
quiz_abandon               { quiz_id, abandoned_at_question, time_spent_ms }
cta_click                  { cta_name: "book_strategy_call", cta_location: "quiz_results", quiz_tier, quiz_score }
quiz_restart               { quiz_id, previous_score }
```

Also note: `src/app/tools/saas-readiness/page.tsx` has zero view tracking beyond generic `page_view` — no `select_content` event for the tool-specific funnel entry.

### 4.5 Additional gaps

- **[MEDIUM]** Chat widget (`ChatWidget` dynamic import, layout.tsx:30) — no visibility if it's tracked.
- **[MEDIUM]** Exit intent / abandoned form tracking not implemented. `form_start` fires but no `form_abandon` is tracked on navigation away.
- **[LOW]** File downloads (`/llms.txt`, RSS at `/feed.xml`, any PDFs) — no `file_download` tracking.
- **[LOW]** Outbound link clicks to LinkedIn, X, GitHub, external references — no tracking.

---

## 5. GSC Data — 90 Days (2026-01-17 → 2026-04-17)

**Source:** Google Search Console API via `sc-domain:alexmayhew.dev` with service account JWT. `searchanalytics.query` + `urlInspection.index.inspect` endpoints.

### 5.1 Aggregate totals

| Metric       | 90d   | Last 28d | Prior 28d | Δ 28d      | Last 7d |
| ------------ | ----- | -------- | --------- | ---------- | ------- |
| Impressions  | 1,057 | 716      | 162       | **+342%**  | 144     |
| Clicks       | 4     | 2        | 1         | +100%      | 1       |
| CTR          | 0.38% | 0.28%    | 0.62%     | ↓          | 0.69%   |
| Avg Position | 7.5   | 7.2      | 8.4       | ↑ (better) | 8.5     |

**Interpretation:** The impression surge from 162 → 716 between the two 28-day windows (Feb 20 - Mar 20 vs Mar 20 - Apr 17) maps directly to the 2026-03-30 SEO work (www→non-www redirect, 108 internal links via relatedBlogPosts, homepage 2→13 links, blog crawlability fix). This confirms the indexing strategy is working. Clicks are still in single digits because average position is 7-8 — below the first three organic results that capture >60% of clicks.

### 5.2 Top queries (9 total queries with impressions in 90d)

| #   | Query                                  | Impressions | Clicks | CTR   | Position |
| --- | -------------------------------------- | ----------- | ------ | ----- | -------- |
| 1   | alex mayhew                            | 12          | 1      | 8.33% | 23.8     |
| 2   | "static types" "living documentation"  | 14          | 0      | 0.00% | 8.8      |
| 3   | alexander mayhew                       | 3           | 0      | 0.00% | 26.3     |
| 4   | alexmayhew                             | 4           | 0      | 0.00% | 45.5     |
| 5   | microservices tax                      | 2           | 0      | 0.00% | 21.5     |
| 6   | pgvector vs dedicated vector databases | 1           | 0      | 0.00% | 6.0      |
| 7   | rest vs graphql comparison 2026        | 1           | 0      | 0.00% | 8.0      |
| 8   | rest vs graphql differences 2026       | 1           | 0      | 0.00% | 10.0     |
| 9   | rest vs graphql main differences 2026  | 1           | 0      | 0.00% | 10.0     |

**Critical finding:** GSC only returns queries above a privacy threshold (typically 10 impressions per query per day within the period) plus individual days' low-volume. The aggregate has 1,057 impressions but only 9 queries shown. This means **most impressions come from long-tail queries below the threshold** — the real query footprint is much wider but opaque.

**Branded search:** "alex mayhew" only 12 impressions at position 23.8 — the site is not winning its own name. Previously Alex was not in knowledge panel / Person schema hadn't propagated. Given recent Person schema consolidation (2026-03-30, per memory), this should improve over next 30-60 days.

### 5.3 Top pages (25 returned, 90d)

| #   | Page                                          | Impressions | Clicks | Position |
| --- | --------------------------------------------- | ----------- | ------ | -------- |
| 25  | www./blog/vector-database-selection           | 197         | 0      | 7.5      |
| 10  | /blog/typescript-business-case                | 123         | 0      | 6.8      |
| 24  | www./blog/saas-billing-stripe-architecture    | 104         | 0      | 7.5      |
| 22  | www./blog/incident-response-saas              | 94          | 0      | 6.2      |
| 1   | / (homepage)                                  | 71          | 2      | 11.8     |
| 14  | /newsletter/002-microservices-cost            | 68          | 0      | 8.1      |
| 23  | www./blog/rag-architecture-saas               | 59          | 0      | 5.9      |
| 3   | www./blog/llm-cost-optimization-scale         | 55          | 1      | 7.0      |
| 8   | /blog/metr-paradox-ai-productivity            | 35          | 0      | 6.6      |
| 7   | /blog/ai-assisted-development-generative-debt | 34          | 0      | 6.3      |
| 12  | /docs                                         | 32          | 0      | 3.9      |
| 2   | /for                                          | 29          | 1      | 4.3      |
| 11  | /blog/vector-database-selection               | 28          | 0      | 9.0      |
| 15  | /privacy                                      | 27          | 0      | 5.9      |
| 19  | /work/claude-pilot                            | 21          | 0      | 7.4      |

Full top-25 list available in raw data. Summary of noteworthy patterns:

- **[HIGH]** `/blog/saas-billing-stripe-architecture` has 104 impressions (www) but **URL Inspection reports `URL is unknown to Google`** for non-www version. The 301 redirect from www has not yet propagated Google's indexed URL to the non-www canonical for this slug. This is a per-URL issue — some posts transitioned, others didn't.
- **[HIGH]** `/tools/saas-readiness` — **`URL is unknown to Google`**, never crawled (verified via URL Inspection). Quiz exists since 2026-04-05 but is not in indexed set. May be missing from internal links (quiz isn't in blog-index or sidebar nav — check homepage and `/tools/` linking).
- **[HIGH]** `/services/technical-advisor-for-startups` — **`Crawled - currently not indexed`**, last crawl 2026-03-15. Google saw it but chose not to index. Common signal: thin/duplicative content, low authority, or signal that newer versions exist. Needs investigation.
- **[MEDIUM]** `/contact` — **`URL is unknown to Google`**. The final conversion destination is not indexed. Low impact (users arrive via internal links) but suggests site-wide crawl budget starvation persists.
- `/for` page showed up indexed with 29 impressions + 1 click (position 4.3) — this is the second-highest click-generating page, suggests the role pages have search potential.
- Blog pages cluster around positions 5-9 — right at "second-page" threshold. Pushing any of these to positions 1-3 would dramatically increase clicks.

### 5.4 www vs non-www — REDIRECT STILL PROPAGATING

**Evidence:**

| Version             | Pages with impressions | Impressions | Clicks |
| ------------------- | ---------------------- | ----------- | ------ |
| www (legacy)        | 16                     | 754         | 1      |
| non-www (canonical) | 17                     | 529         | 3      |

- 2026-03-30 the 301 was deployed; as of 2026-04-17, **www URLs still produce more impressions than non-www** (754 vs 529).
- Google has not yet fully migrated the canonical URL preference. Typical full propagation: 2-6 weeks. We are at ~18 days post-redirect.
- **Positive:** 3 of 4 total clicks go to non-www (the 4th goes to www `/blog/llm-cost-optimization-scale`), which suggests Google Search is starting to present non-www URLs in SERP at similar rates.
- `http:///` (5 imp) and `http://www./` (3 imp) impressions show legacy HTTP URLs still appearing, will fade over time.

### 5.5 Devices

| Device  | Impressions | Clicks | CTR   |
| ------- | ----------- | ------ | ----- |
| DESKTOP | 981         | 1      | 0.10% |
| MOBILE  | 73          | 3      | 4.11% |
| TABLET  | 3           | 0      | 0.00% |

**Observation:** Mobile CTR is 41x higher than desktop (4.11% vs 0.10%). Small sample (3 mobile clicks), but suggests mobile SERP presentation is more attractive. Desktop has 93% of impressions but converts 0.1% of those. Possible signal: desktop impressions come from deeper positions (avg position worse on desktop?) or mobile queries are more branded/navigational. Worth monitoring.

### 5.6 Countries

| Country | Impressions | Clicks |
| ------- | ----------- | ------ |
| USA     | 578         | 3      |
| AUS     | 10          | 0      |
| ARE     | 4           | 0      |
| ARG     | 3           | 0      |
| BEL     | 3           | 0      |
| SAU     | 2           | 1      |

55% of impressions from USA. 1 click from Saudi Arabia is interesting (likely branded or highly specific query).

### 5.7 Sitemap status — DATA QUALITY FLAG

**Evidence:** Sitemaps API returned:

```
https://alexmayhew.dev/sitemap.xml
  lastSubmitted: 2026-04-09T22:03:47Z
  lastDownloaded: 2026-04-09T22:03:48Z
  isPending: false | errors: 0 | warnings: 0
  web: submitted=125, indexed=0
  image: submitted=74, indexed=0
```

- **[LOW]** The Sitemaps API has long reported `indexed=0` as a known-broken field for sitemap-level reporting in Search Console v3. The field was not populated reliably for years and is effectively deprecated. Do not use this as the indexed-count source.
- **Correct source for indexed-count:** Coverage Report in GSC UI (Pages section) or per-URL inspection (`urlInspection.index.inspect`). Sampled inspection below.
- Sitemap itself is healthy: 0 errors, 0 warnings, last downloaded 8 days ago.

### 5.8 URL Inspection results (sampled 2026-04-17)

| URL                                      | Verdict | Coverage                        | Last Crawl |
| ---------------------------------------- | ------- | ------------------------------- | ---------- |
| /                                        | PASS    | Submitted and indexed           | 2026-04-14 |
| /blog/typescript-business-case           | PASS    | Submitted and indexed           | 2026-04-02 |
| /blog/llm-cost-optimization-scale        | PASS    | Submitted and indexed           | 2026-04-16 |
| /for                                     | PASS    | Submitted and indexed           | 2026-04-12 |
| /blog/saas-billing-stripe-architecture   | NEUTRAL | URL is unknown to Google        | never      |
| /services/technical-advisor-for-startups | NEUTRAL | Crawled - currently not indexed | 2026-03-15 |
| /tools/saas-readiness                    | NEUTRAL | URL is unknown to Google        | never      |
| /contact                                 | NEUTRAL | URL is unknown to Google        | never      |

4/8 sampled URLs indexed. Two (quiz, contact) never discovered. One (technical-advisor-for-startups) crawled but rejected. One major blog post (saas-billing-stripe-architecture) not known on non-www canonical.

**[CRITICAL]** Quiz needs internal links and an IndexNow ping. Currently no path from the site's main pages to `/tools/saas-readiness` means Google has nowhere to discover it.

---

## 6. Cross-Domain Tracking (Gumroad)

**Evidence:**

- `shop.alexmayhew.dev` is a CNAME to `domains.gumroad.com` (per MEMORY.md, DNS only, not proxied).
- Codebase search for `shop.alexmayhew` or `gumroad` found zero references in TypeScript/JS source. Only appears in research docs (`docs/research/lead-magnets-gated-content-2026.md`) and plans.
- GA4 config has no `gtag('config', ..., { linker: { domains: [...] } })` call.

**[HIGH] No cross-domain tracking configured.**

- Impact: Any user clicking from alexmayhew.dev → shop.alexmayhew.dev gets a new `client_id` and appears as a new session. All attribution for Gumroad purchases is lost.
- Fix: When the shop is active, add `linker: { domains: ['shop.alexmayhew.dev'], accept_incoming: true }` to the `gtag('config', ...)` call in `google-analytics.tsx:32`. Also configure Gumroad's GA4 integration on their side (they support GA4 measurement ID passthrough).

---

## 7. Privacy, Consent, CSP

### 7.1 Privacy Policy — PASS

`src/app/privacy/page.tsx` exists; verified link from cookie consent banner at `cookie-consent.tsx:119`.

### 7.2 Cookie Consent Banner — PASS with one gap

- `src/components/ui/cookie-consent.tsx:46-57` fetches `/api/geo` to check if user is in EU/GDPR region; only shows banner there.
- `src/components/ui/cookie-consent.tsx:73-78` calls `gtag('consent', 'update', { analytics_storage: 'granted' })` on accept.
- **[LOW]** Cookie consent only updates `analytics_storage` — not `ad_user_data` or `ad_personalization`. If ever monetizing or running paid campaigns that rely on ad personalization signals, the consent flow will need to expand.
- **[LOW]** The `conversion_linker: true` config combined with default-denied `ad_storage` means URL linker params will NOT be written by default — fine for now since there are no paid ads, but worth noting if that changes.

### 7.3 CSP — PASS

Verified from live response headers (curl -sI https://alexmayhew.dev/):

```
script-src 'self' 'unsafe-inline'
  https://static.cloudflareinsights.com
  https://challenges.cloudflare.com
  https://*.googletagmanager.com
connect-src 'self'
  https://cloudflareinsights.com
  https://challenges.cloudflare.com
  https://*.ingest.sentry.io
  https://*.ingest.us.sentry.io
  https://*.google-analytics.com
  https://*.analytics.google.com
  ...
```

All required analytics/Sentry origins whitelisted. `middleware.ts:9-22` is the source of truth.

---

## 8. Consolidated Findings

### CRITICAL (3)

1. **SaaS Scaling Quiz has zero instrumentation** — file `src/components/tools/saas-readiness-quiz.tsx` has no analytics imports, no events for start/answer/complete/CTA. The entire lead-magnet funnel is invisible.
2. **Quiz page `/tools/saas-readiness` not crawled by Google** — URL Inspection returns `URL is unknown to Google, lastCrawl=never`. Missing internal links from high-authority pages (homepage, /tools, blog article CTAs).
3. **Quiz has no email capture** — Lead magnet loses the user at the point of peak intent (after they see results). The CTA goes to `/contact` instead of capturing email directly.

### HIGH (6)

4. **Contact form `generate_lead` event discards form values** — `trackLeadEvent` at `contact-page.tsx:93-100` hardcodes `project_type: "unknown"`, `budget_range: "unknown"`, `referral_source: "not_specified"`. Actual form values never read. Loses most valuable lead segmentation data.
5. **Server-side Sentry disabled** — `src/instrumentation.ts` is a no-op. Contact form / newsletter / Turnstile errors only go to console.error. No alerting on production failures. `@sentry/cloudflare` is installed but not wired.
6. **No Gumroad cross-domain tracking** — `shop.alexmayhew.dev` has no GA4 linker config. When shop goes live, attribution for purchase funnel will be lost.
7. **Blog post `/blog/saas-billing-stripe-architecture` not indexed on non-www** — 104 impressions on www version, but non-www is `URL unknown to Google`. Per-URL redirect propagation issue requiring manual URL Inspection + request-indexing from GSC UI.
8. **Service page `/services/technical-advisor-for-startups` crawled but not indexed** — signals low content authority or duplicate-content detection; the site's most commercially important service page.
9. **No form abandonment tracking** — `form_start` fires but no `form_abandon` on navigation away. Cannot calculate form completion rate accurately.

### MEDIUM (5)

10. **Custom dimensions may not be registered in GA4 Admin** — `page_category`, `content_type`, `user_type` sent as event params at `page-analytics.tsx:41-43` but registration in GA4 Admin > Custom Definitions is unverified. Without registration, these are unqueryable in reports.
11. **No GA4 user_properties set** — `user_type` and traffic source category are per-event only. Cannot segment audiences or build returning-visitor cohorts.
12. **Custom `campaign_*` event params duplicate native UTM attribution** — GA4 handles UTMs natively via `traffic_source`. The custom `campaign_source/medium/name/content/term` params at `page-analytics.tsx:35-39` create redundant data that won't appear in standard acquisition reports.
13. **Sentry session replay does not mask inputs** — `maskAllText: false, blockAllMedia: false` at `sentry.client.config.ts:44-46`. Contact form submissions can be replayed with plaintext PII.
14. **Chat widget has no interaction tracking** — `ChatWidget` (layout.tsx:30) loads but no events for open/close/message-sent are visible in the codebase grep.

### LOW (5)

15. **Consent banner only updates `analytics_storage`** — not `ad_user_data` / `ad_personalization`. Not currently needed (no ads) but a gap when expanding.
16. **No `file_download` event tracking** — RSS (`/feed.xml`), `/llms.txt`, any future PDFs are untracked.
17. **No outbound link tracking** — LinkedIn, X, GitHub exit events not captured.
18. **Sitemap "indexed" field deprecated** — `web: submitted=125, indexed=0` is a known-broken API field. Do not use as indexed-count source. Use URL Inspection instead.
19. **Inline consent bootstrap script is fragile** — `layout.tsx:150-154` is a single long line of stringified JS. Any future edit risks breaking consent behavior silently.

---

## 9. Prioritized Recommendations

**Quick wins (high leverage, low cost):**

1. **Instrument the quiz** (CRITICAL #1). Add ~8 `trackEvent` calls to `saas-readiness-quiz.tsx`. Enables full funnel analytics for the new lead magnet.
2. **Fix contact form lead_event** (HIGH #4). Pass `projectType`, `budget`, `referralSource` from form state into `trackLeadEvent`. 3-line change.
3. **Link quiz from homepage and /tools hub** (CRITICAL #2). Add 2-3 internal links. Request indexing via GSC URL Inspection tool.
4. **Re-enable server Sentry via @sentry/cloudflare** (HIGH #5). `docs/DEFERRED_AUDIT_ITEMS.md` has the plan. Package already installed.

**Medium term (measurement strategy):**

5. **Register custom dimensions in GA4 Admin** (MEDIUM #10). 5-minute console task. Unlocks the custom reports already being populated.
6. **Add `gtag('set', 'user_properties', ...)` for session-scoped traits** (MEDIUM #11). Enables audience building.
7. **Mask contact form inputs in Sentry replay** (MEDIUM #13). One-line config change.
8. **Add email capture to quiz results** (CRITICAL #3). Product decision — hand to copywriter/blog-writer for copy. Reuse `NewsletterSignup` component with `source="quiz-results"`.
9. **Form abandonment tracking** (HIGH #9). Set a `sendBeacon` on `visibilitychange` if form started but not submitted.

**Long term (once Gumroad shop activates):**

10. **Cross-domain linker + Gumroad GA4 integration** (HIGH #6). Needed before any shop revenue.

**Operational:**

- Monitor www → non-www propagation weekly via top-25 pages query. Expect www impressions to fall below non-www by mid-May 2026.
- Re-inspect `/blog/saas-billing-stripe-architecture` (non-www) and request indexing manually via GSC UI.
- Investigate why `/services/technical-advisor-for-startups` was crawled but not indexed — check for duplicate content across pSEO variants, thin content, or parameter issues.

---

## 10. Data Sources & Reproducibility

**GSC API queries (reproducible):**

```js
// Setup
const key = JSON.parse(fs.readFileSync("/tmp/gsc-sa.json"));
const auth = new google.auth.JWT({
	email: key.client_email,
	key: key.private_key,
	scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});
const webmasters = google.webmasters({ version: "v3", auth });
const siteUrl = "sc-domain:alexmayhew.dev";

// 90-day query with dimensions:['query'] or ['page'] or ['country'] or ['device']
// Service account json: pass show claude/google/gsc-service-account-json
```

**Data retrieved 2026-04-17 01:51 UTC.**

**Live site verification:**

- `curl -sI https://alexmayhew.dev/` — confirmed CSP headers + tag presence.
- `curl -s https://alexmayhew.dev/ | grep -oE "(G-K4TLSRKMCV|cloudflareinsights|gtag)"` — confirmed GA4 tag, CF beacon, and gtag all present.

**Code references** use `file:line` format. Paths relative to `/home/deploy/projects/amdev/alexmayhew-dev/`.
