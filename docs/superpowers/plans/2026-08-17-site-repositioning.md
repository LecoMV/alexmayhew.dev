# Site Repositioning Plan — alexmayhew.dev (2026-08-17)

**Goal:** Reposition the site from consultant-branding ("Technical Advisor & Systems Architect, 15+ years, 30+ startups") to a truthful dual-purpose site: primary = job-seeking technologist whose site passes employer/AI cross-checks against his resume; secondary = preserved consulting/brand asset for future revival. Research basis: `docs/research/site-repositioning-2026.md` (+ `remote-tech-income-2026.md`, `tech-resume-best-practices-2026.md`).

**Hard constraints**

1. One deploy — all identity-bearing changes ship in a single PR/merge (staggering = weeks of fresh inconsistencies on a slow-recrawl domain).
2. NO URL removals or redirects in this PR — reframe in place. (pSEO consolidation is a later, GSC-impressions-driven pass.)
3. Every claim that survives must be narratable by Alex under questioning and must match the resume PDF + LinkedIn byte-for-byte on titles/dates/entities.
4. Keep the existing Person `@id` — never mint a new entity node.
5. Voice: alex-voice rules (ellipsis not em dashes, no emojis, no hedging, dense/direct).
6. Never deploy manually; `npm run build` + `npx vitest run` green before push; Codex review of the full diff before merge (schema/JSON-LD = risk-path per project CLAUDE.md).

**Canonical identity (single source of truth, from the finalized resume)**

- Name: Alex Mayhew. Headline identity: "Technology Specialist" (role-neutral); NOT "Technical Advisor & Systems Architect", NOT "Founder" in H1/title/meta/jobTitle.
- History: Harvest Sun Solar, Solar Designer & Technology Specialist, March 2016 – December 2025 (company closed). Self-Employed — Web, Automation & AI Services (Mayhew Technology LLC), January 2026 – present.
- Approved claims: 9 years as a solar company's one-person tech department; ~200 residential PV systems; commercial to 2-3 MW; #1 local rankings for core MV solar searches; production client platform for a private investment firm (NDA); shipped products (named, truthfully described); 70+ published articles.
- Banned claims (delete, do not soften): "15+ years", "30+ startups", "seed through Series C", "dozens of high-growth companies", "50+ Architecture Reviews", "6+ years" (terminal), unattributed outcome claims (400% revenue, $2M+ saved, 2.1s→0.3s, zero-incidents-18-months, 10k→500k users, $50M+ e-commerce) unless Alex attributes them later.
- Handles: GitHub `LecoMV` everywhere; LinkedIn `/in/alexmmayhew` everywhere; email alex@alexmayhew.dev.
- Availability line (homepage, below hero, not a banner): "Currently available for part-time, contract, or full-time remote work. Resume →"

## Workstreams

