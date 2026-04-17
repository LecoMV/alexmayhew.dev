# Comprehensive Site Audit Fixes — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all issues found in the full site audit — security, SEO, analytics, performance, schema, and code quality.

**Architecture:** 20 discrete fixes across 4 priority tiers, each producing an atomic commit. All changes must pass `npm run build` and existing tests. New test coverage added where behavior changes.

**Tech Stack:** Next.js 15.5.9, TypeScript, Cloudflare Workers, Sentry, GA4, Zod, Fumadocs MDX

**Spec:** `docs/superpowers/specs/2026-03-14-comprehensive-site-audit-fixes-design.md`

**Research docs:**

- `docs/research/csp-nextjs15-cloudflare-workers-2026.md`
- `docs/research/keystatic-security-cloudflare-2026.md`
- `docs/research/sentry-opennext-cloudflare-2026.md`
- `docs/research/nextjs-canonical-url-best-practices-2026.md`
- `docs/research/cloudflare-rate-limiting-2026.md`
- `docs/research/schema-markup-seo-2026.md`
- `docs/research/ga4-analytics-portfolio-2026.md`
- `docs/research/nextjs-image-optimization-mdx-cloudflare-2026.md`

---

## Chunk 1: Critical Security & Analytics Fixes (Tasks 1-4)

### Task 1: Fix CSP — Unblock GA4 + Add HSTS

**Files:**

- Modify: `middleware.ts`
- Modify: `tests/middleware.test.ts`

- [ ] **Step 1: Read the current middleware and its test file**

Read `middleware.ts` and `tests/middleware.test.ts` to understand current CSP structure and test patterns.

- [ ] **Step 2: Write failing test for GA4 domains in CSP**

In `tests/middleware.test.ts`, add a test:

```typescript
it("CSP connect-src includes GA4 domains", () => {
	const response = middleware(mockRequest);
	const csp = response.headers.get("Content-Security-Policy") ?? "";
	expect(csp).toContain("*.google-analytics.com");
	expect(csp).toContain("*.analytics.google.com");
	expect(csp).toContain("*.googletagmanager.com");
});

it("CSP script-src includes GTM", () => {
	const response = middleware(mockRequest);
	const csp = response.headers.get("Content-Security-Policy") ?? "";
	expect(csp).toContain("*.googletagmanager.com");
});

it("sets HSTS header", () => {
	const response = middleware(mockRequest);
	expect(response.headers.get("Strict-Transport-Security")).toBe(
		"max-age=31536000; includeSubDomains"
	);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/middleware.test.ts`
Expected: FAIL — missing GA4 domains, missing HSTS header

- [ ] **Step 4: Update middleware.ts with complete CSP and HSTS**

```typescript
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com;
    font-src 'self';
    connect-src 'self' https://cloudflareinsights.com https://challenges.cloudflare.com https://*.ingest.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com;
    frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
	.replace(/\s{2,}/g, " ")
	.trim();
```

Add after existing headers:

```typescript
response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/middleware.test.ts`
Expected: PASS

- [ ] **Step 6: Run full build to verify no breakage**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add middleware.ts tests/middleware.test.ts
git commit -m "fix: add GA4 domains to CSP and HSTS header

CSP was silently blocking GA4 data collection by missing
google-analytics.com and googletagmanager.com domains.
Added HSTS for transport security."
```

---

### Task 2: Disable Keystatic Admin in Production

**Files:**

- Modify: `keystatic.config.ts`
- Modify: `src/app/keystatic/layout.tsx`
- Modify: `src/app/api/keystatic/[...params]/route.ts`

- [ ] **Step 1: Read all three Keystatic files**

Read `keystatic.config.ts`, `src/app/keystatic/layout.tsx`, and `src/app/api/keystatic/[...params]/route.ts`.

- [ ] **Step 2: Add showAdminUI export to keystatic.config.ts**

Add at the end of the file, before `export default config(...)`:

```typescript
export const showAdminUI = process.env.NODE_ENV === "development";
```

- [ ] **Step 3: Gate the layout with notFound()**

Replace `src/app/keystatic/layout.tsx` content:

```typescript
import { notFound } from "next/navigation";

