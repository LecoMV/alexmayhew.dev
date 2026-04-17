# Comprehensive Site Audit — alexmayhew.dev — 2026-04-16

**Status:** CURRENT
**Scope:** 12 parallel specialist audits covering every domain of the site
**Production SHA audited:** `c86c947`
**Auditor model:** Claude Opus 4.7 (1M context)

## Aggregate Counts

| Domain                      | CRITICAL | HIGH     | MEDIUM   | LOW              |
| --------------------------- | -------- | -------- | -------- | ---------------- |
| SEO                         | 6        | 14       | 13       | 9                |
| Schema / JSON-LD            | 1        | 7        | 11       | 6                |
| Performance                 | 4        | 5+       | —        | —                |
| Security                    | 0        | 3        | 7        | 6 (+5 INFO good) |
| Accessibility (WCAG 2.1 AA) | 12       | 19       | 18       | 8                |
| Design System               | 1        | 5        | 7        | 7                |
| Code Quality                | 2        | 10       | 16       | 12               |
| Analytics                   | 3        | 6        | 5        | 5                |
| DevOps / CI / Infra         | 5        | 11       | 14       | 9                |
| GEO / AEO                   | 5        | —        | —        | —                |
| Content / Voice             | 5        | 8        | 13       | 13               |
| pSEO                        | 5        | —        | —        | —                |
| UI/UX / CRO                 | 3        | 8        | 10       | 10               |
| **TOTAL (approx)**          | **52**   | **106+** | **114+** | **85+**          |

Detailed per-domain findings: `docs/research/agent-research/audit-2026-04-16-*.md`.

---

## Headline Story

The site is technically well-engineered (1,099 tests, 95% coverage, clean TypeScript, strong CSP, HSTS, proper schema @id graph, Consent Mode v2, all major AI crawlers allowed). **But there are nine structural failures that collectively are the reason indexing is stuck at 11/180 pages and conversion is effectively zero:**

1. **Preview deployments are 100% broken** — every Dependabot PR silently fails because `wrangler.jsonc` has no `env.preview` block.
2. **Server-side Sentry is a 6-line no-op** — Server Component and API route errors are invisible in production.
3. **Cloudflare rate limiters are a silent no-op** — `rate_limits` block in `wrangler.jsonc` uses an unrecognized schema; bindings may not exist at runtime.
4. **Static `/public/llms.txt` shadows the dynamic route** — Cloudflare serves stale 2026-03-15 content with broken links to AI crawlers.
5. **Blog articles have zero in-content related-posts** — hub-and-spoke architecture invisible to both Google and readers; highest-leverage single SEO fix on the site.
6. **Social proof is zero** — no testimonials, no logos, no author photo rendered anywhere. Biggest CRO ceiling.
7. **SaaS Scaling Quiz (the lead magnet) has zero tracking, zero email capture, missing from sitemap, no internal links** — fully broken funnel.
8. **h1/h2 inversion across 10+ page templates** — the 12px eyebrow label is the `<h1>`; the 60px title is the `<h2>`. WCAG 1.3.1 failure and confuses search ranking signals.
9. **"15+ years" (homepage) vs "Six years" (about page)** — trust-breaking contradiction visible within a single session.

Everything else is polish, hygiene, and compounding optimization on top of these.

---

## CRITICAL (P0) — Must Fix First

Grouped by shared surface so one PR can often resolve multiple.

### P0.1 — Infrastructure & Observability (DevOps C1-C5, Code C1, Security H-1)

