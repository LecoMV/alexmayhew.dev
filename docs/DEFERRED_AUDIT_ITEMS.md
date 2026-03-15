# Deferred Audit Items (March 2026)

Items identified in the comprehensive site audit. Updated 2026-03-15.

## Completed (Sprint 1 + Sprint 2)

- ~~D.2 Workers RateLimit Binding~~ -- DONE. Code migrated (commit `646e66e`). Bindings commented out in wrangler.jsonc pending Dashboard namespace creation (see D.9).
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

### D.8 CSP Security Headers via Custom Worker Wrapper (Priority: HIGH)

**Root cause found:** `public/_headers` only applies to CDN-served static assets, not Worker-generated HTML. Middleware headers are set but OpenNext doesn't consistently propagate them through.

**Solution:** Create `custom-worker.ts` that wraps the OpenNext handler:

1. Create `custom-worker.ts` at project root
2. Import and re-export the OpenNext handler
3. Inject CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy on HTML responses
4. Update `wrangler.jsonc` main entry to `./custom-worker.ts`

Note: HSTS and x-content-type-options already appear from Cloudflare platform settings.

**Research:** `docs/research/opennext-middleware-headers-cloudflare-2026.md`

### D.9 Configure Workers Rate Limiting in Dashboard + Re-enable Bindings (Priority: HIGH)

Two-step process:

**Step 1 (Cloudflare Dashboard):**

- Workers & Pages > alexmayhew-dev > Settings > Rate Limiting
- Create namespace `chat_api`: 10 requests per 60 seconds
- Create namespace `contact_form`: 5 requests per 3600 seconds
- Create namespace `newsletter`: 3 requests per 3600 seconds

**Step 2 (Code):**

- Uncomment `rate_limits` in `wrangler.jsonc`
- Deploy and verify Worker starts successfully

Without Dashboard configuration first, Worker fails to start (500 on all pages).

**Research:** `docs/research/cloudflare-rate-limiting-2026.md`

### D.10 Server-Side Sentry via @sentry/cloudflare (Priority: MEDIUM)

`@sentry/nextjs` server-side imports crash Cloudflare Workers due to AsyncLocalStorage
bound functions crossing request boundaries. Both `nodejs` and `edge` imports must remain
disabled (the bundler processes both branches regardless of runtime conditions).

**Solution:** Use `@sentry/cloudflare` (v10.43.0, production-ready) for edge error tracking:

1. `npm install @sentry/cloudflare`
2. Create `sentry.edge.config.ts` using `@sentry/cloudflare` instead of `@sentry/nextjs`
3. Update `instrumentation.ts` to import `@sentry/cloudflare` for edge runtime
4. Keep `@sentry/nextjs` for client-side only (`sentry.client.config.ts`)

**Research:** `docs/research/sentry-opennext-cloudflare-2026.md`
