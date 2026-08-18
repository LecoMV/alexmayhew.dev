# alexmayhew.dev — Reposition Cleanup Plan v2 (Three-Brain Synthesis)

**Status:** DRAFT for review — supersedes the shape of `SEO_AEO_GEO_PLAN_2026-08.md` (v1).
**Gate:** v1 plan → Codex `audit-review` (REVISE) → Gemini bwrap-isolated (RETHINK-SHAPE) → this synthesis. Grounded in a 209-item read-only inventory (workflow `wf_cd193bfb-a78`).
**Git integrity during gate:** HEAD unchanged (`49ffc83`); both reviewers were read-only/sandboxed.

---

## What each brain caught (the value was in the disagreement)

- **Claude (proposer):** the fabrications exist; old-brand identity is pervasive; the `workers.dev` mirror bug; the name-collision entity strategy; the pSEO sitewide-liability framing.
- **Codex (execution adversary):** the plan's truth-scope was incomplete — it **missed the newsletter landing + 5 welcome emails, the downloadable PDF/TXT resume, `projects.ts` case studies, glossary, and the chatbot context**. It caught the **CI conflict** (`deploy.yml:322` smoke-tests `/for`=200, tests assert pSEO indexable → retiring them fails CI post-deploy, no auto-rollback), that **removing a slug yields 404 not 410**, that the **preview `.workers.dev` mirror stays exposed** (preview deploy depends on `workers_dev:true`), that **negative disambiguation backfires**, and that the title template **double-names** (`| Alex Mayhew` appended).
- **Gemini (strategy adversary):** the **shape** was wrong. This is a survival vehicle for a financially-urgent job-seeker, and on-site SEO barely moves the hiring needle. **Delete, don't rephrase** the advisory posts (a solo solar-IT generalist can't truthfully claim "advised dozens of startups," and the content is low-signal + creates resume dissonance). **Delete the pSEO programmatic setup wholesale** (it signals "agency/contractor chasing gigs," which _deters_ full-time employers). Do a **Minimum Viable Truth sweep in ~1–2 days, then redirect 95% of energy to applying to jobs.** Drop the over-engineering (claim-ledger banners, GSC-baseline obsession, 10-PR sequence, multi-env routing). And **"Technology Specialist" is weak ATS positioning** — recruiters/ATS map to "Software Engineer / Full-Stack Developer."

## Resolved contradictions (first-principles; Gemini wins strategy, Codex wins code-path)

1. **Rephrase vs delete (blog):** The inventory found **59 unverifiable + 20 old-brand blog claims across ~42 posts.** Triage, don't blanket-rephrase:
   - **DELETE ~8–10 advisory-premise posts** whose entire thesis is fabricated consulting (the engineering-leadership cluster: `fractional-cto-vs-full-time`, `senior-developer-paradox`, `ic-to-tech-lead`, `technical-hiring-framework`, `first-engineering-team-playbook`, `500k-architecture-mistake`, `engineering-leadership-founder-to-cto` [the hub], `technical-debt-strategy`). Can't be made truthful; low-signal; resume dissonance.
   - **CLEAN ~30 technical posts** that are genuinely useful but carry 1–2 stray fabricated first-person lines/CTAs — remove just those lines.
2. **Prune vs delete pSEO/`/for`:** **Delete wholesale** (Gemini + inventory). Keep **one slim honest `/services`** page (dual-purpose) + the **real project case studies** in `projects.ts` (verified clean) as the portfolio.
3. **Claim ledger + correction banners:** **No public "I corrected my fabrications" banners** (self-sabotage). Apply per-item judgment as I edit (keep-with-evidence / label-as-illustrative / delete). Codex-gate the content diff. No formal tracked artifact.
4. **Baseline capture:** **Lightweight only** — a ~15-min GSC snapshot of currently-indexed URLs + any with impressions, so we don't 410 a page pulling a real signal. Skip the referrer/denominator tracking (near-zero-traffic site).
5. **Sequencing:** **2–3 PRs, verified on the Cloudflare preview** (not 10 staged PRs, not 1 mega-PR). Risk-path PRs Codex-gated.
6. **Workers fix:** set **prod `workers_dev:false`** AND **broaden the guard to `.workers.dev`** (covers preview) — simple, no routing matrix.
7. **Disambiguation:** **positive unique facts only** (occupation, Mayhew Technology LLC, MA solar history, specialties, verified profile URLs). **Never name the artist in JSON-LD.**
8. **Titles:** absolute titles on `/about` + `/resume` to avoid template double-naming.
9. **Identity record:** ONE canonical source rendered across schema / about / HTML resume / PDF / TXT / chat / newsletter bio: _"self-employed since August 2025; operating as Mayhew Technology LLC since March 30, 2026."_
10. **WS6/WS7 (schema dates, `wordCount`, bundle leaks, OG standardization):** **defer/drop** — low-value polish during a high-risk truth cleanup.
11. **PR #106 (newsletter welcome-sequence):** **CANNOT merge as-is** — the 5 welcome emails ARE fabricated advisory content (`03-how-i-help.md` = "How I Help CTOs…"; `05-case-study.md` = invented "$2.1M ARR, 12 engineers" client). Rewrite (or replace with a truthful minimal sequence) FIRST, then merge.