| #   | Issue                                                                    | File                                                                  | Fix                                                                   |
| --- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Preview deploys 100% broken, Dependabot PRs fail                         | `wrangler.jsonc` (no env.preview), `.github/workflows/deploy.yml:113` | Add `env.preview` block or skip preview on missing secrets            |
| 2   | Scheduled-publish cron commits never trigger deploys                     | `.github/workflows/publish-scheduled.yml:26`                          | Use PAT/deploy key instead of `GITHUB_TOKEN`                          |
| 3   | Secret push races with deployment                                        | `.github/workflows/deploy.yml:180-196`                                | Push secrets before deploy; validate non-empty                        |
| 4   | `rate_limits` wrangler schema unrecognized — rate limiters may not exist | `wrangler.jsonc:61-77`                                                | Fix to 2026 wrangler schema or migrate to Workers rate-limit bindings |
| 5   | `next@15.5.14` unaddressed DoS CVE GHSA-q4gf-8mx6-v5v3                   | `package.json:53`                                                     | `npm i next@^15.5.15`                                                 |
| 6   | Server-side Sentry disabled (6-line no-op)                               | `src/instrumentation.ts`                                              | Implement `register()` with `@sentry/cloudflare` init                 |
| 7   | Static `/public/llms.txt` shadows dynamic route                          | `public/llms.txt`                                                     | Delete the static file                                                |
| 8   | `NEXT_PUBLIC_BUILD_TIME` not passed through build step                   | `.github/workflows/deploy.yml:53-60`                                  | Pass env to `opennextjs-cloudflare build`                             |

### P0.2 — SEO Blockers (SEO C1-C6, Schema C1)

| #   | Issue                                                                               | Fix                                                                    |
| --- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 9   | 36 newsletter issues are `status: "draft"` but rendered live and in sitemap         | Filter `status === "sent"` in sitemap, archive, `generateStaticParams` |
| 10  | `/og-traceforge.png`, `/og-pilot.png`, `/og-voice-cloner.png` 404                   | Switch to `/og?title=...` dynamic route                                |
| 11  | `/tools/saas-readiness` missing from sitemap                                        | Add to `src/app/sitemap.ts:70-94`                                      |
| 12  | **Blog articles have NO related-posts** — hub-spoke invisible                       | Wire `<RelatedBlogPostsSection/>` into `src/app/blog/[slug]/page.tsx`  |
| 13  | `/docs` 23-line stub indexed at priority 0.6                                        | Noindex + remove from sitemap until real docs exist                    |
| 14  | `/offline` and `/demo*` pages indexable with inherited default metadata             | Export noindex metadata; add `/offline` to robots disallow             |
| 15  | Schema `WEBSITE_REF` broken on `/technologies` — `${siteUrl}#website` missing slash | `src/app/technologies/page.tsx:64` → use `WEBSITE_REF`                 |

### P0.3 — Accessibility (A11y C1-C12)

| #   | Issue                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16  | h1/h2 inversion on services, services/[slug], technologies, technologies/[slug], for, for/[role], newsletter, demo — **10+ templates**                      |
| 17  | h1 → h3 skip on work, tools, blog-list, about                                                                                                               |
| 18  | Traceforge upload dropzone — `<m.div onClick>` with no `role`, `tabIndex`, or keyboard handler — keyboard users cannot upload                               |
| 19  | Chat widget — no Escape-to-close, no focus trap, no input label, no aria-live on feed                                                                       |
| 20  | `placeholder:text-white/30` on contact + chat → ~2.6:1 contrast (fails AA 4.5:1)                                                                            |
| 21  | Navigation (12 interactive elements) + footer (14 links) missing explicit `focus-visible:ring-2 focus-visible:ring-cyber-lime` (global fallback is fragile) |

### P0.4 — Conversion Blockers (UIUX C1-C3, Content C1-C3, Analytics C1-C2)

| #   | Issue                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------- |
| 22  | Zero social proof anywhere — no testimonials, no logos, no named metric attribution                                    |
| 23  | No author photo rendered anywhere on the site                                                                          |
| 24  | Homepage says "15+ years", About says "Six years" — same-session contradiction                                         |
| 25  | SaaS Scaling Quiz has zero analytics events — funnel invisible                                                         |
| 26  | Quiz page `/tools/saas-readiness` verified unknown to Google (URL Inspection verdict: never crawled)                   |
| 27  | Contact form `generate_lead` hardcodes `project_type/budget/referral_source = "unknown"` — discards actual form values |

### P0.5 — Performance (Performance C1-C4)