**W1 — Claims purge (all 21 files from the 2026-08-17 grep inventory).** Replace banned claims with approved ones in: `src/app/home-page.tsx`, `src/app/layout.tsx` (title template + meta description), `src/components/pages/about-page.tsx` (including the fabricated-looking 2018/2020/2022 timeline entries → replace with the truthful 2016-2025 + 2026 timeline), `src/components/seo/json-ld.tsx`, `src/app/ai.txt/route.ts`, `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, `src/app/feed.xml/route.ts`, `src/components/terminal/commands/index.ts` (whoami: fix years, handles), `src/components/ui/footer.tsx`, `src/data/pseo/pages.ts`, `src/data/pseo/technologies.ts`, `src/data/roles/pages.ts`, `src/data/search-index.ts`, blog author-bio component (locate via grep at implementation), `content/` files carrying claims. Acceptance: repo-wide grep for each banned string returns zero (excluding docs/research + this plan).

**W2 — Schema rewrite (`json-ld.tsx`, risk-path).** Person: keep `@id`; jobTitle "Technology Specialist"; truthful description; `sameAs` = LecoMV GitHub, /in/alexmmayhew, x, bsky, dev.to; knowsLanguage per Alex (en; add es only if he confirms); remove unverifiable `award` entries (keep TraceForge 337x and PhotoKeep 73% which are project-verified; drop unattributed revenue/savings) and the "15+ Years" credential. Organization: foundingDate 2026 (LLC filed 2026-03-30) or omit; worksFor wiring Person→LLC. ProfessionalService: strip priceRange values. Add ProfilePage component for /resume (mainEntity = PERSON_REF, dateCreated/dateModified/description/image/sameAs) and hasOccupation Role array (HSS Mar 2016–Dec 2025; Self-Employed Jan 2026–; NDA engagement as Role with generic occupation, no employer name).

**W3 — /resume page.** New server-rendered route `src/app/resume/page.tsx` + single data module `src/data/resume.ts` (mirrors the finalized General-variant resume verbatim). Sections as self-contained statements. Links to PDF at `public/Alex-Mayhew-Resume.pdf` (generated from the same facts; committed). PDF canonical: attempt `Link: rel="canonical"` header for the PDF path (custom-worker.js/OpenNext headers); if not cleanly supported, ship without and log a follow-up bead — low risk, do not block the PR. Add /resume to sitemap + global footer/nav + availability-line link target.

**W4 — Products truth pass (`src/data/projects.ts` + tool pages).** PenQWEN: correct to "442K-example instruction dataset + synthetic-data pipeline; two-stage LoRA design for Qwen2.5-Coder-32B" (no completed-fine-tune claim, no RTX-3080-training claim). VoiceKeep: date honestly (2025-2026), soften "live" claims (server sunset imminent), keep metrics that are code-verified (12s P50 etc. only if Alex can narrate; else drop). AudioKeep: remove entry. Fix `github.com/alexmayhew/claude-pilot` → LecoMV. DoneDays (empty shell): remove or mark concept. Keep TraceForge/PhotoKeep/Unsexy Stack (verified).

**W5 — Services de-pricing (`src/app/services/services-page-content.tsx` + schema offers).** Keep the page live and indexable. Remove all tier pricing ($3-8k/mo etc. — flagged in code as aspirational anyway). Reframe to honest present-tense capability + contact. Remove "Accepting Select Engagements" badge (about-page). Demote Services in nav to footer if nav structure allows trivially; otherwise leave nav order for a follow-up (don't scope-creep layout).

**W6 — Homepage rewrite (`home-page.tsx`).** Role-neutral H1/hero (builder identity, evidence-first), availability sentence below hero, stat block replaced with defensible stats (200+ PV systems designed · 70+ articles · products shipped · 9 years one-person tech dept), surface 3-4 substantive posts, About block truthful. Commitment paragraph goes on /about: why full-time now, LLC = continuity, not active BD.

**W7 — Ops/verification additions.** Post-deploy smoke: add curl checks with `ChatGPT-User`, `Claude-User`, `PerplexityBot` UAs against /resume asserting 200+HTML (proves Agent-class fetch path on Workers). Sitemap lastmod only for changed URLs. Keep IndexNow step (document Bing-only purpose). docs note: GSC generative-AI toggle stays Include; Cloudflare AI-traffic verification is a manual dashboard task for Alex (screenshot into docs/) before Sept 15.

**Out of scope (logged as beads, not this PR):** pSEO consolidation via GSC impressions; NDA-safe case study (needs client sign-off); Cloudflare dashboard verification (manual); "Publish Scheduled Blog Posts" workflow failure; fresh blog post before applications; LinkedIn updates (Alex, from `linkedin-profile-text.md`).

**Verification before merge:** `npm run build` green; `npx vitest run` green; claim-ledger check (see v2) = clean; Playwright smoke locally if fast; Codex `audit-review` on `git diff origin/main..HEAD`; PR to main; Alex merges; monitor Actions through deploy + health + smoke; then GSC URL-inspect /, /about, /resume, /services once each.

---

# v2 — Three-brain synthesis (Codex REVISE + Gemini RETHINK_SHAPE, 2026-08-17)

**What each reviewer uniquely caught.** Codex (code-level): true claim surface is ~88 files with semantic variants raw grep misses; the site chatbot (`src/app/api/chat/route.ts`) still sells consulting at listed prices and claims A100 fine-tuning; og-image.png renders the old title; LLC formation date (2026-03-30) conflicts with a January Role employer; tests lock old copy/prices/nav/schema; de-pricing scope is `hasOfferCatalog.priceSpecification` + service/migration/comparison JSON-LD + contact budget selector + chatbot, not `priceRange`; `custom-worker.ts` (not .js) returns non-HTML before header edits so the PDF canonical needs `public/_headers`; VoiceKeep redirect in `next.config.mjs` points at a dying domain. Gemini (strategic): a live services pitch — even de-priced — feeds the flight-risk read; proposed the "product lab" transition narrative; blog corpus carries consultant-persona semantics beyond grep reach; external AI indexes will serve the legacy persona for a while.

**Contradictions resolved.**

- _Services page (Gemini kill-and-redirect vs research/Codex keep-live):_ middle path grounded in Alex's actual strategy, which is contract-first income stacking where a work-with-me surface HELPS. `/services` stays live and indexable but is fully rewritten as a modest contract/fractional "Work with me" page (no prices anywhere, no funnel, no "Accepting Select Engagements"), REMOVED from primary nav (footer only — mandatory, per Codex B3), with commerce schema scoped to that route only. Gemini's transition narrative is adopted on /about: Mayhew Technology has shifted from client services to products (VoiceKeep, The Unsexy Stack, TraceForge) plus selected client work; Alex is seeking steady remote work with a team.
- _HSS title (Gemini wants "Systems Engineer"):_ REJECTED — truthfulness and byte-for-byte consistency with the shipped resume PDFs and LinkedIn outrank ATS title optimization; variant headlines already handle ATS matching.
- _PDF parity (Codex generator+tests vs Gemini "over-engineering"):_ light middle — committed PDF + a small vitest parity test (pdf-parse devDep) asserting name/titles/dates from `src/data/resume.ts` appear in the PDF text. No build-time generator.
- _Person.award (Codex remove vs Gemini keep):_ move the two verified metrics onto their project entities; drop the rest and the self-declared credential. Costs nothing, satisfies both.

**v2 decisions (all release-forks resolved).**

1. W1 becomes a **claim ledger**: enumerate first-person biographical/outcome claims contextually across src/, content/, public/, scripts; allowlist non-biographical uses (e.g. "senior (6+ years)" in a hiring-advice post, "$2M+ ARR" in a newsletter anecdote about a third party); fix invented first-person experience (`content/blog/ai-assisted-development-guide.mdx`) and pSEO semantic variants ("Helped close $15M+", "Saved investors $5M+" in `src/data/pseo/pages.ts`).
2. New W8: **chatbot rewrite** — truthful bio, no prices, no "answer YES by default", availability framing consistent with /about.
3. New W9: **static identity assets** — new versioned OG image (generated, "Alex Mayhew — Technology Specialist"), all references updated; `site.webmanifest`; `public/email-signature.html`.
4. Schema: hasOccupation lives on Person (Role array; self-employed from Jan 2026 as individual, LLC association only from 2026-03-30); one business identity (ProfessionalService scoped to /services route, global graph = Person + WebSite; org node minimal); ProfilePage on /resume (and align the existing /about ProfilePage to the same mainEntity).
5. VoiceKeep: `/tools/voice-cloner` redirect retargeted internally to the case study (justified exception: current target dies soon); case-study CTA "Try VoiceKeep" → honest archived framing; metrics kept only where code-verified and narratable.
6. Qualifier consistency: "~200 residential PV systems" everywhere (never "200+").
7. Smoke test asserts Content-Type text/html + unique resume marker string + absence of challenge-page signatures, with agent UAs.
8. Tests updated test-first for: home-page, json-ld, services-price-anchors (deleted/replaced), navigation unit+e2e, role-json-ld ×2, for-hub-page, a11y, any GitHub-URL assertions.
9. GitHub-handle sweep adds: `use-platform.ts`, `tools/pilot/page.tsx`, `download-buttons.tsx`, `tools/traceforge/page.tsx`, terminal, + their tests.
10. Metadata surfaces added to scope: `contact/page.tsx`, `newsletter/page.tsx`, `services/page.tsx`, `for/page.tsx`, `about/page.tsx` (existing ProfilePage + stale metadata), role/technology JSON-LD components, feed.xml.
11. `ai.txt` authorship line → "human-reviewed and edited".
12. Sitemap: per-route accurate dates; bump `updatedAt` frontmatter only on materially edited posts.
13. Release gate (PR checklist): Alex updates LinkedIn from `linkedin-profile-text.md` BEFORE merge; GitHub/X/Bluesky/dev.to bios checked for the old title.
14. Follow-up beads (not this PR): full semantic audit of 73 posts; pSEO consolidation (GSC-driven); external-AI-index refresh monitoring; Cloudflare dashboard verification screenshot; failing "Publish Scheduled Blog Posts" workflow; NDA case study.