import { showAdminUI } from "../../../keystatic.config";

export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
	if (!showAdminUI) notFound();
	return <>{children}</>;
}
```

- [ ] **Step 4: Gate the API route handler**

Replace `src/app/api/keystatic/[...params]/route.ts` content:

```typescript
import { makeRouteHandler } from "@keystatic/next/route-handler";

import config, { showAdminUI } from "../../../../../keystatic.config";

const notFoundResponse = () => new Response(null, { status: 404 });

export const { POST, GET } = showAdminUI
	? makeRouteHandler({ config })
	: { GET: notFoundResponse, POST: notFoundResponse };
```

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds (NODE_ENV=production during build, so routes will 404)

- [ ] **Step 6: Commit**

```bash
git add keystatic.config.ts src/app/keystatic/layout.tsx src/app/api/keystatic/\[\...params\]/route.ts
git commit -m "security: disable Keystatic admin UI in production

Keystatic local mode has zero authentication. Gate both the
UI layout and API routes on NODE_ENV === 'development'.
Official Keystatic recipe for production deployment."
```

---

### Task 3: Re-enable Server-Side Sentry

**Files:**

- Modify: `src/instrumentation.ts`

- [ ] **Step 1: Read current instrumentation.ts**

Already read. The edge import is commented out.

- [ ] **Step 2: Uncomment the edge import**

Replace the contents of `src/instrumentation.ts`:

```typescript
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("../sentry.server.config");
	}
	if (process.env.NEXT_RUNTIME === "edge") {
		await import("../sentry.edge.config");
	}
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. The `nodejs_compat` flag and `compatibility_date: "2025-12-01"` in wrangler.jsonc meet Sentry's requirements.

- [ ] **Step 4: Commit**

```bash
git add src/instrumentation.ts
git commit -m "fix: re-enable server-side Sentry on Cloudflare Workers

Prerequisites now met: nodejs_compat flag provides AsyncLocalStorage,
compatibility_date 2025-12-01 provides https.request. Server-side
errors will now flow to Sentry dashboard."
```

---

### Task 4: Add Canonical URLs + Fix Twitter Handles

**Files:**

