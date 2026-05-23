# Generative Debt — Site-Fit Analysis (alexmayhew.dev, 2026-04-28)

**Status:** CURRENT
**Question:** Does alexmayhew.dev have the authority profile and audience overlap to rank for / be cited on a coined term "generative debt" if a definitive hub were published 2026-05-01?
**Data sources:** GSC API (90d window 2026-01-26 → 2026-04-26), Cloudflare GraphQL bot analytics (last 24h), site content inventory, blog-index.json. GA4 Data API remains blocked — service-account access never granted (see `memory/project_ga4_access_blocker.md`); GA4 audience data is therefore unavailable for this analysis. The behavioral signals below come from server-side data only.
**Reproducibility:** `node /home/deploy/projects/amdev/alexmayhew-dev/gsc-query.mjs`, `node /home/deploy/projects/amdev/alexmayhew-dev/gsc-extra.mjs`. Cloudflare query in `memory/reference_cloudflare_bot_analytics.md` (use Global API Key auth — admin-api-token returns 10000).

---

## TL;DR — SITE-FIT SCORE: **3 / 10**

**Plain-language verdict:** Publishing the "generative debt" hub on this domain on 2026-05-01 will _not_ rank in Google for the coined term within the 90-day window — the authority floor is too low and the term is too new for the indexer to associate it with this site. **However**, the site shows real evidence of being selected as a _grounding source for ChatGPT's live answers on adjacent debt/cognitive-load queries_ (ChatGPT-User just fetched `/blog/cognitive-debt-ai-teams` and `/blog/metr-paradox-ai-productivity` in the last 24h). That AI-citation upside is the only realistic ROI path before backlinks compound. **If the goal is Google rankings, defer.** If the goal is AI citation primacy on a term you coin, the case is conditional but defensible — see Section 7.

### Why a 3 (and not a 1 or a 7)

- Google authority is near-zero: 13 unique queries in 90 days, 5 clicks, 38 pages with ≥1 impression out of 141 submitted. **Zero queries currently rank in Pos 1-3** outside of branded ("alex mayhew") terms. (-) New coined terms cannot be ranked into existence on a domain with this profile.
- The exact slug `/blog/ai-assisted-development-generative-debt` already exists, has 37 impressions / 0 clicks / pos 6.2 over 90d, and **has not earned a single attributable query** — GSC won't even surface what searchers typed to find it. (--) The term as currently used isn't generating dedicated query volume.
- The site has **17 AI-debt-adjacent posts** including a hub, all published 2026-01-15 → 2026-03-15. Three months in, none rank above pos 4 for any informational query. (-) Topical clustering alone has not moved the needle.
- ChatGPT-User issued **32 real-time fetches in 24h** (vs 5 ten days ago — a 6.4× increase). Three of those hit AI-debt-themed pages directly. (++) AI surfaces appear to be selecting this domain as candidate context on adjacent queries; the site is on a citation trajectory even though Google rankings aren't moving.
- Recent AI-content trend is up: `/blog/incident-response-saas` 28d/d 0.79 vs 7d/d 3.14 (4×), `/blog/rag-architecture-saas` 7d/d 5.85 vs 90d/d 0.62 (9.4×). (+) Some content is gaining momentum — but at impression scales of 22-41, this is still vanity territory.
- The 28-day pattern is **flat impressions, zero meaningful click conversion** (3 clicks / 857 impressions = 0.35% CTR vs ~2% benchmark for B2B SaaS). (-) Even when impressions tick up, clicks don't follow — telling Google nothing useful for ranking.

A score of 3 captures: "the foundation is there, but the prerequisite work (backlinks, time) hasn't been done. Coining a term on this domain right now is the wrong instrument — pieces that ride existing demand are."

---

## 1. AI / Code / Debt Vocabulary in GSC (last 90d, 2026-01-26 → 2026-04-26)

**Method:** Pulled all 13 queries with ≥1 impression. Tagged against keyword buckets: AI, coding, debt, vibe-coding, code-quality, productivity, AI-assisted-dev. Results below.

### Full query corpus tagged

