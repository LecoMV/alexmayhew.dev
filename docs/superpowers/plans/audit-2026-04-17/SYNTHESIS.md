# Site Audit #2 Synthesis — 2026-04-17

8 parallel audit agents: SEO, schema, performance, security, accessibility, design system, code quality, analytics. Post-Wave J baseline.

## Top-line: site is in strong shape

- 0 shipping-blocking P0s in SEO/security/code/analytics
- 0 lint errors, 29 warnings (from 115)
- 1804/1804 tests green
- WCAG 2.1 AA ~90%
- Core Web Vitals instrumented correctly (INP-aware)
- Next 15.5.15, React 19.2.4, OpenNext 1.18.0

## The 3 highest-impact issues (from all 8 audits)

### 1. Rate limiter is effectively OFF in production (Security P1)

`wrangler.jsonc` may not declare `RATE_LIMITER_CONTACT` / `RATE_LIMITER_NEWSLETTER` bindings. Silent catch-block fallthrough → contact, newsletter, quiz are all open. **Verify before shipping anything else.**

### 2. Shared JS chunk is 35 KB over budget on every page (Performance P0)

`1440-*.js` = 122 KB gzipped sitewide. Primary suspect: `@sentry/nextjs` client SDK. Most routes are 240-289 KB First Load; target is 180 KB. Biggest outlier: `/technologies/[slug]` at 289 KB (45% over).

### 3. SSG pages bypass edge HTML cache (Performance P1)

All `/blog/*`, `/services/*`, `/technologies/*` serve `cache-control: private, no-cache, no-store` despite being `(●) SSG` in build output. TTFB loses 150-300ms per cache miss that should've been a hit.

---

## Wave K execution plan (ordered by leverage × risk)

### K1 — Critical verification (P0 security)

- **K1.1** Verify `RATE_LIMITER_*` bindings declared in `wrangler.jsonc`; test rate-limit hits a 429 in prod, not the silent fallthrough. If missing, add bindings + redeploy.

### K2 — Performance wins (biggest user impact)

- **K2.1** Audit Sentry client config in `next.config.mjs:71`; disable `autoInstrumentClient` or switch to manual `init` with minimal integrations. Target: drop `1440-*.js` chunk from 122 KB to <60 KB.
- **K2.2** Split `technology-page-content.tsx` into RSC shell + motion island (~60-80 KB savings on /technologies/[slug]).
- **K2.3** Split `home-page.tsx` into RSC shell + motion island (LCP 200-400ms win).
- **K2.4** Add Cloudflare Cache Rules for `/blog/*`, `/services/*`, `/technologies/*`, `/for/*`: Cache-Everything, Edge TTL 1h, Browser TTL 5min.
- **K2.5** Enable React Compiler: `experimental: { reactCompiler: true }` in `next.config.mjs`.
- **K2.6** Add `preconnect` hints for GA, Cloudflare beacon, Turnstile, Sentry in `layout.tsx:152`.
- **K2.7** Add AVIF to `next.config.mjs`: `images.formats: ['image/avif', 'image/webp']`.
- **K2.8** Switch fonts from `display: "optional"` to `display: "swap"`.
- **K2.9** Lazy-load Turnstile via `dynamic(ssr: false)` (saves ~15 KB on /contact).

### K3 — SEO depth (discovery + rich results)

- **K3.1** **Decision needed:** flip migrations/integrations/comparisons from `noindex` → `index` to unlock ~20+ quality-gated pages. Currently orphaned given near-zero DR.
- **K3.2** Fix `maximumScale: 5` → remove or 10 (`layout.tsx:46-47`). A11y + mobile-UX ranking signal.
- **K3.3** Add sitemap `images` field to pSEO services, role pages, case studies, technology pages.
- **K3.4** Switch pSEO `lastModified` from `siteLastUpdated` (build timestamp) to per-page `lastUpdated` or stable date.
- **K3.5** Add Twitter card to contact page (`src/app/contact/page.tsx`).
- **K3.6** Fix blog `changeFrequency: "weekly"` → `"monthly"` (matches actual cadence).
- **K3.7** Remove `priceRange: "$$$$"` from ConsultingService schema (ignored non-enum).

### K4 — Schema rich results (AEO/GEO leverage)

- **K4.1** Consolidate all JSON-LD per page into single `@graph` array (4-5 blocks today → 1).
- **K4.2** SoftwareApplication: add `offers.availability: "InStock"`, `publisher: ORG_REF`, `sameAs: [github URL]`, `@id`, and `codeRepository` + `programmingLanguage` for TraceForge/Pilot.
- **K4.3** Case studies: `CreativeWork` → `TechArticle` with real `datePublished`, `dateModified`, `image`, `mainEntityOfPage`.
- **K4.4** ArticleJsonLd: add `wordCount` + `timeRequired` (reading time already in data).
- **K4.5** Newsletter: `"@type": "NewsletterIssue"` + `isPartOf: Periodical`.
- **K4.6** WebSite: add `potentialAction: SearchAction` → unlocks SERP sitelinks searchbox.
- **K4.7** Organization: add `knowsAbout`, `description`, `areaServed`, `foundingDate`.
- **K4.8** Person.sameAs: add Stack Overflow, Dev.to (pending cross-posting).
- **K4.9** Breadcrumbs on `/about`, `/contact`, `/work` hub, `/tools` hub, `/technologies` hub, `/for/[role]`.