## The Minimum Viable Truth (MVT) plan — the actual shape

**Goal:** a small, fully-truthful site that wins the recruiter's "Alex Mayhew" name-search, then get off-site and apply. Everything below is ~2 focused days, not weeks.

**PR-A — infra/routing (risk-path, Codex-gated, tests-first):**

- `wrangler.jsonc`: prod `workers_dev:false`; broaden `custom-worker.ts` guard to `.workers.dev` (+ preview noindic).
- `custom-worker.ts`: emit real **410** for the 3 identity `/services` URLs.
- `next.config.mjs:61-69`: add **301** `/for → /services` and `/for/:role* → /services`.
- Update `deploy.yml` smoke tests + sitemap/route/indexability tests **in the same PR** (remove `/for` from the 200-check; assert 410/301/noindex).

**PR-B — the truth sweep (Codex-gated content diff):**

- Delete `/for` funnel (`src/app/for/**`, `src/data/roles/**`, `role-json-ld.tsx`, `sitemap.ts:215-228` rolePages) + the `startup-stack` cluster (`types.ts:418-428`) + `fractional-cto` from `saas-at-scale` spokeSlugs (`types.ts:400`, unfiltered).
- Set the 3 identity pages `published:false` (`pages.ts:827,2972,3122`); delete the pSEO programmatic setup per the wholesale decision.
- Delete the ~8–10 advisory-premise blog posts; clean the ~30 technical posts (remove stray first-person/CTA fabrications); bulk-repoint/remove the 59+17+7 in-body links to the 3 identity slugs.
- Rewrite the **canonical identity** everywhere: home, `/about` (skills = real stack from `resume.ts`), `/resume`, **PDF + TXT resume**, chatbot prompt (fix "January 2026"→"August 2025", "generalist"→"specialist"), `projects.ts` case-study client-framing (per-item: real client vs own product), newsletter landing + **5 welcome emails**, `llms.txt`/`llms-full.txt`/`ai.txt` (rewrite-or-delete), `search-index.ts`.
- Person schema: positive `disambiguatingDescription` (no artist mention); remove `Person.image` (generic OG banner) until a real headshot exists; add the identical name-anchored bio to `/about` + `/resume`; fix inline Person on the stage-fit page.

**PR-C (optional) — entity polish:** absolute name+specialty titles on `/about`/`/resume`; verify `dev.to` sameAs exists (probe returned 000) or remove it.

**Then STOP on-site.** Merge PR #106 only after its emails are truthful. Pivot to off-site: reciprocal profiles (identical name/title/bio, all linking back), Bing WMT (GSC import), and — the real lever — **direct job applications + networking.** Track only: does a "who is Alex Mayhew" search/AI answer resolve to the clean site.

## Decisions that override Alex's earlier choices (need his call — see chat)

- **Positioning:** keep "Technology Specialist" (broad, anti-overqualification) vs Gemini's "Software Engineer / Full-Stack Developer" (ATS/role-mapping) vs hybrid (site = broad identity, per-application resume titles role-matched).
- **Blog:** delete the ~8–10 advisory posts (recommended) vs rephrase.
- **pSEO/`/for`:** delete wholesale (recommended) vs prune to a few.
- **Scope:** tight MVT now (2–3 gated PRs) then pivot to applying (recommended) vs fuller cleanup.