| Query                                                                                  | Impressions | Clicks |  Pos | Vocab buckets         |
| -------------------------------------------------------------------------------------- | ----------: | -----: | ---: | --------------------- |
| alex mayhew                                                                            |          22 |      2 | 18.4 | (branded — none)      |
| "static types" "living documentation"                                                  |          15 |      0 |  8.5 | (none — typing/docs)  |
| alexmayhew                                                                             |           4 |      0 | 45.5 | (branded)             |
| alexander mayhew                                                                       |           3 |      0 | 26.3 | (branded)             |
| microservices tax                                                                      |           2 |      0 | 21.5 | (none — architecture) |
| pgvector vs dedicated vector databases                                                 |           2 |      0 | 37.0 | (none — db)           |
| rag pipeline for saas providers                                                        |           2 |      0 | 14.5 | (none — RAG)          |
| "types as living documentation" static typing                                          |           1 |      0 |  2.0 | (none)                |
| alexandra mayhew                                                                       |           1 |      0 | 10.0 | (branded)             |
| rest vs graphql comparison 2026                                                        |           1 |      0 |  8.0 | (none — API)          |
| rest vs graphql differences 2026                                                       |           1 |      0 | 10.0 | (none)                |
| rest vs graphql main differences 2026                                                  |           1 |      0 | 10.0 | (none)                |
| saas subscription billing architecture best practices stripe webhooks idempotency 2024 |           1 |      0 |  9.0 | (none — billing)      |

### Bucket aggregate

| Bucket                                                   | Queries | Impressions | Clicks |
| -------------------------------------------------------- | ------: | ----------: | -----: |
| AI / LLM / GPT / Claude / generative                     |   **0** |       **0** |  **0** |
| Coding / code / programmer                               |   **0** |       **0** |  **0** |
| Debt / technical-debt / cognitive-debt / generative-debt |   **0** |       **0** |  **0** |
| Vibe coding / vibe-code                                  |   **0** |       **0** |  **0** |
| Code quality / refactor / legacy                         |   **0** |       **0** |  **0** |
| Productivity / METR / paradox                            |   **0** |       **0** |  **0** |
| AI-assisted dev / Cursor / Copilot                       |   **0** |       **0** |  **0** |

**This is the headline GSC finding: zero queries containing AI/LLM/coding/debt vocabulary have driven a single impression to alexmayhew.dev in 90 days.** Google has 17 AI-themed posts indexed and serving impressions — but it isn't matching them to AI-themed search intent. The pages that _do_ get impressions (`typescript-business-case`, `incident-response-saas`, `rag-architecture-saas`, `vector-database-selection`) get them from queries Google won't fully reveal (anonymized below the disclosure threshold) plus a handful of architecture/comparison terms.

**Implication for a "generative debt" hub:** there is no demand signal in current GSC data showing this site's audience searches in the generative-debt vocabulary space _on Google_. That doesn't mean no one searches for it — it means **Google has not associated this domain with that vocabulary yet** and isn't even serving it as a long-tail match. Before Google will rank a coined term, it must rank related terms. We rank none.

---

## 2. Page-Level Performance — AI Content Specifically

### Top 25 pages, 90d (impressions)

| Impr | Clicks |  Pos | URL                                                   |
| ---: | -----: | ---: | ----------------------------------------------------- |
|  139 |      0 |  6.6 | /blog/typescript-business-case                        |
|   86 |      3 | 11.4 | / (homepage)                                          |
|   69 |      0 |  8.1 | /newsletter/002-microservices-cost                    |
|   62 |      0 | 10.4 | /blog/vector-database-selection                       |
|   60 |      1 |  7.5 | www./blog/llm-cost-optimization-scale (www duplicate) |
|   56 |      0 |  8.5 | /blog/rag-architecture-saas                           |
|   47 |      0 |  6.7 | **/blog/metr-paradox-ai-productivity**                |
|   37 |      0 |  6.2 | **/blog/ai-assisted-development-generative-debt**     |
|   35 |      0 |  4.0 | /docs                                                 |
|   32 |      1 |  4.4 | /for                                                  |
|   31 |      0 |  6.5 | **/blog/senior-developer-paradox**                    |
|   30 |      0 |  5.9 | /privacy                                              |
|   28 |      0 |  5.8 | /blog/incident-response-saas                          |
|   22 |      0 |  4.2 | /technologies                                         |
|   22 |      0 |  4.9 | /blog                                                 |
|   21 |      0 |  7.4 | /work/claude-pilot                                    |
|   12 |      0 |  2.9 | www./ (www duplicate)                                 |
|    8 |      0 |  4.9 | /for/technical-founder                                |
|    7 |      0 |  6.1 | /blog/500k-architecture-mistake                       |
|    7 |      0 |  5.1 | /services/technical-advisor-for-startups              |
|    5 |      0 | 10.2 | http:/ (HTTP duplicate)                               |
|    3 |      0 |  7.0 | /blog/llm-cost-optimization-scale                     |
|    3 |      0 | 19.0 | http://www./ (HTTP+www duplicate)                     |
|    2 |      0 |  6.0 | /technologies/postgresql                              |
|    1 |      0 |  5.0 | /blog/saas-billing-stripe-architecture                |