| #   | Issue                                                                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 28  | Sentry Session Replay 38 kB gzip on every page for a 10%-sampled feature — lazy-load via `Sentry.lazyLoadIntegration()`                        |
| 29  | pSEO chunk split **did not land** — chunk 9925 (62 kB gzip) on every /services and /technologies route. `/services/[slug]` = 351 kB First Load |
| 30  | "SVG" logo is 114 kB base64-encoded PNG, preloaded on every page, displayed 52×32                                                              |
| 31  | Lenis smooth-scroll on every route — ~25 kB gzip + hijacks native scroll, 30–120ms INP hit on mobile                                           |

### P0.6 — Content Integrity (Content C4-C5, pSEO C1-C3)

| #   | Issue                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 32  | Double-dash `--` violations in every hub-post Key Takeaway block (12 posts)                                                                                                           |
| 33  | 5 published pSEO pages silently violate own 150-word minimums (fractional-cto, technical-due-diligence, legacy-migration, performance-optimization, postgresql-developer-for-fintech) |
| 34  | 12 of 19 slugs in `TOPIC_CLUSTERS` (`src/data/pseo/types.ts:390-447`) point to pages that don't exist                                                                                 |
| 35  | 13 `relatedServices` orphan links silently dropped at render                                                                                                                          |

### P0.7 — Design & GEO (Design C1, GEO C1-C5)

| #   | Issue                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 36  | Command palette modal backdrop `bg-black/60` (design system forbids pure black)                                                       |
| 37  | No visible "By Alex Mayhew" byline on blog articles — kills primary E-E-A-T extraction signal                                         |
| 38  | No `/llms-full.txt` route (404) — missing the high-leverage GEO artifact Perplexity/ClaudeBot prefer                                  |
| 39  | Person schema missing E-E-A-T fields: `hasCredential`, `alumniOf`, `memberOf`, `knowsLanguage`                                        |
| 40  | BreadcrumbList only on /blog and /newsletter — absent from /about, /work, /work/[slug], /tools, /technologies, /for/[role], /services |

---

## HIGH (P1) — Significant Impact, Next Sprint

Consolidated from per-domain reports. Full detail in source files.

### SEO/Schema (21 findings)

- 40+ blog descriptions exceed 180 chars (trigger SERP truncation)
- 6+ blog titles exceed 60 chars
- `llms.txt` slice-caps spoke posts at 20 (hides 49 articles)
- Only 14/65 blog posts have FAQPage schema
- Zero JSON-LD on /work, /tools, /newsletter, /docs, /tools/saas-readiness hubs
- ArticleJsonLd never receives `series` prop — hub-spoke invisible to schema
- Organization `worksFor` inline instead of `ORG_REF`
- Twitter `creator` missing on 11+ hub pages
- `LocalBusinessJsonLd` dead no-op stub still imported in layout
- Sitemap over-declares priority ≥0.85 on 12+ pages (flattens signal)

### Security (3 HIGH)

- Test-only DI hooks (`__setDependencies`, `__resetDependencies`) shipped as callable Server Actions on contact + newsletter — remove from `"use server"` modules
- Newsletter signup has no Turnstile — enables email-bombing
- `next@15.5.15` patch required (also listed P0)

### Performance (5+)

- Chat widget (react-markdown + sugar-high + remark-gfm) 83 kB gzip in shared chunk — always loaded
- `/_next/image` returns no `Cache-Control` header
- Home, services, about, work are entirely `"use client"` — losing RSC benefits
- Blog featured images 1919×1071 for 900px display; several >250 kB
- Full 133-item search index inlined in every page HTML (~25 kB/page)

### A11y (19 HIGH)

- Decorative `●` bullets not aria-hidden — read as "black circle" before 20+ headings
- Chat widget + dropzone keyboard blockers extend to multiple Traceforge controls
- 3 interactive `<div>` elements lack button semantics

### Design (5 HIGH)

- 5 bare `transition={{ delay }}` regressions missing spring spec
- 4 inline spring literals bypassing motion-constants tokens
- Off-palette color creep: `amber-400`, `blue-400`, `green-400`, `yellow-400`, `text-purple-400` in 20+ locations (forms a de facto 7th palette)
- `bg-green-500` on footer status dot should be `bg-cyber-lime`
- Newsletter signup success variant missing CornerBrackets pattern

