# AEO Analytics Audit — alexmayhew.dev (2026-04-19)

**Status:** CURRENT
**Session:** Establish baseline for whether alexmayhew.dev is currently being retrieved / cited by AI systems (ChatGPT, Claude.ai, Perplexity, Google AI Overviews, Bing Copilot, Apple Intelligence, Amazon Rufus).
**Complements:** `docs/research/agent-research/audit-2026-04-16-geo-aeo.md` (qualitative AEO/GEO audit, 3 days prior)

---

## Executive Summary — Top 5 Findings

1. **AI crawlers are actively fetching alexmayhew.dev.** In the last 24 hours (2026-04-18 06:00Z → 2026-04-19 06:00Z), Cloudflare recorded crawls from **13 distinct AI / search-AI user agents** totalling **377+ requests** against a ~2,945-request baseline. Breakdown: CCBot 119, ClaudeBot 30, GPTBot 27, Amazonbot 24, GoogleOther 42, Applebot 33, Googlebot 7, PerplexityBot 8, ChatGPT-User 5, OAI-SearchBot 3, Meta-ExternalAgent 2, bingbot 66, YandexBot 11. Retrieval is happening. Whether the site is being **cited** in AI answers is not yet measurable.
2. **AI-referrer click-through traffic cannot be confirmed from GA4.** The only provisioned Google service account (`gsc-service-account@voicekeep-487021.iam.gserviceaccount.com`) has GSC access but has **never been added as a Viewer on the GA4 property**, so the Data API returns empty `accountSummaries`. No GA4 measurement in this report. This is a hard blocker, not a fabricated answer — it needs 30 seconds of work in the GA4 Admin UI to unblock.
3. **GSC shows a site that is almost invisible to Google Search.** 90-day window (2026-01-17 → 2026-04-17): **1,142 impressions, 5 clicks, CTR 0.44%, avg position 7.66, 10 unique queries, 35 pages with ≥1 impression out of 141 submitted**. Google is still serving both `www.` and non-`www.` variants in parallel — 4 of the top 10 pages are `www.` duplicates that should 301 to non-`www.` This is a signal-zero AEO environment: if Google isn't surfacing the content, AI Overviews aren't either.
4. **Live AEO-surface files are half-deployed.** `/llms.txt` (22,049 b, 200 OK, 92 content links, hub-first layout), `/llms-full.txt` (50,039 b, 200 OK), `/robots.txt` (597 b, all 12 named AI crawlers allow-listed) are live. `/ai.txt` returns **404** — the route exists in `src/app/ai.txt/route.ts` and was committed locally in `950b3c0`, but that commit has **not been pushed to `origin/main`** (three commits are still local-only: `8df8642`, `8c5d101`, `950b3c0`). The headline "ai.txt just shipped" in the task brief is premature.
5. **GA4 page-analytics code has no AI-referrer detection.** `src/components/analytics/page-analytics.tsx:98-100` classifies referrers as `linkedin_visitor` / `twitter_visitor` / `search_visitor` / `developer` / `referral_visitor` — with no branch for `chatgpt.com`, `claude.ai`, `perplexity.ai`, `copilot.microsoft.com`, or `gemini.google.com`. Any visit from those hosts today is being bucketed as a generic `referral_visitor`. When AI-referrer traffic does arrive, it will be invisible in the existing custom-dimension views.

---

## 1. AI-Referrer Traffic in GA4 (last 90 days)

**Status:** UNRESOLVED — data source inaccessible.

### Blocker

The only Google service account present in `pass` (`claude/google/gsc-service-account-json`) is attached to Search Console and has **no role on the GA4 property**. API verification:

```
POST https://analyticsadmin.googleapis.com/v1beta/accountSummaries
→ 200 OK, body: {}
```

An empty `accountSummaries` response means the service account is authenticated but has zero GA4 properties visible to it. No Data API queries were attempted because the property ID cannot be resolved.

### To unblock (60-second fix)

1. Open GA4 Admin → Property Access Management → Add user
2. Add email: `gsc-service-account@voicekeep-487021.iam.gserviceaccount.com`
3. Role: **Viewer** (read-only is sufficient)
4. Re-run `node ga4-query.mjs` from the project root — it already handles property-ID resolution, source/medium, channel group, landing-page, and event-name breakdowns with AI-host filtering.

