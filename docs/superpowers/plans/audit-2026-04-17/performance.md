# Performance Audit — 2026-04-17 (CWV April 2026)

Build: Next.js 15.5.15, React 19.2.4, OpenNext 1.18.0. 198 static pages. Shared First Load JS: **181 KB** (35 KB over Google's 150 KB target).

## Route bundle sizes

| Route                                                  | First Load JS | Status            |
| ------------------------------------------------------ | ------------- | ----------------- |
| `/technologies/[slug]`                                 | **289 KB**    | P0                |
| `/about`, `/contact`, `/tools`, `/work`, `/services/*` | 254-255 KB    | P1                |
| `/blog/[slug]`                                         | 252 KB        | P1                |
| `/`                                                    | 240 KB        | P1                |
| `/blog`, `/newsletter`                                 | 234-241 KB    | P1                |
| `/_not-found`, `/api/*`                                | 181 KB        | P1 (shared floor) |

## P0 — Critical

1. **`/technologies/[slug]` = 289 KB First Load** — 45% over 200 KB target. Root: `technology-page-content.tsx:1` fully client-rendered (491 lines) for trivial motion animations. Convert to Server Component + small motion islands. **Savings: 60-80 KB.**

2. **Shared chunk `1440-*.js` = 122 KB gzipped on every page.** Suspected: React 19 runtime + Sentry browser SDK (~60 KB) + next-view-transitions + zod + isomorphic-dompurify. Audit `next.config.mjs:71` Sentry wrapping — disable `autoInstrumentClient` or tunnel + manual `init` without `browserTracingIntegration`. Most portfolio sites ship Sentry core ~20 KB.

## P1 — High

3. **Homepage fully `'use client'`** — `src/app/home-page.tsx:1`, 555 lines. Static marketing page. Wrap only motion groups as client islands (like `about-page-client.tsx`). **Est. LCP win: 200-400ms.**

4. **No AVIF in `next.config.mjs`** — 74 blog images are WebP only (10.2 MB total). Add `images.formats: ['image/avif', 'image/webp']`. Cloudflare Images binding exists (`wrangler.jsonc:17`) but not used for AVIF negotiation.

5. **`display: "optional"` on fonts** — `src/app/fonts.ts:20,28`. Too aggressive (100ms cap). On slow 3G, system fallback persists all session. Change to `display: "swap"` with `adjustFontFallback` for CLS safety.

6. **HTML routes serve `cache-control: private, no-cache, no-store`** — verified via `curl -sI`. Static SSG pages (`/blog/*`, `/for/*`, `/services/*`, `/technologies/*`) bypass edge HTML cache. OpenNext R2 incremental cache configured (`open-next.config.ts:21`) but response headers don't honor it. Add Cloudflare Cache Rules for SSG paths: `Cache-Everything` + Edge TTL 1h + Browser TTL 5min. **TTFB win: 150-300ms on cache hits.**

7. **No `preconnect`/`dns-prefetch` hints** — `src/app/layout.tsx:152`. Missing for `googletagmanager.com`, `static.cloudflareinsights.com`, `challenges.cloudflare.com`, `*.ingest.sentry.io`. Adds ~100-200ms first-hit.

## P2 — Medium

8. **React Compiler NOT enabled** — `next.config.mjs:31`. Stable in Next 15.5. Add `experimental: { reactCompiler: true }`. Auto-memoizes 74 client components.

9. **`ViewTransitions` wraps entire tree** — `layout.tsx:161`. `next-view-transitions` ~8KB. Verify it's providing value or remove.

10. **Turnstile direct import** — `src/components/ui/turnstile.tsx:3` via `@marsidev/react-turnstile`. Only on `/contact`. Confirm lazy via `dynamic(import, { ssr: false })`. **~15 KB savings on contact route.**

11. **74 `'use client'` directives project-wide** — audit PSE0 CTA/FAQ components for RSC conversion candidates:
    - `src/components/pseo/cta-section.tsx`
    - `src/components/pseo/service-cta-split.tsx`
    - `src/components/pseo/faq-accordion.tsx`

12. **CSS bundle 125KB uncompressed** (~20KB gzipped) — Tailwind 4 + optimizeCss. Acceptable.

13. **Web Vitals instrumentation correct** — `src/lib/web-vitals.ts:2-15` tracks LCP/INP/CLS with `web-vitals@5.1.0` (INP-aware). Reports to Sentry + GA4.

## Highest-leverage fixes

1. P0-2 chunk `1440` audit → every route drops proportionally
2. P1-6 Cloudflare Cache Rules → TTFB wins sitewide
3. P0-1 `/technologies/[slug]` RSC split → 60-80 KB
4. P1-3 Homepage RSC split → LCP 200-400ms
5. P2-8 React Compiler → removes manual memoization debt