- Modify: `src/app/page.tsx` (homepage — needs metadata export added, currently `'use client'`)
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/for/page.tsx`
- Modify: `src/app/services/page.tsx`
- Modify: `src/app/tools/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/layout.tsx` (Twitter handle fix)
- Modify: `src/app/technologies/page.tsx` (Twitter handle fix)
- Modify: `src/app/technologies/[slug]/page.tsx` (Twitter handle fix)
- Modify: `tests/seo/canonical.test.ts`

- [ ] **Step 1: Write failing test for canonical on static pages**

Add to `tests/seo/canonical.test.ts`:

```typescript
it("static pages should export canonical in metadata", async () => {
	const pages = [
		"src/app/about/page.tsx",
		"src/app/contact/page.tsx",
		"src/app/work/page.tsx",
		"src/app/services/page.tsx",
		"src/app/tools/page.tsx",
		"src/app/privacy/page.tsx",
		"src/app/terms/page.tsx",
	];

	for (const pagePath of pages) {
		const source = await import("fs").then((fs) => fs.readFileSync(pagePath, "utf-8"));
		const hasCanonical = /alternates:\s*\{[^}]*canonical:/s.test(source);
		expect(hasCanonical, `${pagePath} missing canonical`).toBe(true);
	}
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/seo/canonical.test.ts`
Expected: FAIL — pages missing canonical

- [ ] **Step 3: Add canonical to each static page**

For each page, add `alternates` to the metadata export. Example for `about/page.tsx`:

```typescript
alternates: {
    canonical: "/about",
},
```

Pattern for each page:

- `/about` → `canonical: "/about"`
- `/contact` → `canonical: "/contact"`
- `/work` → `canonical: "/work"`
- `/for` (hub) → `canonical: "/for"`
- `/services` (hub) → `canonical: "/services"`
- `/tools` → `canonical: "/tools"`
- `/privacy` → `canonical: "/privacy"`
- `/terms` → `canonical: "/terms"`

**Homepage special case:** `src/app/page.tsx` is `'use client'` so it can't export metadata. Create a separate `src/app/metadata.ts` or restructure so layout handles homepage canonical. Since `metadataBase` is set in root layout, add to root layout metadata:

```typescript
// In layout.tsx metadata, homepage gets canonical via the page itself
// But since page.tsx is 'use client', we handle homepage in layout
```

Actually, the simplest approach: the homepage canonical should be just `/`. Add this to the root layout's alternates (which already has the RSS type):

```typescript
alternates: {
    canonical: "/",
    types: {
        "application/rss+xml": `${siteUrl}/feed.xml`,
    },
},
```

Wait — this was the original bug we fixed (cascading canonical). The research confirms: setting canonical in root layout cascades to ALL child pages. So we CANNOT set the homepage canonical in root layout.

Instead, extract homepage into a wrapper: create `src/app/home-page.tsx` as the `'use client'` component, and make `src/app/page.tsx` a server component that exports metadata and renders the client component.

Rename current `src/app/page.tsx` → `src/app/home-page.tsx`, then create new `src/app/page.tsx`:

```typescript
import HomePage from "./home-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
	alternates: {
		canonical: "/",
	},
};

export default function Page() {
	return <HomePage />;
}
```

- [ ] **Step 4: Fix Twitter handles**

In `src/app/layout.tsx`, change line 122:

```typescript
creator: "@alexmayhewdev",  // was "@alexmayhew"
```

In `src/app/technologies/page.tsx`, change line 45:

```typescript
creator: "@alexmayhewdev",  // was "@alexmayhew"
```

In `src/app/technologies/[slug]/page.tsx`, change line 58:

```typescript
creator: "@alexmayhewdev",  // was "@alexmayhew"
```

- [ ] **Step 5: Run canonical tests**

Run: `npx vitest run tests/seo/canonical.test.ts`
Expected: PASS

- [ ] **Step 6: Run full test suite**

Run: `npx vitest run`
Expected: All 460+ tests pass

- [ ] **Step 7: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx src/app/home-page.tsx src/app/about/page.tsx src/app/contact/page.tsx src/app/work/page.tsx src/app/for/page.tsx src/app/services/page.tsx src/app/tools/page.tsx src/app/privacy/page.tsx src/app/terms/page.tsx src/app/layout.tsx src/app/technologies/page.tsx src/app/technologies/\[slug\]/page.tsx tests/seo/canonical.test.ts
git commit -m "seo: add canonical URLs to all pages, fix Twitter handles

Every page now has explicit self-referencing canonical URL.
Homepage extracted from 'use client' to server component wrapper.
Twitter handle standardized to @alexmayhewdev everywhere."
```

---

## Chunk 2: SEO & Schema Improvements (Tasks 5-10)

### Task 5: Fix llms.txt LinkedIn URL

**Files:**

- Modify: `src/app/llms.txt/route.ts`

- [ ] **Step 1: Fix the URL**

Change line 88 from:

```
- LinkedIn: https://linkedin.com/in/alexmayhew
```

to:

```
- LinkedIn: https://www.linkedin.com/in/alexmmayhew
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/llms.txt/route.ts
git commit -m "fix: correct LinkedIn URL in llms.txt"
```

---

### Task 6: Consolidate Person Entity with @id

**Files:**

- Modify: `src/components/seo/json-ld.tsx`
- Modify: `src/components/seo/article-json-ld.tsx`
- Modify: `src/components/seo/local-business-json-ld.tsx`

- [ ] **Step 1: Update json-ld.tsx — Person schema with @id**

In the `personSchema` object, add `@id`:

```typescript
const personSchema = {
	"@context": "https://schema.org",
	"@type": "Person",
	"@id": "https://alexmayhew.dev/#person",
	name: "Alex Mayhew",
	// ... rest unchanged
};
```

In `websiteSchema`, remove `potentialAction` entirely (SearchAction deprecated). Add author reference:

```typescript
const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": "https://alexmayhew.dev/#website",
	name: "Alex Mayhew",
	alternateName: "alexmayhew.dev",
	url: "https://alexmayhew.dev",
	description: "Portfolio and blog of Alex Mayhew - Technical Advisor & Systems Architect",
	author: { "@id": "https://alexmayhew.dev/#person" },
};
```

In `professionalServiceSchema`, change `@type` to `ConsultingService` and add `knowsAbout`:

```typescript
const professionalServiceSchema = {
	"@context": "https://schema.org",
	"@type": "ConsultingService",
	"@id": "https://alexmayhew.dev/#business",
	// ... rest unchanged, add:
	founder: { "@id": "https://alexmayhew.dev/#person" },
	knowsAbout: [
		"Software Architecture",
		"SaaS Development",
		"Next.js",
		"React",
		"TypeScript",
		"Node.js",
		"Python",
		"PostgreSQL",
		"AI/ML Integration",
		"Performance Engineering",
		"Cloud Architecture",
		"Technical Due Diligence",
	],
};
```

- [ ] **Step 2: Update article-json-ld.tsx — reference Person @id**

Replace the `author` block:

```typescript
author: { "@id": "https://alexmayhew.dev/#person" },
publisher: { "@id": "https://alexmayhew.dev/#person" },
```

Upgrade `image` to ImageObject:

```typescript
image: {
    "@type": "ImageObject",
    url: image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`,
    width: 1200,
    height: 630,
},
```

- [ ] **Step 3: Update local-business-json-ld.tsx — reference Person @id**

Add `founder` reference:

```typescript
founder: { "@id": "https://alexmayhew.dev/#person" },
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/seo/json-ld.tsx src/components/seo/article-json-ld.tsx src/components/seo/local-business-json-ld.tsx
git commit -m "seo: consolidate Person entity with @id, switch to ConsultingService