### Code Quality (10 HIGH)

- 11 bare `catch` blocks silently swallowing errors (middleware, chat, og, cookie-consent)
- 4 pSEO page-content files 787-938 lines — 3,400 lines → ~1,200 with component extraction
- 10 page-content components `'use client'` purely for animation + tracking — split into Server/Client islands
- Contact form uses `document.getElementById` + 3 `as HTMLInputElement` casts to pipe Turnstile token — use `useState`
- 7 external API responses not Zod-validated (Listmonk, Resend, Vectorizer, Geo, Chat)
- Sentry missing `setUser` + release tracking
- `useEffect` state mutations in contact + newsletter forms
- No `React.cache()` across `generateStaticParams → generateMetadata → default`
- Inline consent-mode script forces `script-src 'unsafe-inline'`
- `src/data/pseo/pages.ts` 3,419 lines; siblings 2008/1878/1638/1455

### Analytics (6 HIGH)

- No Gumroad cross-domain linker for shop.alexmayhew.dev
- No email capture on quiz results screen (lead magnet funnel incomplete)
- Scroll-depth events send for every blog post at every threshold (overcounts engagement)
- Blog chat interactions not tracked
- Newsletter attribution stops at platform level (no medium/content dimensions)

### Content/Voice (8 HIGH)

- Homepage 280 visible words (target 500+)
- 3 orphan blog posts (`typescript-business-case`, `ai-assisted-development-reality`, `hello-world`) outside hub-spoke
- 3 posts below 4-link internal-link floor
- Generic contact success copy, no lead-magnet cross-sell
- Hero buries "$500K mistakes" tagline from VOICE_GUIDE
- No `sameAs` links on About for E-E-A-T
- No contrarian pillar on About

### DevOps (11 HIGH — abridged)

- CLAUDE.md documents stale pinned versions (says 15.5.9 + opennext 1.14; reality 15.5.14 + 1.18)
- Health endpoint `buildTime` resets every request
- Dependabot config groups may trigger on security updates
- No E2E smoke test running against production after deploy

### UI/UX (8 HIGH)

- Code-syntax CTAs (`START_CONVERSATION()`, `TRANSMIT_MESSAGE()`) cognitively taxing
- Contact: 6 required fields, no quick path
- Nav "Book a Call" CTA `lg:block`-only (invisible on mobile)
- No price anchors for self-qualification
- Internal pages cramped vs homepage hero

---

## Prior-Fix Verification

| Claim                                    | Verified                                                           |
| ---------------------------------------- | ------------------------------------------------------------------ |
| cmdk lazy-loaded                         | ✅ Shipped (`lazy-command-palette.tsx:8`)                          |
| LazyMotion + `reducedMotion="user"`      | ✅ Shipped (40+ files use `m.` prefix)                             |
| Consent Mode v2 region-specific defaults | ✅ Shipped                                                         |
| karpeslop pinned                         | ✅ Pinned to `1.0.25`                                              |
| Spring transitions                       | ⚠️ 35 landed; 5 new regressions found                              |
| `max-w-container` token                  | ✅ Landed as `max-w-content`, 32 consumers                         |
| Zero em dashes in content                | ✅ Verified (was ~500 violations)                                  |
| Contact "Not sure yet" budget option     | ✅ Present                                                         |
| pSEO chunk split                         | ❌ **NOT shipped** — still a 62 kB barrel                          |
| Focus-visible rings added                | ⚠️ Global fallback works; explicit classes missing on nav + footer |
| OpenNext SSRF fix (1.14→1.18)            | ✅ Upgraded + `global_fetch_strictly_public` compat flag set       |

---

## Recommended Execution Plan

### Sprint 1 (1 week) — "Stop the Bleeding"

PR-A: **Infra+Obs** (2 days)

- Fix preview deploys (wrangler.jsonc env.preview)
- Fix scheduled-publish deploy trigger (PAT)
- Fix secret push race (order + validation)
- Wire `@sentry/cloudflare` in instrumentation.ts
- Upgrade `next@^15.5.15`
- Delete `public/llms.txt`
- Fix `rate_limits` schema

