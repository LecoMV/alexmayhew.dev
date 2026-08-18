# SEO / AEO / GEO Best Practices for alexmayhew.dev (2026-08-18)

**Status:** CURRENT
**Session:** 8-agent research sweep (5 angles: technical-seo, content-eeat, structured-data, aeo-geo, strategy-measurement + honesty critic + 2 gap-fills: Bing/Copilot indexing, "Alex Mayhew" name-collision). Full per-claim sourcing in workflow `whchw3gyu` journal + scratchpad `seo-digest.md`.
**Supersedes for AI-era guidance:** the SEO sections of `wave-k-audit-2026-04-17`, `homepage-internal-linking-seo-2026`, `blog-pagination-seo-nextjs15-2026` (still valid on their narrow topics).

---

## THE HEADLINE (reconfirms prior audits, reinforced for 2026)

**The binding constraint is OFF-SITE authority / crawl DEMAND — not on-page, not schema, not Core Web Vitals.** The site sits at ~11 of ~180 URLs indexed because it has near-zero backlinks and near-zero independent third-party mentions. A ~180-URL site is NOT crawl-budget-constrained (Google's own doc scopes crawl-budget work to 1M+ or fast-changing 10K+ sites); ~11/180 reflects low crawl *demand* driven by zero authority. **No amount of schema, IndexNow, GSC "Request Indexing", or CWV tuning changes this.** Only independent third-party citations/links raise crawl demand.

**Therefore the correct Aug-2026 goal is NOT ranking for competitive commercial head terms** ("fractional CTO", "technical advisor") — that is vanity at this authority level and off-mission after the reposition. The realistic, achievable goals are:

1. **Own the SERP for the owner's NAME** (and name+specialty queries).
2. **Become a verifiable machine-readable ENTITY** (Google Knowledge Graph + AI assistants) so recruiters and LLMs find and correctly identify him.
3. **Preserve content/consulting surface as topical authority.**

On-page is *largely already done* (prior audits). The marginal hour now belongs OFF-domain (citations), not on more schema tweaking. The on-site work below is *necessary but not sufficient* — do it to remove blockers and nail the entity, then stop polishing and go earn external mentions.

---

## WHAT ACTUALLY CHANGED IN 2026 (the reasons to revisit this now)

> All precise post-cutoff dates below are **verify-first** — plausible and consistently reported, but confirm against the primary source before treating any single date as load-bearing.

### 1. Google: "AEO/GEO is still SEO" — no special files/schema/chunking (May 15 2026)
Google Search Central published *Optimizing for generative AI features on Google Search* (`developers.google.com/search/docs/fundamentals/ai-optimization-guide`). Direct: "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add"; "You don't need to create new machine readable files, AI text files, markup, or Markdown"; "There's no requirement to break your content into tiny pieces."
**Action:** Keep existing JSON-LD for rich results + entity clarity. Do NOT add "AI-specific" schema, llms.txt, or content-chunk on vendor advice. Those are pure hype in this niche.

### 2. Thin programmatic pSEO became a SITEWIDE liability (May 2026 core update + scaled-content-abuse policy)
The May 2026 core update (rolled out ~May 21–Jun 2) plus Google's scaled-content-abuse spam policy target mass template/near-identical pages. Multiple 2026 analyses report the quality drag is *sitewide* — editorial pages take collateral damage on a programmatic-heavy domain.
**Caution (critic):** The "weakest-link demotion" mechanism is stated more certainly by vendors than Google's actual site-wide-signals guidance supports, and the "60-90% loss" figures are agency estimates. The *direction* is sound and the pruning recommendation is reasonable; the *certainty* is overstated.
**Action:** Audit every pSEO page for genuinely-unique data + standalone value. `noindex` (or 410) thin/near-duplicate ones. Keep only a few strong human consulting pages.

### 3. FAQPage rich results removed (reported ~May 7 2026 — verify)
FAQ/HowTo rich results are dead/deprecated. Don't chase them. FAQ *content* is still fine for users and extractability; just don't expect the rich snippet.

### 4. GSC "Generative AI performance report" launched (~June 3 2026)
Dedicated view of AI Overviews / AI Mode / Discover generative appearances: impressions, pages, countries, devices. No clicks/CTR/query data at launch; rolled out to a subset (initially UK) expanding globally. **This is the free authoritative AI-visibility baseline — use before paying for any third-party AI tracker.**

### 5. Cloudflare Sept 15 2026 AI-crawler default change (VERIFY — possible silent block)
Cloudflare replaced the Jul-2025 "block all AI bots" toggle with a three-tier model (Search / Agent / Training). From Sept 15 2026, new customers, new sites of existing customers, AND existing *free-tier* customers who haven't changed settings get Training + Agent blocked by default on ad-supported pages, Search stays allowed. Cloudflare applies the STRICTEST rule to multi-purpose crawlers — so blocking Training can also catch mixed-purpose bots like Googlebot/Bingbot (SEJ flagged the Googlebot risk).
**Critic caveat (important):** alexmayhew.dev has been live on Cloudflare well before Jul 2025 (grandfathered zone), serves no ads, and runs on Workers. The "new-domain default block" may NOT apply, and it's unconfirmed whether the Sept 15 migration retroactively flips existing free zones. **VERIFY before treating as an emergency** — but it's cheap to check and the downside (walled out of AI assistants) is severe.
**Action:** Before Sept 15, log into the Cloudflare dashboard, audit AI Crawl Control / Bot Fight Mode / WAF. Confirm no rule blocks OAI-SearchBot, PerplexityBot, Claude's search bot, Googlebot, or Bingbot. Pin the exact enforcing layer if anything is blocked.

### 6. llms.txt confirmed useless for Google, barely fetched by any bot
Google states Search does not use llms.txt (neither helps nor harms). Independent bot-traffic analysis found /llms.txt fetch share statistically negligible. **Do not build/maintain one as a GEO tactic.** If one exists, leaving or removing it is inconsequential.

### 7. Bing / Copilot: a real, owner-controlled, zero-cost second index
- **Microsoft Copilot is definitively grounded in the Bing index** (Microsoft's May 6 2026 "grounding index" engineering post). Bing presence → Copilot citations.
- **Bing Webmaster Tools shipped an "AI Performance" report** (public preview, Feb 10 2026): Total Citations, Average Cited Pages, Grounding Queries, page-level citation counts across Copilot/Bing AI. No Google equivalent.
- **The "ChatGPT = Bing index" narrative is now only half true and decaying.** OpenAI runs its own "labrador" index (web/news/arXiv/Reddit/YouTube) with only ~1.5% overlap with Bing's top-20 (SEJ Aug-2026 teardown). Early/mid-2026 correlation studies (Seer ~87%, SEL NYC-hotel study) showed strong Bing/ChatGPT alignment; mechanism is shifting. So Bing = **confirmed** lever for Copilot, **plausible-but-decaying** for ChatGPT.
- **IndexNow** (already emitted in CI) gives Bing 1–3 day discovery vs weeks — but notifies Bing/Yandex only, NOT Google and NOT OpenAI directly; guarantees discovery, not indexing.
- **Cloudflare WAF can block Bing Site Scan** (it doesn't use Bingbot's IP range) and can mis-flag Bingbot — a silent cause of zero Copilot presence on this stack.
**Action:** Register in Bing WMT via one-click GSC import (~5 min); add a DNS/meta fallback verification; verify IndexNow actually reaches Bing (WMT → IndexNow stats) and the key file is served at root; audit Cloudflare for Bingbot blocking; baseline the AI Performance report once indexed.

### 8. "Alex Mayhew" name collision — a severe, underweighted entity risk
- The name collides with **Alex Mayhew "LEX"**, an award-winning new-media artist (Peter Gabriel's "Ceremony of Innocence", AGO "ReBlink" AR exhibition, Tim Cook private tour). **He owns the exact-match apex domain `alexmayhew.com` and the prime LinkedIn slug `/in/alexmayhew/`.** Ambiguous entity signals get pulled toward the far-more-cited artist.
- **Crucially: the artist has NO Wikipedia article and NO Wikidata QID.** Google's KG is NOT locked to him — the entity slot is genuinely contestable *now*, but the window narrows if he ever gets a structured entry.
- 2026 entity resolution = **Proven / Exact / Bridged**. This site's weak axis is **Exact** (disambiguation from the namesake), NOT notability — the opposite of what generic entity-SEO advice optimizes.
- **Do NOT create a Wikidata item yet.** The "Wikidata has no notability requirement" claim is FALSE (it requires serious references or a structural need), and an active Jul–Aug 2026 RFC is debating *tightening* notability. A bare self-created "technical advisor" item risks deletion + evaporated sameAs equity.
**Action:** Target **name+specialty** queries ("Alex Mayhew technical advisor / [content topic]"), not the bare name. Add `disambiguatingDescription`, `hasOccupation` (Occupation: technologist, NOT artist), `knowsAbout`, `worksFor`, and a consistent `image` to the Person schema. Audit every `sameAs` URL — a wrong one that resolves to the artist is *worse than none* (it bridges his entity into the artist's). Reframe deliverables: replace "win position 1 for the name" / "knowledge panel" with "distinct bridged Person entity" + "rank for name+specialty" + "correctly resolved by recruiters/AI".

---

## THE ENTITY PLAY (highest-leverage ON-SITE work)

Make `/about` and `/resume` the canonical Person entity home node:
- **Single stable Person `@id`** reused everywhere (verify no duplicate/inline Person objects fragment it — prior audit flagged 7 inline Person objects; confirm all now use the shared ref).
- **Complete, CONSISTENT `sameAs`** (LinkedIn, GitHub, X, Bluesky, dev.to — all verified to be THIS Alex Mayhew) + Wikidata Q-number *only if* one is ever legitimately created.
- **ProfilePage schema** on /about and /resume with the shared Person `@id`.
- **Disambiguating props** (see name-collision section) so Google resolves him as a distinct technologist.
- **Reciprocal links:** every off-domain profile links back to alexmayhew.dev. Reciprocal identity links are the core entity-verification mechanism for both Google KG and AI "who is [name]" answers.
- **Title tags** of the form `Alex Mayhew — [specialty]` on home/about/resume; unique <160-char meta descriptions.

Schema is a **claim, not proof** — it only pays off paired with off-site corroboration. Treat all JSON-LD as entity hygiene + rich-result eligibility, NOT an AI-citation unlock (no schema type forces AI citation).

---

## THE OFF-SITE LEVER (where the marginal hour actually goes)

~85% of AI-cited brand/name mentions come from third-party pages (vendor-sourced, **directional not precise**), and AI engines draw from near-non-overlapping source pools (Reddit + Wikipedia dominate; Perplexity/ChatGPT lean on Reddit, Gemini barely does). For a zero-authority personal site:
- **1–2 quality external placements/month** does more than any on-page sprint: dev.to/Hashnode canonical cross-posts of hub content (rel=canonical + backlink), 1 guest post or podcast/conference/speaker mention, genuine disclosed participation on relevant subreddits.
- **Consistent name/title/photo** across LinkedIn, GitHub, X, Crunchbase (feeds both entity resolution and disambiguation).
- **First-hand / experiential, non-commodity content** is the one tactic where Google's official guidance and GEO research agree — original data, opinionated practitioner takes, "here's what actually happened". A realistic edge for a low-authority practitioner blog. Lead each hub/spoke with a direct, self-contained answer to the implied question (aids AI extractability without "chunking").

---

## MEASUREMENT (track monthly; stop tracking vanity)

**Meaningful:** GSC indexed-page count trend (move from ~11 toward full coverage of pages worth keeping); impressions/clicks for NAME + owner+topic queries; knowledge-panel/entity-box appearance; GSC Generative AI performance report; Bing WMT AI Performance report; a manual 4-prompt AI check ("who is Alex Mayhew", "[name] [topic]") across ChatGPT/Perplexity/Gemini/AI Overviews.
**Stop tracking (vanity/off-mission):** rank for "fractional CTO"/"technical advisor"; raw impression totals dominated by junk queries; paid "AI share-of-voice" dashboards (built for multi-competitor B2B SaaS, overkill for one person).

**Honest expectations:** at zero backlinks, full indexing + a coherent entity + correct AI identification is a **2–6 month effort gated by OFF-SITE work**, not a config change. Ranking for competitive head terms and a guaranteed knowledge panel are NOT realistically achievable and should be dropped as targets. Rate-limiting input = number of independent editorial third-party citations (~1–2/month realistic).

---

## HONESTY LEDGER (claims flagged weak / verify-first by the critic)

- `~85%` third-party AI citations, `3x` brand-mentions-vs-backlinks, `62%` AI-Overview citations outside top-10 — all **single-source vendor GEO stats**, directional at best, presented elsewhere as fact.
- "Weakest-link demotion" as a settled mechanism — **stronger causal claim than Google's guidance supports.**
- "No schema type unlocks AI citation" (Ahrefs 2026) — a single study framed as definitive null-effect proof.
- Precise post-cutoff dates (FAQ removal May 7, spam policy May 15, GSC report June 3, Cloudflare Sept 15, two core updates) — plausible, **unverified against primary sources here.**
- "IndexNow does nothing for Google" — technically true for Google, but dismissive given Bing feeds Copilot (the AI-discoverability goal).

**Unresolved contradictions to hold in mind:**
- Off-site priority: link-earning (strategy-measurement) vs unlinked brand-mention seeding (aeo-geo). Reconcile as: both matter; for a zero-authority name, *any* corroborated third-party co-occurrence helps, linked or not.
- Cloudflare default-block scope: whether AI *search* bots are caught by default (disagreement between angles) → resolve by checking the live dashboard, not the docs.

---

## CONSOLIDATED PRIORITIZED CHECKLIST (feeds the audit + plan)

**P0 — verify no silent blockers (cheap, high-downside):**
1. Cloudflare dashboard: audit AI Crawl Control / Bot Fight Mode / WAF before Sept 15; confirm Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, Claude search bot all reach the site.
2. robots.txt (served from Worker/static): confirm it allows the search/user bots; only optionally disallow GPTBot/ClaudeBot/Google-Extended (training). Blocking Google-Extended does NOT remove you from AI Overviews.
3. Confirm every page worth keeping is index- and snippet-eligible (no accidental noindex on the wrong pages, no blocked resources).

**P0 — entity foundation:**
4. Single stable Person `@id` everywhere; audit for entity-fragmenting duplicate/inline Person objects.
5. Add disambiguation props (`disambiguatingDescription`, `hasOccupation`, `knowsAbout`, `worksFor`, `image`) to separate him from the artist namesake.
6. Audit `sameAs` — every URL must resolve to THIS Alex Mayhew; remove any that could bridge to the artist.
7. ProfilePage on /about + /resume with shared Person `@id`; validate in Rich Results Test.

**P1 — pruning + second index:**
8. Audit pSEO pages; noindex/410 the thin/near-duplicate ones (sitewide-risk mitigation).
9. Register Bing WMT (GSC one-click import); verify IndexNow reaches Bing + key file served at root; verify Cloudflare isn't blocking Bing Site Scan/Bingbot.
10. Sitemap: confirm lastmod is accurate (not build-time-stamped every deploy); keep future-dated-content exclusion.

**P1 — measurement:**
11. Confirm site in GSC; start monitoring the Generative AI performance report.
12. Monthly dashboard: indexed-count, name/topic impressions, manual 4-prompt AI check. Stop tracking head-term rank.

**P2 — the actual growth lever (off-site, ongoing):**
13. Cadence of 1–2 external citations/month (dev.to canonical cross-posts, guest post/podcast, consistent profiles). This is where the needle moves.
14. Name+specialty content targeting in titles/H1s/self-references (not the bare name).

**Explicitly DON'T:** build llms.txt; add AI-specific schema; chunk content; chase FAQ/HowTo rich results; create a Wikidata item yet; track "fractional CTO" rank; expect IndexNow/Request-Indexing to fix Google indexing.

**GUARDRAIL:** Any schema/sitemap/JsonLd change is a risk-path edit (project CLAUDE.md) — run the Codex `audit-review` gate before push. Entity-graph and sitemap regressions are exactly the silent damage that hurts a low-authority site most.

## Sources
Per-claim URLs in workflow `whchw3gyu` journal + `seo-digest.md`. Key primary sources: Google Search Central AI-optimization guide, Google crawl-budget docs, spam policies, GSC gen-AI-report blog; Microsoft Bing "grounding index" post + Bing WMT AI Performance blog; Cloudflare content-signals + blocked-Bing-Site-Scan docs; Wikidata:Notability + RFCs; SEL/SEJ core-update + ChatGPT-retrieval-stack teardowns. Vendor GEO studies (AirOps, Seer, digitalapplied) cited as directional only.
