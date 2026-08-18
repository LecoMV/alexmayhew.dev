# alexmayhew.dev — SEO / AEO / GEO Plan (2026-08-18)

**Status:** DRAFT for review (do not execute until approved)
**Inputs:** `docs/research/seo-aeo-geo-best-practices-2026-08.md` (rubric) + 7-agent read-only site audit (6 dimensions + adversarial critic, workflow `wf_6b922863-7b2`) + live production probes.
**Reviewer gate:** Alex approves scope + the 3 strategy decisions below before any execution. Every risk-path edit (schema, wrangler/deploy, CSP, sitemap) gets a Codex `audit-review` pass before push (project CLAUDE.md).

---

## The one-paragraph truth

The site is **mechanically index-ready** — no code-level crawler block, canonicals + metadata-in-`<head>` + IndexNow are all correct, and live curls confirm Googlebot/Bingbot/ChatGPT/Perplexity all get `200` + server-rendered HTML. But it is **not entity-ready**: it still broadcasts a **contradictory, partly-fabricated consultant identity** across the 44-page pSEO corpus, ~30 blog posts, the `/for` funnel, and its own `llms.txt`/`ai.txt` files — the exact signals that corrupt the entity resolution the whole strategy depends on — plus a confirmed indexable `workers.dev` duplicate. **Honest state: "crawlable, but self-sabotaging its own entity, and carrying fabrications that are a credibility landmine for a job-seeker."**

And the hard truth the audit cannot fix: **none of this on-site work moves the ~11/180 indexing reality.** The binding constraint is off-site authority. On-site cleanup is _necessary hygiene to stop mis-identification and remove fabrications_ — then the growth lever is **1–2 independent third-party citations per month.** Do Track A, then stop polishing and run Track B.

---

## THREE STRATEGY DECISIONS NEEDED FROM ALEX (these gate execution)

1. **The `/for/[role]` funnel + `/services` tiers** currently market _Fractional CTO / Advisory Retainer_ engagements he has never held. **Retire the `/for` funnel entirely** (off-mission for a job-seeking portfolio), or **rewrite** the tiers to the honest service shapes (web build, automation, maintenance retainer)? — _Recommendation: retire `/for`, keep a single honest `/services` page as the consulting-secondary surface._

2. **The pSEO corpus (44 pages).** Prune hard (410 the 3 identity pages, noindex the thin migration/integration/comparison types, consolidate the best 3–5 tech×industry into honest capability pages) — **or** keep-and-fix as portfolio capability pages? This directly conflicts with the existing bead **vk-swj2** ("expand 5 thin pSEO pages, _don't_ noindex"). — _Recommendation: prune. Post-reposition + May-2026 scaled-content-abuse guidance makes a fabricated, old-brand programmatic corpus a domain-level liability, and it's off-mission._

3. **The fabricated-metrics remediation.** Some quantified claims map to **real** projects (voice-clone uptime/restorations, PenQWEN LoRA, the private-firm data platform under NDA); others appear invented ("$10B+ transactions", "$50M+ ARR", "400% revenue lift", "I've helped 15+ startups", "mentored 20+ engineers", "$500K mistake I helped a startup avoid"). Do we **strip all unverifiable numbers** and keep only what's provable, or do you want to **supply the real figures** for the projects that have them? — _Recommendation: strip everything unverifiable now (truthfulness first); re-add only figures you can defend, one by one._

---

## TRACK A — On-site truth + entity hygiene (this sprint)

Ordered by leverage toward the entity/name-discoverability goal. Severities are the critic's calibrated values (not the raw auditor ranks).

### WS1 — Truthfulness purge (P0 — do first; truthfulness > SEO)

The credibility landmine. One class, two surfaces.

- **pSEO fabricated/unverifiable commercial metrics** — strip or replace every unattributed quantified outcome in `src/data/pseo/pages.ts` (983, 1371-1373, 2808, + case studies / realOutcomes throughout). Keep only figures that map to a real, defensible project.
- **Blog fabricated first-person advisory experience** (~30 posts) — sweep every "I advised / I mentored / I've helped N startups / in my advisory work" claim (`first-engineering-team-playbook.mdx:24`, `ic-to-tech-lead.mdx:24,82`, `engineering-leadership-founder-to-cto.mdx`, …) and rewrite to genuine framing: real solar-company + self-employment experience, or reframe as researched/observed rather than lived advisory.
- **Gate:** Codex `audit-review` on the full content diff before push. This is the finding most damaging if shipped wrong (over-deletion loses real wins; under-deletion keeps fabrications).