Person schema now uses canonical @id referenced across all JSON-LD.
Strengthens Knowledge Graph entity consolidation and E-E-A-T signals.
Removed deprecated SearchAction. Upgraded to ConsultingService type.
Article image now uses ImageObject with dimensions."
```

---

### Task 7: Add ErrorBoundary Sentry Reporting

**Files:**

- Modify: `src/components/ui/error-boundary.tsx`

- [ ] **Step 1: Add Sentry import and captureException**

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import { Component } from "react";

import type { ReactNode } from "react";

// ... interface unchanged ...

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	// ... constructor unchanged ...
	// ... getDerivedStateFromError unchanged ...

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		Sentry.captureException(error, {
			contexts: { react: { componentStack: info.componentStack } },
		});
	}

	// ... render unchanged ...
}
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run tests/components/ui/error-boundary.test.tsx`
Expected: PASS (existing tests should still pass)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/error-boundary.tsx
git commit -m "fix: add Sentry reporting to ErrorBoundary componentDidCatch"
```

---

### Tasks 8-10: Quick Fixes (global-error, sitemap, role page)

**Files:**

- Modify: `src/app/global-error.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/data/roles/pages.ts`

- [ ] **Step 1: Fix global-error.tsx hardcoded colors**

Replace `hover:border-[#ccf381]` with `hover:border-cyber-lime`.
Replace `text-[#e2e8f0]` with `text-mist-white`.
Replace `hover:text-[#ccf381]` with `hover:text-cyber-lime`.

- [ ] **Step 2: Update siteLastUpdated**

In `src/app/sitemap.ts` line 23, change:

```typescript
const siteLastUpdated = new Date("2026-03-14");
```

- [ ] **Step 3: Fix duplicate relatedServices**

In `src/data/roles/pages.ts`, find the technical-founder `relatedServices` array (around line 234) and remove the duplicate `"fullstack-developer-for-startups"` entry.

- [ ] **Step 4: Run build**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/app/global-error.tsx src/app/sitemap.ts src/data/roles/pages.ts
git commit -m "fix: design tokens in global-error, update sitemap date, dedupe role services"
```

---

## Chunk 3: Performance & Analytics (Tasks 11-14)

### Task 11: Replace MDX img with next/image

**Files:**

- Modify: `src/components/mdx/mdx-components.tsx`
- Check: `source.config.ts` (for remarkImage — only if file exists and is relevant)

- [ ] **Step 1: Update mdx-components.tsx img component**

Replace the `img` key in `mdxComponents`:

```typescript
import Image from "next/image";

import type { StaticImageData } from "next/image";

// In the mdxComponents object:
img: ({ src, alt, width, height, className }: ComponentProps<"img"> & { src?: string | StaticImageData }) => (
    <figure className="my-6">
        <div className="bg-gunmetal-glass/20 relative border border-white/10 p-2">
            <div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
            <div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
            <Image
                src={src as string | StaticImageData}
                alt={alt ?? ""}
                width={typeof width === "number" ? width : 1200}
                height={typeof height === "number" ? height : 630}
                className={cn("h-auto w-full", className)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                loading="lazy"
            />
        </div>
        {alt && (
            <figcaption className="text-slate-text mt-2 font-mono text-xs">{`// ${alt}`}</figcaption>
        )}
    </figure>
),
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. No current blog posts have inline body images, so this is forward-looking.

- [ ] **Step 3: Commit**

```bash
git add src/components/mdx/mdx-components.tsx
git commit -m "perf: replace raw img with next/image in MDX components

Enables automatic WebP/AVIF conversion via Cloudflare Images,
lazy loading, and CLS prevention with explicit dimensions.
Forward-looking change — no current MDX posts use inline images."
```

---

### Task 12: Add Lenis prefers-reduced-motion Check

**Files:**

- Modify: `src/components/providers/smooth-scroll.tsx`

- [ ] **Step 1: Add media query check**

```typescript
"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
	const lenisRef = useRef<Lenis | null>(null);

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;

		if (prefersReducedMotion) return;

		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
		});

		lenisRef.current = lenis;

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	return <div className="smooth-scroll-wrapper">{children}</div>;
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/providers/smooth-scroll.tsx
git commit -m "a11y: respect prefers-reduced-motion in Lenis smooth scroll

Skip Lenis initialization entirely when user has reduced motion
preference. Saves ~25KB of runtime work and respects accessibility."
```

---

### Task 13: Fix Engagement Time Event Name

**Files:**

- Modify: `src/lib/hooks/use-content-analytics.ts`

- [ ] **Step 1: Read the current file**

Read `src/lib/hooks/use-content-analytics.ts` to understand current implementation.

- [ ] **Step 2: Fix event name and add visibilitychange handler**

Rename any `engagement_time` event to `user_engagement` with `engagement_time_msec` parameter.

Add a `visibilitychange` listener in the same useEffect:

```typescript
const handleVisibilityChange = () => {
	if (document.visibilityState === "hidden" && startTime.current) {
		window.gtag?.("event", "user_engagement", {
			engagement_time_msec: Date.now() - startTime.current,
		});
	}
};

document.addEventListener("visibilitychange", handleVisibilityChange);

return () => {
	document.removeEventListener("visibilitychange", handleVisibilityChange);
	// existing cleanup...
};
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/lib/hooks/use-content-analytics.ts
git commit -m "fix: rename engagement event to user_engagement for GA4 native metrics

GA4 only populates engagement metrics from events named
user_engagement with engagement_time_msec parameter. Also added
visibilitychange handler for tab-close capture via sendBeacon."
```

---

### Task 14: Fix hello-world.mdx Formatting

**Files:**

- Modify: `content/blog/hello-world.mdx`

- [ ] **Step 1: Fix frontmatter formatting**

Change unquoted category to quoted:

```yaml
category: "architecture"
```

Change YAML array tags to JSON array:

```yaml
tags: ["engineering", "philosophy", "web-development"]
```

- [ ] **Step 2: Commit**

```bash
git add content/blog/hello-world.mdx
git commit -m "fix: standardize hello-world.mdx frontmatter formatting"
```

---

## Chunk 4: Cleanup & Documentation (Tasks 15-17)

### Task 15: Clean Up Screenshot Artifacts

- [ ] **Step 1: Delete nav screenshot files**

```bash
rm -f nav-*.png
```

- [ ] **Step 2: Verify git status is clean of these files**

Run: `git status`

---

### Task 16: Configure Cloudflare WAF Rate Limiting (Manual)

This is a Cloudflare Dashboard action, not a code change. Document the steps:

- [ ] **Step 1: Log in to Cloudflare Dashboard**

Navigate to: Security → WAF → Rate limiting rules

- [ ] **Step 2: Create rule**

- **Name:** API Rate Limit
- **Expression:** `(http.request.uri.path contains "/api/chat") or (http.request.uri.path contains "/api/contact") or (http.request.uri.path contains "/api/vectorize")`
- **Characteristics:** IP Address
- **Period:** 60 seconds
- **Requests:** 20
- **Action:** Block
- **Duration:** 60 seconds

- [ ] **Step 3: Deploy the rule**

---

### Task 17: Document Deferred Items

**Files:**

- Create: `docs/DEFERRED_AUDIT_ITEMS.md`

- [ ] **Step 1: Write deferred items document**

```markdown
# Deferred Audit Items (March 2026)

Items identified in the comprehensive site audit that are planned for upcoming sprints.

## D.1 Nonce-Based CSP (Priority: HIGH)

Remove `'unsafe-inline'` from script-src via nonce generation in middleware.

**Requirements:**

- Middleware generates nonce per request via `crypto.randomUUID()`
- `layout.tsx` becomes async Server Component, reads `x-nonce` header
- Consent Mode v2 inline script receives `nonce={nonce}` prop
- Bot Fight Mode disabled in Cloudflare Dashboard
- Acceptance that all pages become dynamically rendered

**Blocker:** `style-src 'unsafe-inline'` still required by Framer Motion (GitHub #1727, wontfix).
Evaluate replacing Framer Motion with CSS-only animations before implementing.

**Research:** `docs/research/csp-nextjs15-cloudflare-workers-2026.md`

## D.2 Workers RateLimit Binding (Priority: HIGH)

Replace in-memory rate limiter with Cloudflare Workers RateLimit binding.

**Steps:**

1. Add `rate_limits` bindings to `wrangler.jsonc`
2. Add `RateLimit` types to `CloudflareEnv` interface (`cloudflare-env.d.ts`)
3. Update `/api/chat` route — replace `checkRateLimit()` with `env.RATE_LIMITER_CHAT.limit()`
4. Update contact action — replace `dependencies.rateLimit()` with binding call
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

## D.4 Blog Pagination (Priority: MEDIUM)

Add pagination or virtual scroll to `/blog` page before reaching ~100 posts.
Currently 62 posts render at once. Plan for implementation at ~80 posts.

## D.5 IntersectionObserver Scroll Tracking (Priority: LOW)

Replace scroll event listeners in `use-content-analytics.ts` with IntersectionObserver
sentinel elements at 25/50/75/90% article depth. Zero main-thread cost vs current
scroll event + debounce approach.

## D.6 Knip in CI (Priority: LOW)

Add `npm run knip` to the CI lint job (`.github/workflows/ci.yml`) to catch
dead code on every push. Currently configured but not enforced in CI.
```

- [ ] **Step 2: Commit**

```bash
git add docs/DEFERRED_AUDIT_ITEMS.md
git commit -m "docs: document deferred audit items for upcoming sprints"
```

---

### Task 18: Final Verification & Push

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 2: Run type check**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Run full build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Push to main**

```bash
git push origin main
```

- [ ] **Step 6: Monitor deployment**

Run: `gh run list --repo LecoMV/alexmayhew.dev --limit 3`
Poll until all workflows show `completed | success`.

- [ ] **Step 7: Verify production health**

```bash
curl -sf https://alexmayhew.dev/api/health | jq
curl -sf -o /dev/null -w "%{http_code}" https://alexmayhew.dev/keystatic
# Should return 404 now
```

- [ ] **Step 8: Verify CSP headers include GA4**

```bash
curl -sf -I https://alexmayhew.dev/ 2>&1 | grep -i content-security-policy
# Should contain google-analytics.com and googletagmanager.com
```