### AI-content pages (90d) — bold = AI/debt theme

| Impr | Clicks |  Pos | URL                                           | Theme                        |
| ---: | -----: | ---: | --------------------------------------------- | ---------------------------- |
|   47 |      0 |  6.7 | /blog/metr-paradox-ai-productivity            | AI productivity              |
|   37 |      0 |  6.2 | /blog/ai-assisted-development-generative-debt | **generative debt — canary** |
|   31 |      0 |  6.5 | /blog/senior-developer-paradox                | AI / cognitive               |
|   56 |      0 |  8.5 | /blog/rag-architecture-saas                   | RAG infra                    |
|   60 |      1 |  7.5 | /blog/llm-cost-optimization-scale (www)       | LLM cost                     |
|   62 |      0 | 10.4 | /blog/vector-database-selection               | Vector DBs                   |

**The "generative debt" canary already exists.** Slug: `/blog/ai-assisted-development-generative-debt`, published 2026-01-15 (~3.5 months old). 37 impressions, 0 clicks, pos 6.2, **zero attributable queries in GSC** (queries below GSC's anonymization threshold). It performs almost identically to its peer `metr-paradox-ai-productivity` (47 imp / 0 clicks / pos 6.7) — which is to say, it doesn't perform.

### AI-content trend: 28d/day vs 90d/day (impression rate)

| URL                                           | 28d/day | 90d/day |                           Δ |
| --------------------------------------------- | ------: | ------: | --------------------------: |
| /blog/ai-assisted-development-generative-debt |    0.11 |    0.41 |          **−74%** (cooling) |
| /blog/metr-paradox-ai-productivity            |    1.07 |    0.52 |         **+106%** (warming) |
| /blog/senior-developer-paradox                |    1.11 |    0.34 | **+222%** (warming sharply) |
| /blog/rag-architecture-saas                   |    2.00 |    0.62 |                       +220% |
| /blog/vector-database-selection               |    0.79 |    0.69 |                        +14% |

**Interpretation:** The generative-debt canary is _losing_ impressions in the recent window — Google's interest in it is declining, not building. Meanwhile two other AI/cognitive-themed pages (METR paradox, senior-developer paradox) are growing fast in impression rate. **The audience signal for "AI debt / cognitive overhead / productivity paradox" is genuine and rising on this domain — just not on the slug currently named `generative-debt`.**

That asymmetry is significant. It suggests the _concept space_ has demand on this site, but the _current term naming_ does not. A new hub published as "generative debt" would have to overcome the same headwind that the canary post hit.

### Position trends

The AI/debt cluster is averaging position 6-8 across 5+ posts. **None has crossed into Pos 1-3** in 90 days. Pos 6-8 means Google considers the content adjacent-to-relevant but not authoritative — exactly the zone where AI Overviews and AI grounding occasionally pluck citations but humans rarely click.

---

## 3. Authority Proxy — Position Distribution

| Position range                        |                                                         Queries (90d) |
| ------------------------------------- | --------------------------------------------------------------------: |
| Pos 1-3                               | **1** (`"types as living documentation" static typing`, 1 impression) |
| Pos 4-10                              |                                                                 **5** |
| Pos 11-20                             |                                                                 **2** |
| Pos 21-30                             |                                                                 **1** |
| Pos 31-50                             |                                                                 **2** |
| Pos 51-100                            |                                                                 **1** |
| Pos 100+                              |                                                                 **1** |
| **Total queries with any impression** |                                                                **13** |

**This is a domain-authority red flag.** A site that earns 1 ranking in the top 3 across 90 days, on a single 1-impression long-tail query, has functionally zero accumulated authority. By comparison, the BLOG_QUALITY_CHECKLIST benchmark for a healthy mid-tier B2B site is ≥50 top-30 rankings within 6 months of consistent publishing. We have **9 top-30 rankings**, and only on near-branded or hyper-specific quoted queries.

**No coined term will rank on this domain in 90 days regardless of content quality.** The Google indexer needs to see that the domain is authoritative on the _adjacent_ terms first (`technical debt`, `AI coding productivity`, `code quality`, `software engineering productivity paradox`) — and we don't rank for any of those. Rankings are downstream of links and time; we have neither.

### What would need to be true for Google ranking

A coined term ranks when (a) the domain that publishes it has authority to anchor it, OR (b) other authoritative sources cite the domain using that term. Neither holds today. For Google to rank "generative debt" on this domain in 90 days, the term would need to be picked up by Stack Overflow / Hacker News / a Y Combinator post / a high-DR newsletter (Lenny's, Pragmatic Engineer, etc.) within 30-60 days of publication. That requires distribution work _outside_ the publishing decision.

---

## 4. AI Crawler Signals — Last 24h (Cloudflare GraphQL, 2026-04-27 → 2026-04-28)

**Method:** `httpRequestsAdaptiveGroups` filter on AI-crawler user agents, free-plan caps the window at 24h. Total zone requests: 3,094. AI-bot requests: **302 (9.8%)**.

### AI bot totals (24h)

| Bot                  |   Hits | Type                                                                                                    |
| -------------------- | -----: | ------------------------------------------------------------------------------------------------------- |
| Applebot             |     91 | Index (Apple/Siri/Apple Intelligence seed)                                                              |
| bingbot              |     48 | Index (also seeds Copilot)                                                                              |
| **ChatGPT-User**     | **32** | **Real-time fetch — human asked ChatGPT a question and ChatGPT chose this domain to ground the answer** |
| Googlebot            |     25 | Core web index                                                                                          |
| ClaudeBot            |     20 | Anthropic training + Claude.ai grounding                                                                |
| Amazonbot            |     17 | Amazon / Rufus retrieval                                                                                |
| Bytespider           |     17 | ByteDance / TikTok / Doubao                                                                             |
| YandexBot            |     11 | Yandex index                                                                                            |
| **OAI-SearchBot**    |  **9** | **OpenAI SearchGPT index**                                                                              |
| Meta-ExternalAgent   |  7 + 3 | Meta AI / Llama training                                                                                |
| **Claude-SearchBot** |  **5** | **Anthropic search index (Claude.ai retrieval pool)**                                                   |
| GPTBot               |      5 | OpenAI training                                                                                         |
| **Perplexity-User**  |  **4** | **Real-time fetch — human asked Perplexity, it grounded with this domain**                              |
| CCBot                |      4 | CommonCrawl (training pool)                                                                             |
| GoogleOther          |      3 | Google AI Overviews / Gemini grounding                                                                  |
| PerplexityBot        |      1 | Perplexity training/index                                                                               |

### Compared to 9 days ago (2026-04-19 baseline in `aeo-analytics-audit-2026-04-19.md`)

| Bot              | 2026-04-19 | 2026-04-28 |         Δ |
| ---------------- | ---------: | ---------: | --------: |
| ChatGPT-User     |          5 |         32 | **+540%** |
| OAI-SearchBot    |          3 |          9 |     +200% |
| Claude-SearchBot |          0 |          5 |       new |
| Perplexity-User  |          0 |          4 |       new |
| ClaudeBot        |         30 |         20 |      -33% |
| GPTBot           |         27 |          5 |      -81% |
| CCBot            |        119 |          4 |      -97% |

**Interpretation — this is the most important data point in the entire analysis.**

- **Training crawlers (GPTBot, CCBot, ClaudeBot) have wound down.** They already harvested the site for the spring 2026 model snapshots. They'll re-fetch on a cadence; not a current-state signal.
- **Query-time fetchers have surged.** ChatGPT-User went from 5 to 32 in 9 days. Claude-SearchBot and Perplexity-User went from zero to active. OAI-SearchBot tripled. _This is the ground-truth signal for AI citation candidacy._ When a user asks ChatGPT a coding/debt-themed question, ChatGPT is now reaching out to alexmayhew.dev to ground the answer 32 times a day.

### Path-level: which pages are ChatGPT and Claude fetching?

ChatGPT-User (24h, top paths):

|  Hits | Path                                               |
| ----: | -------------------------------------------------- |
|     9 | /                                                  |
|     3 | /blog/metr-paradox-ai-productivity                 |
|     3 | /services/comparisons/stripe-vs-adyen-for-fintech  |
|     2 | /blog/documentation-engineers-read                 |
|     2 | /services/integrations/shopify-klaviyo-integration |
|     2 | /blog/state-management-2026                        |
| **1** | **/blog/cognitive-debt-ai-teams**                  |
|     1 | /services/nextjs-developer-for-healthcare          |

ClaudeBot (24h): all hits are infrastructure crawls (`/sitemap.xml`, `/robots.txt`, `/.git/refs/heads/main`, `/.env.development` reconnaissance probes — those last two are 404, no exposure). Claude is indexing the site map but not (yet) selecting individual posts for grounding. Claude-SearchBot did probe `/api/v2/` and `/fetch` — looks like it's testing endpoint shape.

Perplexity-User: zero path detail in this window (only 4 hits across the whole zone), but the agent is now active.

**The cognitive-debt-ai-teams hit is the smoking gun.** Within the last 24 hours, a real human asked ChatGPT a question whose answer ChatGPT decided needed grounding from this site's "cognitive debt" content. That is exactly the territory adjacent to "generative debt." If a single user prompt triggered that, more will. The METR paradox post got three such fetches.

**This is the upside case for publishing on this domain — not Google rankings, but candidate-set membership in AI grounding for the cognitive-overhead / AI-productivity-debt cluster.**

---

## 5. GA4 Audience Signal — UNAVAILABLE

GA4 Data API access is blocked. The service-account `gsc-service-account@voicekeep-487021.iam.gserviceaccount.com` has Search Console access but was never added as Viewer on the GA4 property `G-K4TLSRKMCV`. Verification: `accountSummaries` returns `{}`. Cannot resolve numeric property ID. See `memory/project_ga4_access_blocker.md` — a 60-second fix in GA4 Admin UI.

**What this means for site-fit analysis:** I cannot quantify bounce rate / engagement / time-on-page for AI-themed posts vs the site average from server-side data. The only audience proxies available are (a) GSC clicks (which are 5 in 90 days — useless), (b) inferred behavior from impression rates, and (c) the AI-crawler grounding signals in Section 4.

**Available proxy: clicks vs impressions on AI content.** Of 5 total clicks in 90d, 3 went to the homepage (probably name searches) and 1 each to `/for` and `www./blog/llm-cost-optimization-scale`. **Zero clicks have ever landed on an AI-debt post.** The AI/debt audience is not arriving from Google Search at all.

**Recommendation:** unblock GA4 before any major content investment. Without it, the only AI-traffic measurement is the Cloudflare bot crawl signal — which captures grounding fetches but not human visitors arriving from chatgpt.com / claude.ai / perplexity.ai links.

---

## 6. Realistic Outcome Forecast — "Generative Debt" Hub Published 2026-05-01

These are calibrated estimates given the 90-day GSC window, the AI-crawler trajectory, the topical-cluster authority of this domain, and the documented backlink absence from project memory.

### By 2026-08-01 (90 days post-publish)

| Outcome                                                                                          | Forecast                                                                                                                                                                                                                                                     | Confidence  |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Pos 1-10 for "generative debt"                                                                   | **No.** No domain ranks for a brand-new coined term in 90 days without external coverage. Ranking will be Pos 30-60 if it appears at all.                                                                                                                    | High        |
| Pos 1-10 for "vibe coding"                                                                       | **No.** Active competitive term coined by Karpathy in 2025; major outlets and influencers already own the SERP. We can't compete.                                                                                                                            | High        |
| Pos 1-10 for "AI technical debt"                                                                 | **Possible at pos 30-50.** Established term, more authoritative competition, but the post `ai-technical-debt-bomb` already exists and isn't ranking — repeating won't help.                                                                                  | Medium      |
| Total impressions to the new hub                                                                 | **30-90** in 90 days. Comparable to current AI-debt posts. The slug `ai-assisted-development-generative-debt` got 37 impressions over its first 90 days.                                                                                                     | Medium-high |
| Total clicks to the new hub                                                                      | **0-2.** AI-debt posts on this site have a 0% click rate from organic search. Zero clicks is the modal outcome.                                                                                                                                              | High        |
| Domain authority / GSC top-30 ranking count                                                      | Negligible movement. Will go from 9 top-30 rankings to 9-12.                                                                                                                                                                                                 | High        |
| AI citation pickup (ChatGPT, Claude, Perplexity grounding fetches)                               | **+10-30 per month** to the new hub specifically once it's in training/index pools. The current 32/day ChatGPT-User rate suggests grounding selection is happening on adjacent posts; a definitive piece on a coined term would inherit some of that volume. | Medium      |
| Probability of the term being adopted by 1+ external source (HN front page, newsletter, podcast) | **15-25% if distribution work is done**, **<3% if relying on organic**                                                                                                                                                                                       | Medium      |

### Conditions that would change the forecast upward

1. **Karpedi-style endorsement**: a high-DR voice (Pragmatic Engineer / Lenny / Stratechery) cites the term within 30 days. Backlink + brand association would compress the timeline by 6-12 months. Probability without active outreach: <5%.
2. **HN front page**: gets the term in the canonical AI-discussion vocabulary. Unstable for ranking but high for AI training corpus inclusion. Probability without strong hook: 5-10%.
3. **GA4 unblocking + AI-referrer dimension**: enables proving the AI-citation thesis with referral traffic from chatgpt.com, claude.ai, perplexity.ai. Doesn't change rank, but changes the case for repeating the bet.
4. **Backlink campaign**: the project memory explicitly names this as the bottleneck. 5-10 dofollow links from DR-50+ tech-content sites in 90 days would meaningfully shift authority. None are in pipeline as of the 2026-04-28 git status.

---

## 7. Strategic Recommendation

### If the goal is "rank on Google for this term in 2026"

**Don't publish it on this domain yet.** Authority is too low; the term won't rank; the existing canary slug demonstrates the failure mode (37 impressions, 0 clicks, declining over the recent 28-day window). Spend the 6-12 hours on backlink-earning content instead — guest posts on Pragmatic Engineer / DEV.to / The New Stack — that _cite_ the term back to a placeholder definition page on this domain. That builds the link graph the term needs to rank later.

### If the goal is "own the AI-citation primacy on a coined term"

**Conditional yes, but reframe.** The Cloudflare data shows AI grounding is real and accelerating on this domain — ChatGPT-User went 5 → 32 in 9 days, with one direct fetch on `/blog/cognitive-debt-ai-teams`. The candidate-set inclusion exists. To convert that into "if you ask ChatGPT what generative debt means, it cites alexmayhew.dev":

1. **Use a term that's already adjacent** to existing strong content (cognitive-debt-ai-teams, metr-paradox, senior-developer-paradox). "Generative debt" is reasonable as long as it's positioned as a synthesis of those existing posts, not a green-field claim.
2. **Make it the canonical definition source** with high schema density (DefinedTerm, Article, FAQPage), an llms.txt entry, and aggressive internal linking from all 17 AI-debt posts to the new hub.
3. **Re-baseline the canary post.** The current `/blog/ai-assisted-development-generative-debt` slug should either be redirected into the new hub or rewritten with the new term as the dominant entity. Two competing pages on the same coined term will cannibalize.
4. **Track AI citations explicitly** via the daily Cloudflare snapshot job (recommended in the 2026-04-19 audit and still not built — a 1-hour engineering task per the memory note).

### If the goal is "lead generation"

**Skip generative debt entirely.** The AI-debt cluster on this site has produced 0 clicks in 90 days. Lead-gen content needs queries with commercial intent (`AI coding consultant`, `technical advisor for AI startups`, `LLM cost audit`) — and we don't rank for those either, but the _match_ between query intent and the service is at least correct. Definitional content on a coined term will not produce inquiries within 6 months.

### What I'd actually publish on 2026-05-01 instead

A definitional piece on "generative debt" _could_ go on the site — not as a hub bet, but as a low-cost concept-anchoring post that completes the AI-debt cluster's internal-link graph. Spec:

- ~1500 words, dense schema, 1 LinkedIn post + 1 Dev.to cross-post for distribution.
- Internal links from all 9 cluster spokes pointing to it as canonical.
- Treat it as a citation-bait artifact for AI surfaces, not a Google-rank bet.
- Measure it on AI-fetch volume (Cloudflare path-level) and AI-referrer traffic (GA4 once unblocked) — not on GSC impressions or clicks.

That changes the success criterion to something achievable on this domain in 90 days.

---

## 8. What's Verified vs What's Inferred

**Verified (data in this report):**

- 13 unique queries, 5 clicks, 1,337 impressions (90d). GSC API.
- 17 AI-themed posts in the blog corpus. blog-index.json.
- 32 ChatGPT-User fetches, 9 OAI-SearchBot, 5 Claude-SearchBot, 4 Perplexity-User in last 24h. CF GraphQL.
- The /blog/cognitive-debt-ai-teams URL was fetched once by ChatGPT-User in the last 24h. CF GraphQL path-level.
- /blog/ai-assisted-development-generative-debt: 37 impressions, 0 clicks, pos 6.2 over 90d, with no surfaced query attribution. GSC API.
- The "AI / debt / generative" vocabulary buckets contain zero queries with any impression in 90d. GSC tagging in this report.
- GA4 Data API remains inaccessible to the available service account. Verified 2026-04-19 (memory) and not changed since.

**Inferred (with stated reasoning):**

- The 90-day rank forecast for "generative debt" comes from: zero baseline rankings + zero adjacent-term rankings + standard SEO-aging timelines for new terms on low-authority domains. High confidence.
- The AI-citation upside estimate assumes the 32-fetch / 24h ChatGPT-User trend continues or grows — based on a 9-day trajectory only, so medium confidence.
- The "0-2 clicks" forecast for the new hub is calibrated against 5 existing AI-debt posts that have produced 0 attributable clicks in 90d-180d. High confidence.
- The reframing argument (term should anchor cluster, not green-field) is a strategic recommendation drawn from the citation-vs-ranking data split, not a verified outcome.

**Unmeasured (can't conclude):**

- Whether AI-citation traffic actually arrives at the site. Need GA4 referrer data with chatgpt.com / claude.ai / perplexity.ai filters.
- Whether the existing canary post is being cited by ChatGPT or Claude in users' visible answers. Need manual prompt testing across 5-10 cognitive-debt / AI-productivity questions.
- Whether the audience that reads the AI-debt cluster engages or bounces. Need GA4 engagement-rate breakdown by landing page.

---

## Appendix — Reproducibility

```bash
# GSC primary audit
node /home/deploy/projects/amdev/alexmayhew-dev/gsc-query.mjs

# GSC extended (full query list, 7d view, country, device)
node /home/deploy/projects/amdev/alexmayhew-dev/gsc-extra.mjs

# Cloudflare 24h bot breakdown — uses Global API Key (admin-api-token returns auth-error 10000)
START=$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)
END=$(date -u +%Y-%m-%dT%H:%M:%SZ)
curl -sS https://api.cloudflare.com/client/v4/graphql \
  -H "X-Auth-Email: $(pass show claude/cloudflare/auth-email)" \
  -H "X-Auth-Key: $(pass show claude/cloudflare/global-api-key)" \
  -H "Content-Type: application/json" \
  --data-binary "{\"query\":\"{ viewer { zones(filter: {zoneTag: \\\"7671499eedb14dde9a666a683b5e8bee\\\"}) { httpRequestsAdaptiveGroups(limit: 1000, filter: {datetime_geq: \\\"${START}\\\", datetime_lt: \\\"${END}\\\"}, orderBy: [count_DESC]) { dimensions { userAgent } count } } } }\"}"
```

GSC service-account credentials: `pass show claude/google/gsc-service-account-json` → `/tmp/aeo-audit/sa.json`.
GSC property: `sc-domain:alexmayhew.dev`.
Cloudflare zone ID: `7671499eedb14dde9a666a683b5e8bee`.

---

**Final answer to the question:** Site-fit score 3/10. The authority floor is too low for the coined term to rank on Google in the requested timeframe. The AI-citation surface is plausible — and the only realistic upside path — but only if the piece is positioned to anchor the existing AI-debt cluster rather than coin a new term in a vacuum. The single highest-leverage prerequisite is unblocking GA4 to measure AI-referrer traffic; everything else (backlinks, manual chat-prompt citation testing, daily CF snapshots) is downstream of that.