### K5 — Accessibility WCAG 2.2

- **K5.1** Fix h1→h3 heading jumps on `/privacy`, `/terms`, `/about`, `/contact`, `/tools`.
- **K5.2** Replace command palette backdrop `<div onClick>` with `<button aria-label="Close search">` or remove handler (Escape works).
- **K5.3** Add focus trap to chat widget + command palette modals.
- **K5.4** Link contact form inputs to error via `aria-invalid` + `aria-describedby`.
- **K5.5** Add `role="status"` to contact success message.
- **K5.6** Fix cookie consent X button: `aria-label="Decline and close"`.
- **K5.7** Add `aria-hidden` to decorative pulse dots in `navigation.tsx:354,408,436`.
- **K5.8** Raise `text-slate-text/60` → `/80` in `footer.tsx`, `newsletter-signup.tsx` (fails 4.5:1 contrast).
- **K5.9** Add `tabIndex={-1}` to `<main>` for proper skip-link focus.

### K6 — Design system compliance

- **K6.1** `src/components/ui/command-palette.tsx:80` — `bg-black/60` → `bg-void-navy/60`.
- **K6.2** `src/components/blog/layouts/terminal-layout.tsx:31` — `bg-red-500/60` → `bg-burnt-ember/60`.
- **K6.3** `src/components/blog/table-of-contents.tsx:29-33` — move raw TOC hexes to `@theme` tokens.
- **K6.4** Add to `globals.css @theme`: `--text-micro: 0.625rem`, `--text-nano: 0.5rem`, `--size-hero-min: 60vh`. Replace ~40 arbitrary-value hits.
- **K6.5** Bake `focus-visible:ring-2 focus-visible:ring-cyber-lime focus-visible:outline-none` into shared `<Button>` primitive. Fixes 30+ missing focus rings.
- **K6.6** Add `ease-out` to `transition-colors` hover states (~30 hits), or promote to Framer spring.

### K7 — Code quality (cleanup)

- **K7.1** Push client boundary down on `work-page.tsx`, `case-study-page.tsx`, `home-page.tsx`, `for-hub-page.tsx`, `technologies-page-content.tsx`, `role-page-content.tsx`, `services-page-content.tsx`, `service-page-content.tsx`.
- **K7.2** Remove `useEffect`+`window.location.href` in `blog-article.tsx:51-53`; pass URL from server.
- **K7.3** Fix case study non-null assertion — narrow at parent with `notFound()`.
- **K7.4** Add `loading.tsx` for `/blog`, `/services/[slug]`.
- **K7.5** Add `error.tsx` for `/blog`, `/services`, `/technologies`, `/for`, `/work`.
- **K7.6** Replace `formData.get() as string` with `Object.fromEntries` + Zod.
- **K7.7** Drop dead `raw as ContactFormValues` cast.
- **K7.8** Split `table-of-contents.tsx` (538 lines) into desktop + mobile.
- **K7.9** Extract `submitContactForm` helpers (rate-limit, bot-protection, email).
- **K7.10** Replace server action `console.*` with `logger` from `src/lib/logger.ts`.

### K8 — Analytics & CRO

- **K8.1** Add UTMs to all outbound links (footer, about, share buttons, any Gumroad anchors added).
- **K8.2** Client-wrap `not-found.tsx` + fire `trackEvent("page_not_found", {path})`.
- **K8.3** Install GA4 (`G-K4TLSRKMCV`) on Gumroad shop with `accept_incoming: true`.
- **K8.4** Fire native `sign_up` event for newsletter (in addition to custom).
- **K8.5** Add `social_click` tracking to footer/about social icons.
- **K8.6** Fix `user_engagement` double-fire in `use-content-analytics.ts:159`.

### K9 — Security tightening

- **K9.1** Set up CSP reporting endpoint (Worker route + R2 or Cloudflare Logs).
- **K9.2** Monitor CSP reports 24-72h.
- **K9.3** Drop `'unsafe-inline'` from fallback CSP in `custom-worker.ts` once reports confirm clean.

---

## Scope for user approval

Recommended Wave K batches (atomic commits, 1 deploy per batch):

| Batch                                  | Commits | Time | Risk                        |
| -------------------------------------- | ------- | ---- | --------------------------- |
| **K1** Security verify                 | 1       | 30m  | Low, read-only check        |
| **K2** Performance                     | 6-9     | 4-6h | Medium, bundle surgery      |
| **K3** SEO + K4 Schema                 | 10-15   | 3-4h | Low, additive               |
| **K5** A11y WCAG 2.2                   | 8-9     | 2-3h | Low, surgical               |
| **K6** Design tokens + focus primitive | 5-6     | 2h   | Low                         |
| **K7** Code quality                    | 8-10    | 4-5h | Medium, page splits         |
| **K8** Analytics                       | 4-6     | 1-2h | Low                         |
| **K9** CSP tightening                  | 3       | 2h   | Medium, requires monitoring |

**Total estimate:** 18-26h across 9 batches. Can ship K1+K2 today (security verify + perf wins), then K3+K4 next session (SEO depth), etc. Or batch K3+K4+K5+K6 into one large "SEO/schema/a11y/design" sweep given they're mostly additive/surgical.

After Wave K: TraceForge GPU email approval (task #58), then /work expansion (task #60).
