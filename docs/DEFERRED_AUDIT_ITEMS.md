# Deferred Audit Items (March 2026)

Items identified in the comprehensive site audit planned for upcoming sprints.

## D.1 Nonce-Based CSP (Priority: HIGH)

Remove `'unsafe-inline'` from script-src via nonce generation in middleware.

**Requirements:**

- Middleware generates nonce per request via `crypto.randomUUID()`
- `layout.tsx` becomes async Server Component, reads `x-nonce` header
- Consent Mode v2 inline script receives `nonce={nonce}` prop
- Bot Fight Mode disabled in Cloudflare Dashboard
- All pages become dynamically rendered (no static optimization)

**Blocker:** `style-src 'unsafe-inline'` still required by Framer Motion (GitHub #1727, wontfix).
Evaluate replacing Framer Motion with CSS-only animations before implementing.

**Research:** `docs/research/csp-nextjs15-cloudflare-workers-2026.md`

## D.2 Workers RateLimit Binding (Priority: HIGH)

Replace in-memory rate limiter with Cloudflare Workers RateLimit binding (GA Sep 2025, free tier).

**Steps:**

1. Add `rate_limits` bindings to `wrangler.jsonc`
2. Add `RateLimit` types to `CloudflareEnv` interface (`cloudflare-env.d.ts`)
3. Update `/api/chat` route -- replace `checkRateLimit()` with `env.RATE_LIMITER_CHAT.limit()`
4. Update contact action -- replace `dependencies.rateLimit()` with binding call
5. Delete `src/lib/rate-limit.ts` after migration complete

**Research:** `docs/research/cloudflare-rate-limiting-2026.md`

## D.3 Register GA4 Custom Dimensions (Priority: HIGH)

Manual action in GA4 Admin > Custom definitions:

| Parameter       | Scope | Type      |
| --------------- | ----- | --------- |
| `page_category` | Event | Dimension |
| `content_type`  | Event | Dimension |
| `user_type`     | Event | Dimension |
| `scroll_depth`  | Event | Metric    |

Do NOT register `engagement_time_msec` (GA4 reserved parameter).

**Research:** `docs/research/ga4-analytics-portfolio-2026.md`

## D.4 Blog Pagination (Priority: MEDIUM)

Add pagination or virtual scroll to `/blog` page before reaching ~100 posts.
Currently 62 posts render at once. Plan for implementation at ~80 posts.

## D.5 IntersectionObserver Scroll Tracking (Priority: LOW)

Replace scroll event listeners in `use-content-analytics.ts` with IntersectionObserver
sentinel elements at 25/50/75/90% article depth. Zero main-thread cost vs current
scroll event + debounce approach.

**Research:** `docs/research/ga4-analytics-portfolio-2026.md`

## D.6 Knip in CI (Priority: LOW)

Add `npm run knip` to the CI lint job (`.github/workflows/ci.yml`) to catch
dead code on every push. Currently configured but not enforced in CI.

## D.7 Verify GA4 + CF Analytics Activation (Priority: HIGH)

Confirm in Cloudflare Pages dashboard that these environment variables are set:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` -- GA4 measurement ID
- `NEXT_PUBLIC_CF_BEACON_TOKEN` -- Cloudflare Web Analytics beacon token

Without these, analytics components render `null` and collect zero data.

**Research:** `docs/research/ga4-analytics-portfolio-2026.md`