### WS2 — De-brand the indexed identity surface (P0/P1 — merged from 5 duplicate reports)

Strip `Technical Advisor` / `Fractional CTO` / `Systems Architect` from every indexed signal that still contradicts "Technology Specialist":

- pSEO `seo.title`/keywords in `src/data/pseo/{pages,integrations,migrations}.ts`; the hardcoded `/technologies/[slug]` title; `/for` + `/technologies` hub metadata; `src/data/roles/pages.ts`.
- Schema names: `technology-json-ld.tsx:74`, comparison + role schema titles.
- `src/data/search-index.ts:125` ("Technical advisory and development services").
- **`llms.txt` / `llms-full.txt` / `ai.txt`** — these actively feed answer engines the _old_ identity. **Recommendation: delete all three routes** (removal is inconsequential for Google per the rubric; eliminates the stale-identity leak). If kept, rewrite `ABOUT_INLINE` + hub summaries to match the Person schema verbatim.
- **Chatbot fixes** (`src/app/api/chat/route.ts:29`): "Self-employed since January 2026" → **"August 2025"**; and `resume.ts:4` "Technology **generalist**" → "**specialist**" so every surface uses one occupation term.

### WS3 — pSEO corpus decision + de-commercialization (P0 — gated on Decision #2)

- 410-remove the 3 pure-identity service pages: `fractional-cto-for-startups`, `technical-advisor-for-startups`, `technical-due-diligence-consultant` (old brand _as URLs_ — noindex isn't enough).
- Remove the `$40k–$1M` budget/price tables from the service-page template (`service-page-content.tsx:661-707`) and the "Free audit / Free strategy / Free architecture call" CTAs from pSEO meta descriptions.
- noindex the thin migration/integration/comparison types now; consolidate the best 3–5 tech×industry into honest capability pages (Decision #2).
- Housekeeping: correct the stale MEMORY note ("Wave K noindexed pSEO" is **false** in current code — reverted 2026-04-17); update `.claude/rules/pseo.md` positioning off the retired consultant brand.

### WS4 — Entity / name-collision hygiene (P1 — cheap, highest-leverage on-site defense)

The Exact-axis (disambiguation from the artist namesake), not notability.

- Add `disambiguatingDescription` to the Person node (`json-ld.tsx:16-83`): e.g. _"Software and web technology specialist (Mayhew Technology LLC); not the new-media/AR artist Alex Mayhew / LEX."_
- Add **one byte-identical, name-anchored, specialty-first bio paragraph** to both `/about` and `/resume` HTML (it currently exists only in `llms-full.txt` + schema, not crawlable page copy). First sentence = occupation + employer + specialty + location.
- Name+specialty on the two entity pages: titles `About Alex Mayhew — Technology Specialist` / `Alex Mayhew — Resume (Technology Specialist)`; add the specialty clause to at least one `/about` or `/resume` H1.
- Fix the inline Person on `frameworks/saas-stage-fit-matrix/page.tsx:42` → `PERSON_REF` (entity fragmentation).
- Verify `dev.to/alexmayhewdev` exists (live probe returned `000`); remove from `sameAs` if it doesn't. Confirm every other `sameAs` resolves to THIS Alex (GitHub/X/Bluesky ✓; LinkedIn `/in/alexmmayhew` double-m is correct).
- (Defer, needs asset) `Person.image` → a real square headshot reused across all profiles.

### WS5 — Crawler / infra integrity (P0 confirmed bug + P1 verify)

- **workers.dev mirror (CONFIRMED P0):** `wrangler.jsonc` keeps `workers_dev: true` (prod + preview) but the noindex guard `custom-worker.ts:82` checks `.pages.dev` — the OpenNext mirror is `.workers.dev`, so it never fires. **Fix: set `workers_dev: false`** (custom domain is live; the comment says it was only temporary) _or_ broaden the guard to `.workers.dev`. Then check `site:workers.dev alexmayhew` in Google — if already indexed, this is urgent. **Risk-path → Codex gate.**
- **Cloudflare dashboard (P1-verify, not emergency):** before Sept 15 2026, audit AI Crawl Control / Bot Fight Mode / WAF; confirm all search/AI bots reach origin and Bing Site Scan isn't blocked. Live curls already return `200`s, so this is confirmation, not a known defect (grandfathered pre-Jul-2025 zone, no ads).
- Robots: add the shared disallows to each named bot group so answer engines don't spend budget on `/api`,`/keystatic`,`/demo`,`/offline` (P3).

### WS6 — Schema / metadata dead-markup + freshness cleanup (P2 — batch)

- Remove `SearchAction` (deprecated) and `FAQPage`/`HowTo` JSON-LD (rich results removed ~2026 — keep the human-readable FAQ prose).
- Kill build-time date-stamping: sitemap static `lastmod`, `ProfilePage`/role/service `dateModified` → omit when there's no real edit date, never `new Date()`.
- Add `wordCount` + `series/isPartOf` to blog `Article` schema; standardize on `og-image-2026.png` (~8 static routes still use the old one); trim the 4 metas >160 chars; fix `/about` h1→h3 jump.

### WS7 — Performance (P1 — bundle leaks)

- `/technologies/[slug]` ships the entire ~222KB `pseo/pages.ts` client-side; `/technologies` ships the ~39KB dataset. Move `getRelatedServicePages`/`getTechnologyIds` to the server component and pass trimmed props — mirror the existing `services/[slug]` pattern. (Pull real CrUX/PSI field numbers before/after; no field data was gathered in the audit.)

---

## TRACK B — Off-site (THE growth lever — ongoing, starts alongside Track A)

Per the rubric headline and the critic's verdict, this is where the ~11/180 needle actually moves. This overlaps the existing **Distribution-First Sprint (vk-5ufs)** — reconcile, don't duplicate.

- **Cadence: 1–2 independent editorial citations / month** — dev.to/Hashnode canonical cross-posts of hub content (rel=canonical + backlink), 1 guest post or podcast/speaker mention, genuine disclosed Reddit participation (Perplexity/ChatGPT source pool).
- **Reciprocal profiles:** identical name/title/photo/bio on LinkedIn, GitHub, X, Bluesky, dev.to, Crunchbase — every one links back to alexmayhew.dev.
- **Bing/Copilot:** register Bing WMT via one-click GSC import (~5 min); verify IndexNow reaches Bing (WMT → IndexNow stats); baseline the Feb-2026 AI Performance report.
- **Measurement (monthly):** GSC indexed-count trend, name + name+topic impressions, GSC Generative AI performance report, Bing AI Performance report, manual 4-prompt AI check ("who is Alex Mayhew", "[name] [topic]") across ChatGPT/Perplexity/Gemini/AI Overviews. **Stop tracking** head-term rank ("fractional CTO"/"technical advisor").
- **Do NOT** create a Wikidata item yet (notability risk + active Aug-2026 RFC), build llms.txt as a tactic, add AI-specific schema, or chase FAQ/HowTo rich results.

---

## Recommended execution order

1. **WS5 workers.dev fix** (confirmed P0, cheap, entity-signal integrity) + **WS1 truthfulness purge** (credibility landmine) — first, in parallel; both Codex-gated.
2. **WS2 de-brand** + **WS4 entity hygiene** (cheap, high-leverage, one schema/metadata pass).
3. **WS3 pSEO decision** (needs Decision #2) — larger, gated.
4. **WS6 + WS7** batch cleanup.
5. **Track B** begins immediately and runs continuously — it is the actual growth work.

## Git cleanup (fold in, separate from SEO work)

- **PR #106** (newsletter welcome-sequence) — real live gap (new subscribers not enrolled). Recommend merging after a quick verify. _Needs Alex's OK — it's a production deploy._
- 11 Dependabot PRs — triage separately (Next 16 / TS 6 / ESLint 10 are majors).
- Delete stale: `dev-site` worktree (behind 372, obsolete), merged branches (`fix/smoke-test-retry`, `feat/site-repositioning`, `fix/metadata-head-placement`), stale `main` worktree, 6 stashes (one is the abandoned CSP-nonce migration — decide before dropping).
