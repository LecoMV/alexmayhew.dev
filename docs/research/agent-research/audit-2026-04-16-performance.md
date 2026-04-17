# Performance Audit — alexmayhew.dev — 2026-04-16

**Auditor:** performance-auditor (agent)
**Scope:** Full performance audit — bundle sizes, CWV risks, caching, scripts, images, fonts, OpenNext/Cloudflare config.
**Build verified locally:** Next.js 15.5.14, Node commit `c86c947`, 197 static pages generated.
**Production verified via curl:** cache headers, chunk sizes, HTML payloads.

---

## Headline Numbers

| Measurement                                                         | Value                                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| First Load JS shared by all                                         | **218 kB** gzip                                                                                   |
| Largest shared chunk (1083 — Next.js + Sentry client runtime)       | 401 kB raw / **123 kB gzip**                                                                      |
| Sentry Session Replay shared chunk (52774a7f)                       | 121 kB raw / **38 kB gzip** — shipped to EVERY page                                               |
| pSEO data chunk (9925)                                              | 198 kB raw / **62 kB gzip** — loaded on every /services, /technologies, service detail page       |
| Worst route First Load JS (`/services/[slug]`)                      | **351 kB** gzip                                                                                   |
| Home HTML payload                                                   | 132 kB raw / 32 kB gzip (includes full search index serialization — 133 items)                    |
| Main CSS (b28b258e...css)                                           | 120 kB raw / **20 kB gzip**                                                                       |
| Logo "SVG" (`/am-icon-optimized_sized.svg`) preloaded on every page | **114 kB** — actually a 1024×1024 PNG base64-encoded inside an SVG wrapper, displayed at 52×32 px |
| Fonts (woff2) — Inter + JetBrains Mono                              | 73 kB + 40 kB, self-hosted, `display: optional`, both preloaded                                   |
| Blog featured images (typical)                                      | 1919×1071 webp, 63 kB – 325 kB each (74 images, 11 MB total)                                      |

---

## CRITICAL

### C1 — Sentry Session Replay ships to every user on every page (~38 kB gzip, ~121 kB parse)

- **Evidence:** `sentry.client.config.ts:42` calls `Sentry.replayIntegration()` inside `Sentry.init`. Build output shows chunk `52774a7f-af6ab8057d566766.js` in "First Load JS shared by all" (38.2 kB). I confirmed its contents: webpack chunk id `[4850]`, exports `sentryReplaySession`, pulls in `rrweb` (MutationObserver internals, style-sheet serialization, etc.).
- **Impact:** Every visitor pays ~38 kB gzip / ~121 kB parse + main-thread for a feature that only fires on 10 % of sessions (`replaysSessionSampleRate: 0.1`). This is the single biggest initial-bundle lever on the site.
- **Fix:**
  - Move replay behind `Sentry.lazyLoadIntegration("replayIntegration")` (Sentry JS v8 API) or gate with `Sentry.feedbackIntegration` pattern — loads only when sampled.
  - Or move `Sentry.init` out of the `sentry.client.config.ts` eager path entirely and initialize via `instrumentation-client.ts` with `lazyLoadIntegration`.
  - Expected saving: **~38 kB gzip off every route's First Load JS** (218 kB → ~180 kB). LCP improvement 100–250 ms on slow 4G.
- **File:** `sentry.client.config.ts:36-48`.

### C2 — pSEO data (9925) loaded on every /services and /technologies route (62 kB gzip)

