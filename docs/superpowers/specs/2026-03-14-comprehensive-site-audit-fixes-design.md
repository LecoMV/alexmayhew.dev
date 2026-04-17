# Comprehensive Site Audit Fixes — Design Spec

> **Date:** 2026-03-14
> **Status:** APPROVED
> **Based on:** Full site audit + 8 parallel research investigations

---

## Context

A comprehensive audit of alexmayhew.dev identified issues across security, SEO, analytics, performance, schema markup, and code quality. Eight parallel research agents investigated every uncertainty and produced production-grade solutions backed by official documentation and 2026 best practices.

## Architecture

The site runs Next.js 15.5.9 + React 19 on Cloudflare Workers via OpenNext. All fixes must be edge-runtime compatible. Changes are organized into 4 priority tiers + a deferred tier, designed for atomic commits.

## Tier 1: Critical

### 1.1 Fix CSP Blocking GA4

**Problem:** `middleware.ts` CSP is missing GA4/GTM domains. All analytics beacons are silently dropped by the browser.

**Solution:** Add `*.googletagmanager.com` to script-src, add GA4/DoubleClick/Google domains to connect-src, img-src, and frame-src. Also add HSTS header (missing entirely).

**Research:** `docs/research/csp-nextjs15-cloudflare-workers-2026.md`

### 1.2 Disable Keystatic Admin in Production

**Problem:** `/keystatic` returns 200 in production. Local storage mode has zero auth. Workers filesystem is read-only so writes fail, but the admin UI is exposed.

**Solution:** Official Keystatic recipe — export `showAdminUI` gated on `NODE_ENV === "development"`, gate layout and API route handler. Three files.

**Research:** `docs/research/keystatic-security-cloudflare-2026.md`

### 1.3 Re-enable Server-Side Sentry

**Problem:** `instrumentation.ts` has server/edge imports commented out. Server errors invisible to Sentry.

**Solution:** Uncomment the edge import. Prerequisites already met: `nodejs_compat` flag and `compatibility_date: "2025-12-01"` (after required `2025-08-16`).

**Research:** `docs/research/sentry-opennext-cloudflare-2026.md`

### 1.4 Add Canonical URLs to All Pages

**Problem:** 9 static pages lack explicit self-referencing canonicals. 3 pages have wrong Twitter handle.

**Solution:** Add `alternates.canonical` using relative paths (metadataBase resolves them). Fix `@alexmayhew` → `@alexmayhewdev` on technologies pages and root layout.

**Research:** `docs/research/nextjs-canonical-url-best-practices-2026.md`

## Tier 2: High

### 2.1 Fix llms.txt LinkedIn URL

Change `linkedin.com/in/alexmayhew` → `linkedin.com/in/alexmmayhew`.

### 2.2 Configure Cloudflare WAF Rate Limiting

Add 1 WAF rule (free tier) covering `/api/chat` OR `/api/contact` OR `/api/vectorize`. Edge-level, zero code change.

**Research:** `docs/research/cloudflare-rate-limiting-2026.md`

### 2.3 Consolidate Person Entity with @id

Define full Person once with `@id: "https://alexmayhew.dev/#person"`. Reference everywhere via `@id` only.

**Research:** `docs/research/schema-markup-seo-2026.md`

### 2.4 Remove Dead SearchAction

Sitelinks Search Box deprecated Nov 2024. Remove `potentialAction` from WebSite schema.

### 2.5 Switch to ConsultingService Schema

More specific than ProfessionalService. Add `knowsAbout` array.

### 2.6 Upgrade Article Image to ImageObject

Change URL string to `{ "@type": "ImageObject", url, width: 1200, height: 630 }`.

## Tier 3: Medium

### 3.1 Replace MDX img with next/image

Enable `remarkImage` in source.config.ts, swap raw `<img>` for `<Image>` in mdx-components.tsx.

**Research:** `docs/research/nextjs-image-optimization-mdx-cloudflare-2026.md`

### 3.2 Add Lenis prefers-reduced-motion Check

Skip Lenis initialization when `prefers-reduced-motion: reduce` is active.

### 3.3 Fix Engagement Time Event Name

Rename `engagement_time` → `user_engagement`. Add `visibilitychange` handler.

**Research:** `docs/research/ga4-analytics-portfolio-2026.md`

### 3.4 Add HSTS Header

Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to middleware.

## Tier 4: Low

### 4.1 Fix hello-world.mdx Formatting

### 4.2 Fix global-error.tsx Hardcoded Colors

### 4.3 Update siteLastUpdated in Sitemap

### 4.4 Fix Duplicate relatedServices

### 4.5 Clean Up Screenshot Artifacts

### 4.6 Add ErrorBoundary Sentry Reporting

## Deferred (Next Sprint)

### D.1 Nonce-Based CSP

Remove `'unsafe-inline'` from script-src via nonce generation in middleware. Requires async layout.tsx. Blocked by Framer Motion requiring `style-src 'unsafe-inline'` (maintainer wontfix). Defer until full CSP nonce + Framer Motion replacement can be evaluated together.

### D.2 Workers RateLimit Binding

Replace in-memory rate limiter with Cloudflare Workers RateLimit binding (GA Sep 2025, free tier). Add `rate_limits` bindings to wrangler.jsonc, update route handlers, delete `src/lib/rate-limit.ts`.

### D.3 Register GA4 Custom Dimensions

Manual action in GA4 Admin dashboard: register `page_category`, `content_type`, `user_type` as event-scoped custom dimensions, `scroll_depth` as custom metric.

### D.4 Blog Pagination

Add pagination or virtual scroll before reaching ~100 posts. Currently 62 posts render at once on `/blog`.

### D.5 IntersectionObserver Scroll Tracking

Replace scroll event listeners with IntersectionObserver sentinel elements at 25/50/75/90% depth. Zero main-thread cost.

### D.6 Knip in CI

Add `npm run knip` to the CI lint job to catch dead code on every push.