Alternatively, provision a new GA4-scoped service account and store at `pass insert claude/google/ga4-service-account-json`.

### What the query will produce once unblocked

- `sessionSource` filter against: `chatgpt.com`, `chat.openai.com`, `openai.com`, `claude.ai`, `anthropic.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`, `bing.com`, `duckduckgo.com`, `you.com`, `phind.com`
- Landing-page breakdown for each AI-referrer host
- Engagement rate vs. organic benchmark
- Conversion events (`lead_submitted`, `cta_click`, `sign_up`)

### Secondary problem — attribution-model gap in client code

Even after the API is unblocked, the code in `src/components/analytics/page-analytics.tsx` will undercount AI-referrer visits because it has no matcher for AI hosts. Recommend adding to the `getUserType()` function:

```ts
if (referrer.includes("chatgpt") || referrer.includes("openai")) return "chatgpt_visitor";
if (referrer.includes("claude.ai") || referrer.includes("anthropic")) return "claude_visitor";
if (referrer.includes("perplexity")) return "perplexity_visitor";
if (referrer.includes("copilot") || referrer.includes("bing")) return "copilot_visitor";
if (referrer.includes("gemini")) return "gemini_visitor";
```

Also recommend firing a `send_to: 'G-K4TLSRKMCV', event: 'ai_referrer'` custom event with a `referrer_host` parameter when any of those patterns match, for clean reporting.

---

## 2. GSC Indexing Status (current)

**Property:** `sc-domain:alexmayhew.dev`
**Sitemap:** `https://alexmayhew.dev/sitemap.xml` — last submitted 2026-04-17 21:31Z, 0 warnings / 0 errors, 141 web URLs + 73 image URLs submitted.