PR-B: **Critical SEO** (1 day)

- Filter newsletter `status !== "sent"` from sitemap + archive + params
- Add `/tools/saas-readiness` to sitemap
- Replace missing `/og-*.png` references with `/og?title=...`
- Noindex `/docs`, `/offline`, `/demo*`
- Fix WEBSITE_REF on /technologies

PR-C: **A11y h1/h2** (1 day)

- Swap h1/h2 inversion across 10+ templates (mechanical)
- Wire keyboard on Traceforge dropzone
- Fix chat widget focus trap, Escape, aria-live
- Raise placeholder contrast to meet AA

### Sprint 2 (1-2 weeks) — "Unlock Conversion"

PR-D: **RelatedBlogPostsSection to BlogArticle** (2-4 hrs) — biggest single SEO lift
PR-E: **Social proof + author byline** — even 3 client testimonials + photo
PR-F: **Quiz instrumentation + sitemap + homepage CTA + email capture**
PR-G: **Fix "15+ years vs Six years"** — pick one, propagate
PR-H: **Contact form `generate_lead` reads real values**

### Sprint 3 (2 weeks) — "Performance & Polish"

PR-I: **Sentry Replay lazy-load + replay masking** (one PR, small)
PR-J: **pSEO chunk split — this time verify it ships** (bundle analyzer gate in CI)
PR-K: **Replace 114KB base64 "SVG" logo with real SVG**
PR-L: **Scope Lenis smooth-scroll to marketing pages only**
PR-M: **Server-componentize 10 page-content files**

### Sprint 4 (ongoing) — "Hub-Spoke + E-E-A-T"

- Fix 12 broken TOPIC_CLUSTERS slugs
- 13 orphan relatedServices links
- Extend FAQPage schema from 14/65 to 65/65 via auto-gen
- Add `series` prop to ArticleJsonLd
- Enrich Person schema with credentials/alumniOf
- Create `/llms-full.txt` and `/glossary`
- Backlink outreach (the underlying indexing bottleneck)

---

## Source Reports

All retained for implementer handoff:

- `docs/research/agent-research/audit-2026-04-16-seo.md`
- `docs/research/agent-research/audit-2026-04-16-schema.md`
- `docs/research/agent-research/audit-2026-04-16-performance.md`
- `docs/research/agent-research/audit-2026-04-16-a11y.md`
- `docs/research/agent-research/audit-2026-04-16-design.md`
- `docs/research/agent-research/audit-2026-04-16-code.md`
- `docs/research/agent-research/audit-2026-04-16-analytics.md`
- `docs/research/agent-research/audit-2026-04-16-devops.md`
- `docs/research/agent-research/audit-2026-04-16-geo-aeo.md`
- `docs/research/agent-research/audit-2026-04-16-content.md`
- `docs/research/agent-research/audit-2026-04-16-pseo.md`
- `docs/research/agent-research/audit-2026-04-16-uiux.md`
- Security findings: `.claude/agent-memory/security-auditor/project_audit_2026-04-16.md` (path-blocked from docs/research)

---

## Net Assessment

**Engineering quality: A-** (strict TypeScript, 95% coverage, solid CSP/HSTS, React 19 idioms, correct OpenNext 1.18 + SSRF hardening, proper schema @id graph, AI crawler allow-list best-in-class for 2026).

**Shipping quality: C+** — the gap between what the codebase claims to do and what's actually running in production is the real finding. Preview deploys are broken. Rate limiters may not exist. Sentry server is a no-op. pSEO split didn't land. Sentry replay records unmasked PII despite comments saying otherwise. `/public/llms.txt` shadows the dynamic route. Health endpoint's buildTime resets on every request.

**Marketing/CRO quality: D** — zero social proof, no author photo, contradictory experience claims, lead magnet unreachable and untracked, blog hub-spoke exists architecturally but is invisible to readers and Google.

The **highest-leverage single week of work** is PR-A through PR-C above. They unblock everything downstream.
