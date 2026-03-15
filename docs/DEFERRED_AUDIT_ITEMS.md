# Deferred Audit Items (March 2026)

Items identified in the comprehensive site audit. Updated 2026-03-14 after sprint 2.

## Completed This Sprint

- ~~D.2 Workers RateLimit Binding~~ -- DONE. Commit `646e66e`. Migrated /api/chat, contact action, newsletter action to Workers RateLimit binding. Deleted in-memory rate limiter.
- ~~D.5 IntersectionObserver Scroll Tracking~~ -- DONE. Replaced scroll events with IntersectionObserver sentinel elements. Zero main-thread cost.
- ~~D.6 Knip in CI~~ -- DONE. Commit `05c26e7`. Added `npx knip --no-exit-code` to CI lint job.

## Remaining Items

### D.1 Nonce-Based CSP (Priority: HIGH)

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

### D.3 Register GA4 Custom Dimensions (Priority: HIGH)

Manual action in GA4 Admin > Custom definitions:

| Parameter       | Scope | Type      |
| --------------- | ----- | --------- |
| `page_category` | Event | Dimension |
| `content_type`  | Event | Dimension |
| `user_type`     | Event | Dimension |
| `scroll_depth`  | Event | Metric    |

Do NOT register `engagement_time_msec` (GA4 reserved parameter).

**Research:** `docs/research/ga4-analytics-portfolio-2026.md`

### D.4 Blog Pagination (Priority: MEDIUM)

Add pagination or virtual scroll to `/blog` page before reaching ~100 posts.
Currently 62 posts render at once. Plan for implementation at ~80 posts.

### D.7 Verify GA4 + CF Analytics Activation (Priority: HIGH)

Confirm in Cloudflare Pages dashboard that these environment variables are set:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` -- GA4 measurement ID
- `NEXT_PUBLIC_CF_BEACON_TOKEN` -- Cloudflare Web Analytics beacon token

Without these, analytics components render `null` and collect zero data.

**Research:** `docs/research/ga4-analytics-portfolio-2026.md`

### D.8 CSP Middleware Headers Not Propagating (Priority: MEDIUM)

Middleware.ts sets CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy headers but they don't appear in production HTTP responses. HSTS and x-content-type-options appear (likely from Cloudflare's own settings, not middleware).

Possible causes: OpenNext/Cloudflare Workers middleware response header limitation, or R2 ISR cache bypassing middleware. Research in progress.

**Research:** Pending -- agent investigating OpenNext middleware header propagation.

### D.9 Configure Workers Rate Limiting in Dashboard (Priority: HIGH)

The Workers RateLimit bindings are deployed but limits need to be configured in the Cloudflare Dashboard:

- **Workers & Pages > alexmayhew-dev > Settings > Rate Limiting**
- `chat_api` namespace: 10 requests per 60 seconds
- `contact_form` namespace: 5 requests per 3600 seconds
- `newsletter` namespace: 3 requests per 3600 seconds

Without Dashboard configuration, the `.limit()` calls may not enforce limits correctly.