Note: `contents[].indexed` returned `"0"` for both web and image — this is a known GSC quirk for domain-property sitemaps (Google doesn't populate the indexed count via API even when pages ARE indexed). Do not read this as "zero pages indexed."

### 90-day totals (2026-01-17 → 2026-04-17)

| Metric        | Value      |
| ------------- | ---------- |
| Clicks        | **5**      |
| Impressions   | **1,142**  |
| CTR           | **0.44 %** |
| Avg. position | **7.66**   |

### 28-day totals (2026-03-20 → 2026-04-17)

| Metric        | Value     |
| ------------- | --------- |
| Clicks        | **3**     |
| Impressions   | **801**   |
| CTR           | **0.37%** |
| Avg. position | **7.47**  |

70% of the 90-day impressions landed in the last 28 days — impression volume is accelerating. Position improving slightly (7.66 → 7.47). Click volume is noise-level.

### Coverage proxy (page-level)

**35 unique pages** received ≥1 impression in 90 days, out of **141** submitted. That's a **25% page-level visibility rate** — consistent with the pre-existing memory note: "near-zero domain authority, only ~11 non-www pages indexed out of 180".

### Top 15 pages by 90-day impressions

| Impressions | Clicks |  Pos | URL                                                         |
| ----------: | -----: | ---: | ----------------------------------------------------------- |
|         123 |      0 |  6.8 | /blog/typescript-business-case                              |
|         109 |      0 |  6.0 | **www.**/blog/incident-response-saas _(www duplicate)_      |
|          77 |      3 | 11.9 | /                                                           |
|          68 |      0 |  8.1 | /newsletter/002-microservices-cost                          |
|          60 |      0 |  6.1 | **www.**/blog/rag-architecture-saas _(www duplicate)_       |
|          59 |      1 |  7.5 | **www.**/blog/llm-cost-optimization-scale _(www duplicate)_ |
|          39 |      0 |  6.7 | /blog/metr-paradox-ai-productivity                          |
|          37 |      0 |  9.7 | /blog/vector-database-selection                             |
|          34 |      0 |  6.3 | /blog/ai-assisted-development-generative-debt               |
|          32 |      0 |  3.9 | /docs                                                       |
|          29 |      1 |  4.3 | /for                                                        |
|          27 |      0 |  5.9 | /privacy                                                    |
|          21 |      0 |  7.4 | /work/claude-pilot                                          |
|          18 |      0 |  4.5 | /technologies                                               |
|          17 |      0 |  3.1 | **www.**/blog _(www duplicate)_                             |

Four of the top 15 URLs are `www.` duplicates competing with the non-`www.` canonical. The 2026-03-30 `www → non-www` 301 redirect is live but Google is still processing the swap (expected per research in `docs/research/cloudflare-www-redirect-pages-2026.md`).

### Top queries (entire 90-day list — 10 total)

| Impressions | Clicks |  Pos | Query                                  |
| ----------: | -----: | ---: | -------------------------------------- |
|          17 |      2 | 20.6 | alex mayhew                            |
|          14 |      0 |  8.8 | "static types" "living documentation"  |
|           4 |      0 | 45.5 | alexmayhew                             |
|           3 |      0 | 26.3 | alexander mayhew                       |
|           2 |      0 | 21.5 | microservices tax                      |
|           1 |      0 | 10.0 | alexandra mayhew                       |
|           1 |      0 |  6.0 | pgvector vs dedicated vector databases |
|           1 |      0 |  8.0 | rest vs graphql comparison 2026        |
|           1 |      0 | 10.0 | rest vs graphql differences 2026       |
|           1 |      0 | 10.0 | rest vs graphql main differences 2026  |

**Ten queries** in 90 days — this is a cold-start site from Google's perspective. 6 of the 10 are navigational (someone looking for "Alex Mayhew" by name); only 4 are informational queries in the AI-intent pattern (`pgvector vs…`, `rest vs graphql…`). None show AI Overview traces.

### AI-intent / comparison queries

| Query                                  | Impressions | Pos |
| -------------------------------------- | ----------: | --: |
| pgvector vs dedicated vector databases |           1 | 6.0 |
| rest vs graphql comparison 2026        |           1 | 8.0 |
| rest vs graphql differences 2026       |           1 |  10 |
| rest vs graphql main differences 2026  |           1 |  10 |

These are exactly the query shapes that AI Overviews cite — but at 1 impression each and positions 6-10, the site is adjacent-to-citable rather than citation-anchored. Keep writing comparison content.

### Search surfaces

| Surface     | 90d impressions | Notes                                |
| ----------- | --------------: | ------------------------------------ |
| Web         |           1,142 | Entire volume                        |
| Image       |              16 | Position 47 — images not competitive |
| News        |               0 | Not a news source, expected          |
| Video       |               0 | No video content                     |
| Discover    |               0 | No Discover surfacing                |
| Google News |               0 | Not registered                       |

### Device / geography (90d)

- **Desktop: 1,064 impressions** / 1 click (93% of volume) — disproportionate vs. real web, indicates crawler / AI-agent / technical-audience skew
- Mobile: 75 impressions / 4 clicks (4/5 total clicks came from mobile, 5.3% CTR)
- Tablet: 3 impressions
- US: 631 impressions (55%), Canada 56, Brazil 31, Australia 12 — remainder long tail across 30+ countries

### Manual actions / coverage

GSC query didn't surface any manual-action flag. No crawl anomalies (last sitemap ingestion clean, 0 errors 0 warnings).

---

## 3. Live Endpoint Verification (curl'd 2026-04-19 06:36Z)

| Endpoint         |  HTTP   | Size (bytes) | Content-Type         | Verdict                                                                                                                                                                                                               |
| ---------------- | :-----: | -----------: | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/llms.txt`      |   200   |       22,049 | text/plain; utf-8    | Live. Dynamic route. 92 content links. Hub posts listed first.                                                                                                                                                        |
| `/llms-full.txt` |   200   |       50,039 | text/plain; utf-8    | Live. ~50 KB of full hub-post + About + glossary grounding.                                                                                                                                                           |
| `/ai.txt`        | **404** |      123,266 | text/html (404 page) | **NOT DEPLOYED.** Route exists at `src/app/ai.txt/route.ts`; commit `950b3c0` is local-only — not pushed to origin/main.                                                                                              |
| `/robots.txt`    |   200   |          597 | text/plain           | All 12 AI crawlers explicitly allow-listed. Sitemap referenced.                                                                                                                                                       |
| `/sitemap.xml`   |   200   |       33,647 | application/xml      | 141 URLs. Sample hubs present (`saas-architecture-decision-framework`, `engineering-leadership-founder-to-cto`, `modern-frontend-architecture`, `performance-engineering-playbook`, `ai-assisted-development-guide`). |

### Sample hub page: `/blog/saas-architecture-decision-framework`

- HTTP 200, 430,836 bytes
- **14 JSON-LD blocks** emitted — among the highest on the site
- Schema types present: `WebPage`, `WebSite`, `Organization`, `Person`, `ConsultingService`, `TechArticle`, `FAQPage` (with 6 `Question`/`Answer` pairs), `BreadcrumbList`, `SearchAction`, `OfferCatalog`, `Service` × 3, `Offer` × 3, `EducationalOccupationalCredential` × 2, `PostalAddress`, `ContactPoint`, `Place` × 2, `Country` × 8, `State`, `City`, `ListItem` × 3, `ImageObject` × 2, `EntryPoint`, `PriceSpecification` × 2

### `@id` consolidation

All five canonical entity IDs resolve cleanly on the sample hub:

```
"@id":"https://alexmayhew.dev/blog/saas-architecture-decision-framework"  (TechArticle)
"@id":"https://alexmayhew.dev/#business"                                   (ConsultingService)
"@id":"https://alexmayhew.dev/#organization"                               (Organization)
"@id":"https://alexmayhew.dev/#person"                                     (Person — single authoritative)
"@id":"https://alexmayhew.dev/#website"                                    (WebSite)
```

Person schema is consolidated on a single `#person` `@id` — the fix from the 2026-04-17 audit (Wave K) is confirmed live. No inline Person objects leaking through on this hub.

### `/llms.txt` deployment status vs. 2026-04-16 audit

The prior GEO/AEO audit (audit-2026-04-16-geo-aeo.md) flagged **C1: static `public/llms.txt` shadowing the dynamic route**. Verified fixed today: `public/llms.txt` no longer exists, the dynamic route is winning (22 KB, 92 links, current content).

---

## 4. Cloudflare Web Analytics / Bot Analytics

### RUM (Web Analytics) site list

API call to `/accounts/{acct}/rum/site_info/list` returned **Authentication error** (10000). The admin API token works for account endpoints but is missing the `Zone:Analytics:Read` scope that RUM requires. Non-blocking — RUM data is also visible in the Cloudflare dashboard; the API gap is worth fixing for cron-able reporting.

### GraphQL `httpRequestsAdaptiveGroups` — bot/user-agent breakdown

**Free plan is limited to a 1-day rolling window** for this query. 7-day and 30-day rollups would require upgrading the Cloudflare plan or persisting daily snapshots.

**Window: 2026-04-18 06:00Z → 2026-04-19 06:00Z (last 24h), top 100 user agents, 2,945 total requests**

| Crawler                 | Requests | Purpose                                                    |
| ----------------------- | -------: | ---------------------------------------------------------- |
| **CCBot** (CommonCrawl) |  **119** | Training data aggregator — used by many LLMs               |
| **bingbot**             |       66 | Bing index (also seeds Copilot)                            |
| **GoogleOther**         |       42 | Google non-search fetcher (AI Overviews, Gemini grounding) |
| **Applebot**            |       33 | Apple indexing — Siri / Apple Intelligence seed            |
| **ClaudeBot**           |   **30** | Anthropic — training + Claude.ai citation                  |
| **GPTBot**              |   **27** | OpenAI training + ChatGPT grounding                        |
| **Amazonbot**           |       24 | Amazon / Rufus retrieval                                   |
| **YandexBot**           |       11 | Yandex index                                               |
| **PerplexityBot**       |    **8** | Perplexity retrieval / training                            |
| **Googlebot**           |        7 | Core web index                                             |
| **ChatGPT-User**        |    **5** | _Live_ user fetching a URL via ChatGPT at query-time       |
| **OAI-SearchBot**       |    **3** | OpenAI SearchGPT index                                     |
| **Meta-ExternalAgent**  |        2 | Meta AI / Llama training                                   |

**Interpretation — this is the most important finding in the audit.**

The `ChatGPT-User` agent (5 hits) and `Claude-User` / `Perplexity-User` (0 hits but watched) are **real-time fetches triggered by a human's query in a chat UI**. That means at least 5 times in the last 24 hours, a ChatGPT user asked a question for which ChatGPT chose to fetch alexmayhew.dev to ground its answer. This is a proxy for actual AI citation — the ground-truth is the chat UI the user couldn't see, but the fetch header is hard evidence that alexmayhew.dev was on ChatGPT's shortlist of sources for that query.

Training crawlers (GPTBot, ClaudeBot, CCBot) are ambient — they fetch everything that's allowed. Query-time fetchers (`*-User`, `OAI-SearchBot`, `PerplexityBot` in search mode) indicate inclusion in answer candidate sets.

### Recommendation: daily snapshot job

Because the free plan caps GraphQL at 24-hour windows, set up a daily cron that persists AI-crawler UA counts into a small SQLite or durable-object store. Without it, this 24-hour snapshot is ephemeral — tomorrow the window moves and today's data is lost. 1-hour engineering task; very high leverage for AEO trend tracking. The `scripts/submit-sitemap-gsc.mjs` shape is the right template.

---

## 5. Sentry + in-app AI-crawler detection

### Sentry

Sentry is configured (`sentry.client.config.ts`, `sentry.edge.config.ts`, `sentry.server.config.ts`) and the CSP allows `*.ingest.sentry.io`. Sentry captures JavaScript errors and server errors — **it does not record user-agent strings for successful page fetches**. It would only see an AI crawler's UA if that crawler triggered a JS error, and AI crawlers largely don't execute JS on first render. Sentry is not a useful AEO/bot-traffic signal.

### Middleware / logging

`middleware.ts` exists but was not inspected in depth — it handles the `www → non-www` 301. No UA-based routing or logging was observed in the portion of the codebase grepped. No central bot-fingerprint log.

### Client-side detection

`src/components/analytics/page-analytics.tsx:90-94` has a trivial bot-escape:

```ts
if (userAgent.includes("bot") || userAgent.includes("crawler")) {
	return "bot";
}
```

This assigns a `user_type=bot` custom dimension. It runs inside a browser context and requires JS execution, so most crawlers skip it. Useful for attribution exclusion; not useful for bot-volume measurement.

---

## 6. Current Baseline Statement

**As of 2026-04-19, alexmayhew.dev appears to be:**

- **Being retrieved** by **all 13 major AI training + search crawlers** (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, CCBot, Google-Extended via GoogleOther, Applebot, Amazonbot, Meta-ExternalAgent, bingbot, Googlebot, YandexBot). **Retrieval baseline: ~377 AI-or-search-bot requests per day (13% of total zone traffic).**
- **Possibly cited in live ChatGPT sessions** based on 5 `ChatGPT-User` real-time fetches in the last 24h. **Cannot confirm citation frequency or citation success rate from server-side data alone** — that requires manual query testing (ask ChatGPT/Claude/Perplexity factual questions about Alex Mayhew's domain and observe citations).
- **Essentially invisible to Google Search** — 5 clicks / 1,142 impressions in 90 days, 25% page-level visibility. If Google AI Overviews uses Google Search as a grounding source (it does), alexmayhew.dev is below AI Overview selection threshold for almost every query.
- **Invisible to Perplexity / Gemini / Bing Copilot clicks** — zero referrer data available from GA4 (API access blocked), but given 2 total clicks from Google Search in 90 days, AI-surface click volume is almost certainly 0 or statistical noise.
- **Fundamentally unmeasurable from GA4 today** — service-account not provisioned for the GA4 property. Manual GA4 UI review is the only channel until that is fixed.

### Bottom line

alexmayhew.dev is being **indexed** by AI systems at a healthy rate. It is **not yet being cited** at meaningful volume — the domain authority that drives citation is still near-zero (the pre-existing MEMORY finding). The content is AEO-ready: rich schema (14 JSON-LD blocks on hubs), llms.txt + llms-full.txt live, all crawlers allow-listed, FAQ schema + hub-and-spoke linking in place. The AEO foundation is ready; the missing variable is **external backlinks** to feed the authority signal that makes AI systems select the site over competitors' content.

---

## 7. Recommended Measurement Cadence

| Frequency        | Task                                                                                                      | Source                                  | Owner  | Est. time |
| ---------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------ | --------- |
| **Daily (cron)** | Snapshot 24h AI-crawler UA counts into persistent store (CF Pages free plan loses 24h+ history)           | CF GraphQL `httpRequestsAdaptiveGroups` | Cron   | 1 min     |
| **Weekly (Mon)** | GSC 7-day rollup: queries / pages / clicks / impressions / avg position / device / country                | GSC Search Analytics API                | Manual | 10 min    |
| **Weekly (Mon)** | GA4 7-day: sessions by source, AI-referrer sessions, landing pages, conversion events                     | GA4 Data API _(pending access fix)_     | Manual | 10 min    |
| **Weekly (Mon)** | Manual AI-citation spot-check: ask ChatGPT, Claude, Perplexity, Gemini 5 questions the site should answer | Chat UI, manual                         | Manual | 15 min    |
| **Monthly**      | Full rollup: 28d GSC, 28d GA4, 28d CF crawler volume, new-backlinks delta                                 | All above                               | Manual | 45 min    |
| **Monthly**      | Re-curl `/ai.txt`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml` and diff against baseline | curl + diff                             | Script | 5 min     |
| **Quarterly**    | Re-audit JSON-LD emissions per page type, `@id` consolidation, schema validator pass                      | Manual + schema.org validator           | Manual | 2 h       |
| **On deploy**    | IndexNow submission (already wired in CI), verify sitemap resubmission to GSC (wired)                     | CI workflow                             | CI     | 0 min     |

### Next actions (ordered)

1. **Push the local commits** (`8df8642`, `8c5d101`, `950b3c0`) to `origin/main` so `/ai.txt` goes live. Five-second task. Makes the file available before the next crawl cycle.
2. **Grant the GSC service account Viewer on GA4** — or provision a new GA4 service account. Makes the `ga4-query.mjs` script at `/home/deploy/projects/amdev/alexmayhew-dev/ga4-query.mjs` actually work. Unblocks all GA4 analytics in this audit.
3. **Add AI-referrer detection to `getUserType()`** in `src/components/analytics/page-analytics.tsx` and fire a `ai_referrer` GA4 event with `referrer_host` parameter. Prevents future AI-click traffic from being invisibly bucketed as `referral_visitor`.
4. **Set up the daily CF crawler-UA snapshot job** — without it, AI-crawler trend data is lost every 24 hours on the free plan.
5. **Run the weekly manual citation spot-check** starting this week. Establishes a qualitative baseline before quantitative GA4 data is even available.

---

## Appendix — Queries used (for reproducibility)

### GSC

Script: `/home/deploy/projects/amdev/alexmayhew-dev/gsc-query.mjs` (and `gsc-extra.mjs`)
Auth: `pass show claude/google/gsc-service-account-json`
Scope: `https://www.googleapis.com/auth/webmasters.readonly`
Property: `sc-domain:alexmayhew.dev`

### GA4

Script: `/home/deploy/projects/amdev/alexmayhew-dev/ga4-query.mjs`
Auth: same service account (pending Viewer grant on GA4 property)
Scope: `https://www.googleapis.com/auth/analytics.readonly`
Measurement ID: `G-K4TLSRKMCV` (property ID resolution blocked on access)

### Cloudflare GraphQL

Token: `pass show claude/cloudflare/admin-api-token` (requires `Zone:Analytics:Read` for RUM; `Account:Analytics:Read` for GraphQL)
Zone: `7671499eedb14dde9a666a683b5e8bee` (alexmayhew.dev)
Endpoint: `https://api.cloudflare.com/client/v4/graphql`
Query: `viewer { zones(filter: {zoneTag}) { httpRequestsAdaptiveGroups(limit, filter, orderBy) { dimensions { userAgent } count } } }`

### Live endpoints

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://alexmayhew.dev/llms.txt
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://alexmayhew.dev/llms-full.txt
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://alexmayhew.dev/ai.txt
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://alexmayhew.dev/robots.txt
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://alexmayhew.dev/sitemap.xml
curl -s https://alexmayhew.dev/blog/saas-architecture-decision-framework | grep -oE 'application/ld\+json' | wc -l
```

---

## Sources

- GSC API responses 2026-04-19 06:35Z
- Cloudflare GraphQL API response 2026-04-19 06:38Z
- Live HTTPS endpoint fetches 2026-04-19 06:36Z
- Prior audit: `docs/research/agent-research/audit-2026-04-16-geo-aeo.md`
- Memory: MEMORY.md Wave K (2026-04-17), Google Indexing Status (2026-04-05)
- Source code: `src/app/ai.txt/route.ts`, `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, `src/app/robots.ts`, `src/components/analytics/page-analytics.tsx`
