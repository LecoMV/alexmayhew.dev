# Deferred Audit Items (March 2026)

Items identified in the comprehensive site audit. Updated 2026-03-15.

## Completed

- ~~D.2 Workers RateLimit Binding~~ -- DONE. Code migrated + bindings re-enabled in wrangler.jsonc. Namespaces auto-created.
- ~~D.5 IntersectionObserver Scroll Tracking~~ -- DONE. Zero main-thread cost scroll depth tracking.
- ~~D.6 Knip in CI~~ -- DONE. Dead code detection in CI lint job.
- ~~D.7 Verify GA4 + CF Analytics Activation~~ -- DONE. GA4 measurement ID confirmed set. CF Web Analytics beacon created and set (`7b99809687974163b0e4d3b22634c4e9`).
- ~~D.8 CSP Security Headers~~ -- DONE. Custom Worker wrapper (`custom-worker.ts`) injects CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy on HTML responses. All headers verified in production.
- ~~D.9 Configure Workers Rate Limiting~~ -- DONE. Bindings active in wrangler.jsonc with simple config. Namespaces auto-created on deploy.

## Remaining Items

### D.1 Nonce-Based CSP (Priority: HIGH)

Remove `'unsafe-inline'` from script-src via nonce generation.

**Blocker:** `style-src 'unsafe-inline'` still required by Framer Motion (GitHub #1727, wontfix).
Evaluate replacing Framer Motion with CSS-only animations before implementing.

**Research:** `docs/research/csp-nextjs15-cloudflare-workers-2026.md`

### D.3 Register GA4 Custom Dimensions (Priority: HIGH)

Manual action in GA4 Admin > Custom definitions:

| Parameter       | Scope | Type      |
| --------------- | ----- | --------- |
| `page_category` | Event | Dimension |
| `content_type`  | Event | Dimension |
| `user_type`     | Event | Dimension |
| `scroll_depth`  | Event | Metric    |

Do NOT register `engagement_time_msec` (GA4 reserved parameter).

### D.4 Blog Pagination (Priority: MEDIUM)

Add pagination or virtual scroll to `/blog` before reaching ~100 posts (currently 62).

### D.10 Server-Side Sentry via @sentry/cloudflare (Priority: MEDIUM)

`@sentry/nextjs` server-side imports crash Workers. Need `@sentry/cloudflare` for edge tracking.

**Research:** `docs/research/sentry-opennext-cloudflare-2026.md`