- **Evidence:** Build output shows `/services → 335 kB`, `/services/[slug] → 351 kB`, `/technologies → 259 kB`, `/technologies/[slug] → 325 kB` — all 100+ kB above baseline. Chunk `9925-5b68ad86589ef9e4.js` (198 kB raw / 62 kB gzip) contains strings `fintech` (57×), `healthcare` (49×), `nextjs-developer`, `stripe`, and Zod schema calls (`Ikc(`, 9×). HTML source for `/services` confirms: `_next/static/chunks/9925-...js` and `3674-...js` (Zod, 25 kB gzip) both loaded.
- **Root cause:** `src/app/services/services-page-content.tsx:1` is `"use client"` and imports `{ INDUSTRY_LABELS, TECHNOLOGY_LABELS } from "@/data/pseo"`. The barrel file `src/data/pseo/index.ts` re-exports everything (industries, pages, migrations, integrations, comparisons, Zod validation). Tree-shaking the barrel across an RSC/client boundary doesn't eliminate transitive imports when the same data file also ships `pseoPages`, `migrationPages`, etc. The previously-shipped "split" only moved types/constants into separate files; runtime data still imports through `index.ts`.
- **Impact:** Service landing and detail pages (major pSEO SEO surface) are 52–60 % larger than they should be. `/services/[slug] → 351 kB` is **161 % of the homepage** despite being content-equivalent.
- **Fix:**
  1. Drop the `"use client"` directive from `services-page-content.tsx` and its siblings (they don't need browser APIs outside the few Framer Motion wrappers — split those into small `"use client"` leaves).
  2. Or: import `INDUSTRY_LABELS` / `TECHNOLOGY_LABELS` from their own files directly, not via `@/data/pseo` barrel.
  3. Move Zod validation schemas out of runtime bundle — they're only needed at build time (quality gates). `export` from a separate `validation-build.ts` not reachable from runtime code.
- **Files:** `src/data/pseo/index.ts:1-176`, `src/app/services/services-page-content.tsx:1`, `src/app/services/[slug]/service-page-content.tsx:1`.
- **Expected saving:** service/technology routes drop **60–90 kB gzip** in First Load JS.

### C3 — Logo on every page is a 114 kB PNG-in-SVG, preloaded with `priority`

- **Evidence:** `src/components/ui/navigation.tsx:135-143` renders `<Image src="/am-icon-optimized_sized.svg" width={52} height={32} priority />`. The file `public/am-icon-optimized_sized.svg` is 114 402 bytes. `file` reports "SVG Scalable Vector Graphics image" but `head -c 500` shows `<image ... href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAf...` — it's a **1024×1024 raster PNG base64-encoded inside an SVG wrapper**.
- **HTML confirms:** `<link rel="preload" as="image" href="/am-icon-optimized_sized.svg"/>` is injected into every page's `<head>` (via `priority` flag), competing with the font preloads and the LCP candidate for connection slots.
- **Impact:** 114 kB raw / 82 kB brotli — for a navbar logo displayed at 52×32 px. This is ~30× larger than a genuine vector SVG (~3 kB) and ~20× larger than an appropriately-sized 104×64 WebP. Preloading it adds bandwidth pressure on LCP-critical requests.
- **Fix:** re-export the logo as a true vector SVG (Inkscape → "Save as Plain SVG" or Illustrator "Export for Web → SVG") — target 2–5 kB. Re-generate favicon (currently the same 114 kB file).
- **Files:** `public/am-icon-optimized_sized.svg` (114 kB), `public/favicon.svg` (114 kB — identical inode risk), `src/components/ui/navigation.tsx:135-143`.
- **Expected saving:** ~110 kB off initial download on every page; removes a competing `preload` request on the critical path.

### C4 — Smooth-scroll (Lenis) runs on every page + blocks scroll-driven INP

- **Evidence:** `src/components/providers/smooth-scroll.tsx:6-36` mounts `new Lenis({...})` in the root layout. Lenis is in chunk 7740 (268 kB raw / 83 kB gzip, shared across most interactive routes). Lenis hijacks the native scroll and runs a `requestAnimationFrame` loop forever.
- **Impact:**
  - INP risk: every wheel / touch event is routed through a JS main-thread animation loop. On mid-range Android, Lenis commonly adds 30–120 ms to INP p75.
  - Blocks the scroll-linked animations optimization in Chromium — native `ScrollTimeline` cannot be used.
  - The `prefers-reduced-motion` check bails out but there's no "disable on mobile" or "disable on slow device" fallback.
- **Fix:**
  - Option A (recommended): Remove Lenis. Use CSS `scroll-behavior: smooth` + native `overscroll-behavior`. Saves ~30 kB gzip off the shared chunk and reduces INP.
  - Option B: Move Lenis behind a dynamic import gated on viewport width and `navigator.connection.effectiveType === "4g"`.
- **File:** `src/components/providers/smooth-scroll.tsx:3-38`.

---

## HIGH

### H1 — Chat widget (react-markdown + sugar-high + remark-gfm) bundled on every page via chunk 7740

- **Evidence:** `ChatWidget` is `dynamic()`-imported in `src/app/layout.tsx:30`, but its tree is bundled into chunk 7740 (268 kB raw / 83 kB gzip) alongside Framer Motion `domMax`, Lenis, and micromark. `src/components/chat/chat-markdown.tsx:3-5` imports `react-markdown`, `remark-gfm`, `sugar-high` — pulled in even though chat is closed on page load.
- **Impact:** Chunk 7740 is the largest runtime chunk. It's marked async but still downloads on idle during `onLoad`, contributing to CPU / battery / data on every visitor who never clicks the chat bubble (almost all of them).
- **Fix:**
  - Split the chat-widget trigger button (zero-dep lucide icon + useState) from the chat panel, and only dynamic-import the panel when the user opens the chat. This is the typical "two-stage" pattern.
  - Replace `react-markdown + remark-gfm + sugar-high` with a lighter markdown parser or render-on-server (stream tokens from API, apply formatting with a 1 kB regex-based renderer). `sugar-high` alone adds ~5 kB gzip.
- **File:** `src/components/chat/chat-widget.tsx:3-10`, `src/components/chat/chat-markdown.tsx:1-10`.
- **Expected saving:** 15–25 kB gzip off shared interactive chunk.

### H2 — Home page and service pages are entirely `"use client"` — no RSC

- **Evidence:** `src/app/home-page.tsx:1` is `"use client"`. Every sub-section (Services, About, Featured Insights, Newsletter, CTA) is hydrated on the client. The only "server" work is URL routing. Same pattern in `src/app/services/services-page-content.tsx:1`, `src/app/services/[slug]/service-page-content.tsx:1`.
- **Impact:** React has to ship and run all component code to hydrate static content (no interactivity on 90 % of the home page). Next 15 + React 19 RSC can render 80 %+ of the homepage server-side, shipping zero JS for those sections. Current architecture fights the React 19 model.
- **Fix:** Keep only animated / interactive fragments as client components:
  - Split `home-page.tsx` into a server component shell + 3–4 small `<HeroAnimations />`, `<CTAButton />`, `<NewsletterSignup />` client leaves.
  - Same treatment for `/services`, `/services/[slug]`, `/about`, `/work`.
- **Impact estimate:** Reduces route-specific page chunk sizes by 40–60 % (e.g. `/services page` route-specific 12 kB → 4-5 kB), and — more importantly — avoids hydrating static content, improving INP.
- **File:** `src/app/home-page.tsx:1`.

### H3 — `/_next/image` optimizer returns no `Cache-Control` header

- **Evidence:** `curl -sI https://alexmayhew.dev/_next/image?url=%2Fimages%2Fblog%2Fai-cost-optimization-featured.webp&w=640&q=75` returns `content-type: image/webp` with **no `cache-control` header**. Compare `/_next/static/chunks/1083-*.js` which returns `cache-control: public, max-age=31536000, immutable`.
- **Impact:** Every visitor re-requests optimized image bytes (browser revalidates without long-lived cache). CF edge may cache by its default policy, but browser-level cache is wasted. Extra requests, longer LCP on return visits.
- **Root cause:** OpenNext's default image handler doesn't set `Cache-Control`. Next.js normally does via `images.minimumCacheTTL`, but OpenNext/Cloudflare's image route bypasses this.
- **Fix:** Add `next.config.mjs` → `images: { minimumCacheTTL: 31536000 }`, OR intercept `/_next/image` responses in `custom-worker.ts` and set `Cache-Control: public, max-age=31536000, immutable` (content-hashed by `?url=&w=&q=` so safe to set immutable).
- **File:** `custom-worker.ts:39-64` (add before returning response), `next.config.mjs:21` (missing `images` block).

### H4 — Blog featured images are 1919×1071 WebPs (up to 325 kB) but max displayed width is 900 px

- **Evidence:** `file public/images/blog/*.webp` → "1919+1×1071+1". `src/components/blog/blog-article.tsx:177-184` uses `sizes="(max-width: 900px) 100vw, 900px"` — so displayed max is 900px. Several images exceed 200 kB: `ai-cost-optimization-featured.webp` 325 kB, `tech-stack-capital-allocation-featured.webp` 252 kB, `soc2-compliance-startup-roadmap-featured.webp` 237 kB, `anatomy-of-high-precision-saas-featured.webp` 246 kB.
- **Impact:** For the blog post route (LCP candidate image), even with `_next/image` optimization the source fetch is 100–300 kB and the optimizer needs to re-encode at runtime. Images stored at 2× the needed size waste storage and amplify cold-cache LCP.
- **Fix:** Re-export source masters at **1800×1013** (supports 2× retina at 900px container) and target ≤ 150 kB each using `cwebp -q 78 -m 6`. Saves 30–60 % per image.
- **Files:** `public/images/blog/*.webp` (74 files, 11 MB total).

### H5 — `/blog/[slug]` blog-list hub image has no `sizes` attribute

- **Evidence:** `src/components/blog/blog-list.tsx:135-140` — `<Image src={hub.data.image} alt={...} fill className="object-cover ..." />` — no `sizes` prop.
- **Impact:** next/image defaults to `sizes="100vw"`, which triggers the largest srcset candidate (3840 w) — downloading up to 320 kB per hub card when the card is ~400 px wide.
- **Fix:** Add `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"`.
- **File:** `src/components/blog/blog-list.tsx:135`.

### H6 — Search index (133 items) serialized into every page's HTML

- **Evidence:** `curl -s https://alexmayhew.dev/ | grep -oE '\"title\":\"[^"]+\"' | wc -l` → **133 items**. Items include full blog titles, service titles, technology slugs, migrations, integrations. HTML payload 132 kB raw / 32 kB gzip. `src/components/ui/command-palette-server.tsx:5` calls `buildSearchIndex()` (a server function) and passes the entire array as props to `<LazyCommandPalette items={items} />`.
- **Impact:** ~30 kB of the 32 kB gzipped HTML on every page is the search index. It's cached (ISR HIT) so repeat visits are OK, but first paint of a cold cache transfers full index for a feature 90 % of users never open.
- **Fix:**
  - Move search index into a JSON file served at `/search-index.json` with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`.
  - Fetch on first `Cmd+K` press (inside `LazyCommandPalette`). HTML drops ~25 kB gzip on every page.
  - Alternatively: ship a minimal index (titles + hrefs only, no descriptions) inline, load full index on demand.
- **Files:** `src/components/ui/command-palette-server.tsx:7`, `src/components/ui/lazy-command-palette.tsx:12-29`, `src/data/search-index.ts:1-166`.

### H7 — `experimental.optimizeCss` enabled without critters installed?

- **Evidence:** `next.config.mjs:34` has `optimizeCss: true`. `critters` (required dep) IS in `package.json:82` devDependencies. Good, but it needs to be in `dependencies` for Cloudflare Pages runtime — `experimental.optimizeCss` runs at build time so devDep is fine.
- **Confirm:** build did not warn "critters not found", so this is wired correctly.
- **No action needed** — flagged to confirm.

---

## MEDIUM

### M1 — Zod runs at runtime on /services routes (chunk 3674, 25 kB gzip)

- **Evidence:** Chunk `3674-06f5ca703c0837f6.js` contains `zod` (474 matches for the string). Loaded on `/services` (confirmed via HTML). Zod is used for pSEO quality-gate validation (`src/data/pseo/validation.ts`) — build-time only.
- **Impact:** 25 kB gzip shipped to every /services visitor for zero runtime benefit.
- **Fix:** Remove Zod re-exports from `src/data/pseo/index.ts` (lines 52-89), import from `src/data/pseo/validation.ts` only in the `scripts/generate-blog-index.ts` build script and any Node-only test code.
- **File:** `src/data/pseo/index.ts:51-89`.

### M2 — Sentry deprecation warnings in build log — `autoInstrument*` flags

- **Evidence:** Build log lines 14-16:
  ```
  [@sentry/nextjs] DEPRECATION WARNING: autoInstrumentServerFunctions is deprecated
  [@sentry/nextjs] DEPRECATION WARNING: autoInstrumentMiddleware is deprecated
  [@sentry/nextjs] DEPRECATION WARNING: autoInstrumentAppDirectory is deprecated
  ```
  Plus line 26: `Could not find 'onRequestError' hook in instrumentation file.` and line 27 recommending move from `sentry.client.config.ts` → `instrumentation-client.ts` for Turbopack compatibility.
- **Impact:** Will break on next Sentry major. Non-urgent, but schedule.
- **File:** `next.config.mjs:74-76` (rename to `webpack.autoInstrument*`), `sentry.client.config.ts` → migrate to `instrumentation-client.ts`.

### M3 — `/technologies` route ships 17.3 kB of page code — largest static page chunk

- **Evidence:** Build output: `○ /technologies 17.3 kB 259 kB`. Per-route chunk `app/technologies/page-d01503f450f781af.js` is 46 kB raw (largest app-chunk).
- **Investigation:** Without RSC split (see H2), the full technologies grid (7 tech cards × long descriptions) is shipped client-side.
- **Fix:** Split into server shell + small client animation wrappers. Expected saving: ~10 kB gzip.

### M4 — `/tools/traceforge` first-load 266 kB (22 kB page + 244 kB shared)

- **Evidence:** Page chunk 43 kB raw. Heavy Framer Motion animation + drag-drop upload zone.
- **Status:** Acceptable for a demo/tool route. No action unless this route gets significant traffic.

### M5 — Font preload competes with logo preload in `<head>`

- **Evidence:** `curl -s https://alexmayhew.dev/` — 4 preloads stacked in order:
  1. `inter-latin-var.woff2` (73 kB)
  2. `jetbrains-mono-latin-var.woff2` (40 kB)
  3. `/am-icon-optimized_sized.svg` (114 kB — see C3)
  4. `webpack-*.js` (script)
     Plus 2 external preload hints for GTM and CF Insights beacons.
- **Impact:** Browser connection slots (6 per HTTP/2 origin) saturate early, and the 114 kB "logo" consumes a slot that the LCP image should own.
- **Fix:** C3 (shrink logo). Also consider dropping `preload: true` on `jetbrainsMono` since monospace is secondary typography — use `display: optional` without preload to free one slot.
- **File:** `src/app/fonts.ts:29`.

### M6 — `display: optional` may cause FOUT-style text swap on slow connections

- **Evidence:** `src/app/fonts.ts:20, 28` both use `display: optional`. On slow 3G, if the font doesn't load within the ~100ms block period, system fallback is used _permanently_ for that page view.
- **Impact/trade-off:** Zero CLS (good), but brand typography silently degrades on slow networks. The previous rationale ("optimal for LCP") is correct — keeping this is defensible. Flagging for awareness.
- **Alternative:** `display: swap` is the conventional choice with appropriate fallback metric matching.

### M7 — Noise overlay uses CPU (backgrounds/CRT effect layer on every page)

- **Evidence:** `src/components/providers` → `NoiseOverlay` rendered in layout.tsx:159. Common pattern is a CSS `background-image` of an SVG noise — should be cheap, but some implementations use `<canvas>` animation.
- **Need to verify:** Not checked in detail.

### M8 — No `<link rel="dns-prefetch">` for external scripts

- **Evidence:** HTML includes preload for GTM and CF Insights but no `dns-prefetch` for `www.googletagmanager.com`, `static.cloudflareinsights.com`, `challenges.cloudflare.com` (Turnstile).
- **Fix:** Add `<link rel="dns-prefetch">` hints in `layout.tsx` head. Saves 50–150 ms on first connection to each third-party origin.

### M9 — Sentry `tracesSampleRate: 0.1` + `replaysSessionSampleRate: 0.1` = 10 % of all sessions send tracing + replay data

- **Evidence:** `sentry.client.config.ts:8, 10`. With moderate traffic this is meaningful network egress from user devices.
- **Impact:** Minor for performance, but relevant for INP (background fetch pressure) and Sentry quota.
- **Fix:** Reduce `tracesSampleRate` to 0.05 once you have enough volume. Keep replay at 0.1 for error sessions.

### M10 — Commented `console.log` removal is ON — but deprecated warnings still fire

- **Evidence:** `next.config.mjs:41` — `removeConsole: process.env.NODE_ENV === "production"`. Good.
- Deprecation warnings from `@sentry/nextjs` still appear because they're emitted during build, not runtime.

### M11 — pSEO page data file 212 kB source file will fail future tree-shaking

- **Evidence:** `src/data/pseo/pages.ts` = 212 kB source = ~3 641 lines of literal service page data.
- **Impact:** Any runtime code path that imports from `pseoPages` will pull the whole file. The content itself is not exported per-slug.
- **Fix:** Shard per slug: `src/data/pseo/pages/nextjs-developer-for-saas.ts`, etc. Build a lookup index. This enables dynamic `import("./pages/${slug}")` per route — drops runtime cost to ~5 kB per detail page.

---

## LOW

### L1 — `rate_limits` namespace names hardcoded

- `wrangler.jsonc:63-76` defines `RATE_LIMITER_CHAT`, `RATE_LIMITER_CONTACT`, `RATE_LIMITER_NEWSLETTER`. Fine; no perf impact.

### L2 — `observability.enabled: true` and `placement.mode: smart` both on

- `wrangler.jsonc:34, 85` — good. Cloudflare Smart Placement will reduce TTFB when Worker talks to origin services (Workers AI, R2). Verified in HTTP headers: `cf-placement: local-BOS`.

### L3 — R2 incremental cache working

- `open-next.config.ts:19-22` and production headers `x-nextjs-cache: HIT`, `etag`, `vary: rsc` all consistent with ISR working correctly.

### L4 — `/public/_headers` correctly sets immutable on static chunks, 1-week cache on images

- Verified via curl. Good config.

### L5 — HTTP/3 available

- Production response header: `alt-svc: h3=":443"; ma=86400`. Good.

### L6 — Polyfills chunk 113 kB raw / 40 kB gzip shipped to every page

- Modern browsers (target since `next@15` defaults) don't need most of these. Next.js auto-generates this — could be reduced by narrowing `browserslist` in `package.json`, but low priority.

### L7 — `critters` in devDependencies, not dependencies (OK but document)

- `package.json:82` — `experimental.optimizeCss` uses critters at build time, so devDep is correct. Pin to exact version to avoid CI surprises.

### L8 — Sentry source map upload disabled (`sourcemaps.disable: true`)

- `next.config.mjs:73`. Saves build time but means Sentry errors are minified. Trade-off accepted.

### L9 — `reactStrictMode: true` enabled, `poweredByHeader: false`

- `next.config.mjs:22-23`. Good.

### L10 — `experimental.optimizePackageImports: ["lucide-react", "framer-motion"]`

- `next.config.mjs:36`. Correctly configured. Verified: `motion.div` is not in chunks (only `m` via LazyMotion).

---

## Verification of Previously-Claimed Fixes

| Claim                                  | Status                   | Evidence                                                                                                                                                                                     |
| -------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmdk lazy-loaded (saves ~276 kB)       | **VERIFIED SHIPPED**     | `src/components/ui/lazy-command-palette.tsx:8` uses `dynamic(...)` with `ssr: false` and gates on `Cmd+K` event. `command-palette.tsx` not in initial chunks.                                |
| pSEO data split                        | **NOT SHIPPED** (see C2) | chunk 9925 still bundles full pSEO data on /services routes; 351 kB First Load JS.                                                                                                           |
| LazyMotion with `reducedMotion="user"` | **VERIFIED SHIPPED**     | `src/components/providers/motion.tsx:18-24` wraps with `LazyMotion features={domMax} strict` and `MotionConfig reducedMotion="user"`. All 40+ consumer files use `m.div` (not `motion.div`). |
| Consent Mode v2 (region-specific)      | **VERIFIED SHIPPED**     | `src/app/layout.tsx:150-154` inlines default-deny for 31 EEA+UK+CH codes, default-grant-analytics elsewhere.                                                                                 |

---

## Priority-Ordered Recommendations

| #   | Action                                                  | Effort | Saving (gzip First Load)                        | LCP / INP impact                    |
| --- | ------------------------------------------------------- | ------ | ----------------------------------------------- | ----------------------------------- |
| 1   | **C1** Lazy-load Sentry Replay                          | S      | **~38 kB** on every page                        | LCP −100 to −250 ms on slow 4G      |
| 2   | **C3** Shrink logo SVG from 114 kB → ~3 kB              | S      | ~80 kB (not in JS but in critical download)     | LCP candidate frees a preload slot  |
| 3   | **C2** Unbundle pSEO data from /services                | M      | **60–90 kB** on service/tech pages              | LCP/INP on highest-intent SEO pages |
| 4   | **H6** Move search index out of HTML                    | S      | ~25 kB off every HTML payload                   | TTFB + transfer time                |
| 5   | **H3** Set Cache-Control on `/_next/image`              | S      | Zero first-visit, but return-visit LCP −500 ms+ | Major for repeat visitors           |
| 6   | **C4** Remove Lenis smooth-scroll                       | S      | ~25 kB off chunk 7740                           | INP −30 to −100 ms on mobile        |
| 7   | **H2** Convert homepage/services to RSC shells          | L      | Variable, 20-50 kB per route                    | INP improvement (less hydration)    |
| 8   | **H1** Split chat widget trigger from panel             | M      | ~20 kB off shared 7740                          | Same                                |
| 9   | **H4/H5** Re-encode blog images 2× smaller, add `sizes` | M      | 100–200 kB per image load                       | LCP on blog posts                   |
| 10  | **M1** Remove Zod from pSEO runtime bundle              | S      | ~25 kB off /services                            | —                                   |

Total addressable reduction on First Load JS (shared-by-all): **218 kB → ~130–150 kB gzip** achievable.
Worst-case route (`/services/[slug]`): **351 kB → ~200 kB gzip**.

---

## Appendix: Raw Measurements

**Chunk sizes** (measured 2026-04-16 from `.next/static/chunks/`):

| Chunk           | Raw    | Gzip       | Contents                                                  |
| --------------- | ------ | ---------- | --------------------------------------------------------- |
| 1083-\*.js      | 401 kB | **123 kB** | Next.js App Router client + Sentry core                   |
| framework-\*.js | 190 kB | 60 kB      | React + React-DOM                                         |
| 4bd1b696-\*.js  | 173 kB | 54 kB      | React DOM internals                                       |
| main-\*.js      | 130 kB | 38 kB      | Next.js bootstrap                                         |
| 52774a7f-\*.js  | 121 kB | **38 kB**  | Sentry Replay (rrweb) — shared on every page              |
| polyfills-\*.js | 113 kB | 40 kB      | Browser polyfills                                         |
| 7740-\*.js      | 268 kB | 83 kB      | Framer Motion domMax + Lenis + react-markdown + micromark |
| 9925-\*.js      | 198 kB | **62 kB**  | pSEO data + Zod (loaded on /services, /technologies)      |
| 3674-\*.js      | 98 kB  | 25 kB      | Zod runtime                                               |
| 8524-\*.js      | 71 kB  | 24 kB      | @floating-ui (cmdk tooltips)                              |

**Route First Load JS** (from `npm run build`):

| Route                           | Page    | First Load         |
| ------------------------------- | ------- | ------------------ |
| `/`                             | 4.73 kB | 249 kB             |
| `/about`                        | 214 B   | 271 kB             |
| `/blog`                         | 7.21 kB | 246 kB             |
| `/blog/[slug]` (74 pages)       | 12 kB   | 261 kB             |
| `/contact`                      | 1.15 kB | 272 kB             |
| `/services`                     | 4 kB    | **335 kB**         |
| `/services/[slug]`              | 6.1 kB  | **351 kB** ← worst |
| `/services/comparisons/[slug]`  | 4.43 kB | 349 kB             |
| `/services/integrations/[slug]` | 5.38 kB | 350 kB             |
| `/services/migrations/[slug]`   | 4.79 kB | 350 kB             |
| `/technologies`                 | 17.3 kB | 259 kB             |
| `/technologies/[slug]`          | 3.52 kB | 325 kB             |
| `/tools/traceforge`             | 22 kB   | 266 kB             |
| Shared by all                   | —       | **218 kB**         |

**Production HTTP evidence** (2026-04-16 UTC):

- Homepage HTML: 132 KB raw / 32 KB gzip — `x-nextjs-cache: HIT`, `cache-control: s-maxage=31536000`
- `/blog` HTML: 285 KB raw (includes all 74 post cards inline)
- Static chunks: `cache-control: public, max-age=31536000, immutable` ✓
- `/_next/image?...`: **no cache-control header** ✗
- Fonts (woff2): cached via `_headers` → 1 year immutable ✓
- HTTP/3 and Brotli enabled at edge ✓
- CSP in place; all third-party origins whitelisted ✓
