# CSP Best Practices: Next.js 15 + Cloudflare Workers (2026-03-14, updated 2026-03-14)

**Status:** CURRENT
**Session:** Deep research on upgrading middleware.ts CSP from 'unsafe-inline' to nonce-based strict policy; extended with custom-worker.ts + HTMLRewriter analysis

---

## TL;DR

The current middleware.ts uses `'unsafe-inline'` in both `script-src` and `style-src`. This is a valid but weak policy.
A meaningful upgrade to nonce-based CSP is achievable but has a hard constraint: **every page served must be dynamically rendered** (no static caching). For a portfolio site this is acceptable if understood.

The biggest blocker is the **Consent Mode v2 inline script** in `layout.tsx` — a raw `<script dangerouslySetInnerHTML>` that runs before gtag loads. This script cannot receive a nonce in a Server Component layout without plumbing `x-nonce` through `headers()`.

---

## 1. Nonce Generation in Next.js 15 Middleware on Edge Runtime

### Verdict: FULLY SUPPORTED

`middleware.ts` runs in the Cloudflare Worker (via OpenNext) and has full access to:

- `crypto.randomUUID()` — available in the Web Crypto API on edge
- `Buffer.from(...).toString('base64')` — available in Cloudflare Workers with `nodejs_compat`

The nonce flow (from official Next.js docs, updated 2026-02-27):

1. Middleware generates a nonce per request: `Buffer.from(crypto.randomUUID()).toString('base64')`
2. Middleware sets the nonce in **two places**:
   - `Content-Security-Policy` header (on both request and response)
   - `x-nonce` request header (for Server Components to read)
3. Next.js App Router reads the `Content-Security-Policy` header during SSR and **automatically attaches the nonce** to framework scripts, hydration scripts, and Next.js-managed `<Script>` components
4. Custom inline scripts (like the Consent Mode v2 block) must manually read `x-nonce` via `headers()` in the layout

**Critical constraint:** Nonce-based CSP forces dynamic rendering on every page. Static optimization and ISR are disabled. Partial Prerendering (PPR) is incompatible. For a Cloudflare Workers deployment this means every page hit triggers a Worker invocation — the performance cost is Worker cold start latency (~0ms on warm), not server-side rendering time.

### SRI (Subresource Integrity) as an alternative

Next.js 15 supports hash-based SRI as an **experimental** feature — build-time hashes instead of per-request nonces, allowing static generation to work. **HOWEVER: this is Webpack-only.** This project uses Turbopack. SRI is not available.

```
// NOT available for this project:
experimental: { sri: { algorithm: 'sha256' } }  // Webpack only
```

---

## 2. Removing 'unsafe-inline' from script-src

### Verdict: ACHIEVABLE with nonce + strict-dynamic

The pattern from official Next.js docs:

```typescript
script-src 'self' 'nonce-${nonce}' 'strict-dynamic'
```

How `'strict-dynamic'` works: once a script is trusted (via nonce), it can load other scripts dynamically without each one needing explicit allowlisting. This handles Next.js's internal chunk loading and dynamic imports automatically.

`'unsafe-inline'` is ignored by browsers that support CSP3 when `'strict-dynamic'` is present — so including it for CSP2 fallback is harmless but currently unnecessary.

### The inline script problem in this project

`layout.tsx` line 147–151 uses a raw `<script dangerouslySetInnerHTML>` for Consent Mode v2. This is an inline script that needs a nonce. The fix is:

```tsx
// app/layout.tsx — must be a Server Component (it is, no 'use client')
import { headers } from "next/headers";

export default async function RootLayout({ children }) {
	const nonce = (await headers()).get("x-nonce") ?? "";
	return (
		<html>
			<head>
				<script nonce={nonce} dangerouslySetInnerHTML={{ __html: `...consent mode script...` }} />
			</head>
		</html>
	);
}
```

**Note:** `layout.tsx` is currently a synchronous function (`export default function`). Adding `await headers()` makes it async — this is fine for App Router Server Components.

---

## 3. Removing 'unsafe-inline' from style-src

### Verdict: REQUIRES 'unsafe-inline' — not removable without replacing Framer Motion

**Root cause:** Framer Motion injects inline `style` attributes (e.g., `style="opacity: 1; transform: translateY(0px)"`). The CSP `style-src` directive controls `<style>` tags AND `style=""` attributes. Nonces cannot be applied to `style` attributes — only to `<style>` and `<script>` tags.

The Framer Motion maintainers have marked this as `wontfix` (GitHub issue #1727). The library was designed around inline style mutation for animation performance.

**Practical verdict:**

- `style-src 'unsafe-inline'` is **required** as long as Framer Motion is used
- This applies to the `style=""` attribute vector only — the security impact is lower than `unsafe-inline` in `script-src` (style injection cannot execute arbitrary JavaScript directly in most modern browsers)
- A nonce on `style-src` would cover `<style>` tags but NOT `style=""` attributes, so it does not eliminate the need for `'unsafe-inline'`

**If you need strict style-src in future:** Replace Framer Motion with a zero-runtime CSS animation library (e.g., CSS custom properties + Tailwind animation utilities + `@starting-style`).

---

## 4. Tailwind 4 and CSP

### Verdict: NO 'unsafe-inline' REQUIRED for Tailwind 4

Tailwind v4 compiles to a single external CSS file (`globals.css`) at build time. It does not inject inline `<style>` tags or `style=""` attributes at runtime. The output is a static stylesheet loaded via `<link>`, which is controlled by `style-src 'self'` — no 'unsafe-inline' needed from Tailwind.

The `'unsafe-inline'` requirement in `style-src` comes entirely from **Framer Motion**, not Tailwind.

---

## 5. Framer Motion and CSP

### Verdict: REQUIRES 'unsafe-inline' in style-src (style attribute vector)

Framer Motion uses the WAAPI (Web Animations API) and direct `element.style` mutation for performance. These mutations show up as inline `style=""` attributes in the DOM. The `style-src` CSP directive's `'unsafe-inline'` token is required to permit these.

**What 'unsafe-inline' in style-src actually allows:**

- Inline `<style>` tags
- `style=""` HTML attributes
- `element.style` JavaScript mutations (considered safe by browsers even without this token in practice — browsers vary here)

**Security risk of 'unsafe-inline' in style-src:** Lower than in script-src. CSS injection can cause UI spoofing (fake login forms, data exfiltration via CSS selectors) but cannot execute arbitrary JavaScript in the same way as inline script injection. Still worth noting, not zero risk.

---

## 6. Google Analytics GA4 CSP Directives

### Source: Google Tag Platform official docs (developers.google.com/tag-platform/security/guides/csp)

**Standard GA4 (no Google Signals):**

```
script-src  https://*.googletagmanager.com
img-src     https://*.google-analytics.com https://*.googletagmanager.com
connect-src https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com
```

**This project uses `allow_google_signals: true`** (see google-analytics.tsx line 35). Google Signals requires additional domains:

```
img-src     + https://*.g.doubleclick.net https://*.google.com
connect-src + https://*.g.doubleclick.net https://*.google.com
frame-src   + https://www.googletagmanager.com
```

**No 'unsafe-inline' or 'unsafe-eval' required** for standard GA4.

**However:** The inline `<Script id="google-analytics">` block in `google-analytics.tsx` (lines 26–39) is an inline script. With nonce-based CSP, Next.js automatically applies the nonce to `<Script>` components with `id` props and `strategy="afterInteractive"` — this is handled by Next.js's automatic nonce propagation.

**connect-src must include both:**

- `https://*.google-analytics.com` — GA4 data collection endpoint
- `https://*.analytics.google.com` — GA4 alternative collection endpoint (regional)
- `https://*.googletagmanager.com` — GTM/gtag script host

The current middleware.ts **is missing all GA4 domains** from connect-src. Tracking data is currently being blocked or relying on a fallback.

---

## 7. Cloudflare Turnstile CSP Directives

### Source: developers.cloudflare.com/turnstile/reference/content-security-policy/

**Required directives:**

```
script-src  https://challenges.cloudflare.com
frame-src   https://challenges.cloudflare.com
connect-src 'self'  (required for pre-clearance mode — cf_clearance cookie endpoint)
```

**Turnstile supports `'strict-dynamic'`:** When using nonce-based CSP with `'strict-dynamic'`, Turnstile works correctly if you include `https://challenges.cloudflare.com` in `script-src` AND pass the nonce to the Turnstile `api.js` script tag. Cloudflare handles the rest via strict-dynamic propagation.

**Current middleware.ts** already has `https://challenges.cloudflare.com` in both `script-src` and `frame-src`. The `connect-src 'self'` requirement is met by the existing `'self'` token. Turnstile is correctly configured.

---

## 8. Cloudflare Web Analytics (beacon) CSP

**Required:**

```
script-src  https://static.cloudflareinsights.com
connect-src https://cloudflareinsights.com
```

Both are present in current middleware.ts. Already correct.

---

## 9. Cloudflare Workers CSP at the Platform Level

### Transform Rules (not usable for dynamic nonces)

Cloudflare Transform Rules (HTTP Response Header Modification) can set static CSP headers. These run at the Cloudflare edge BEFORE the Worker response. However:

1. They cannot generate per-request nonces (no dynamic values)
2. They apply AFTER middleware.ts runs in the Worker — if both set CSP, behavior depends on header ordering (last header wins in most browsers, or both are set, violating specs)
3. For nonce-based CSP: Transform Rules cannot be used. Middleware is the only option.

**Verdict:** Do NOT use Cloudflare Transform Rules for CSP on this project. Keep CSP in middleware.ts exclusively.

**Bot Fight Mode caveat:** If Cloudflare Bot Fight Mode is enabled in the dashboard, Cloudflare injects its own inline JavaScript into HTML responses. This JavaScript does not carry a nonce. It will generate CSP violations. Turnstile (already deployed) provides equivalent bot protection — **disable Bot Fight Mode if enabling nonce-based CSP.**

---

## 10. Production-Ready CSP for This Stack

### The Complete Policy

```typescript
// middleware.ts — production CSP for alexmayhew.dev
// Requires: dynamic rendering on all pages (no ISR/static caching)
// Requires: layout.tsx reads x-nonce header for inline consent script

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	try {
		const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
		const isDev = process.env.NODE_ENV === "development";

		const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic'
        https://challenges.cloudflare.com
        https://static.cloudflareinsights.com
        https://*.googletagmanager.com
        ${isDev ? "'unsafe-eval'" : ""};
      style-src 'self' 'unsafe-inline';
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' blob: data:
        https://*.google-analytics.com
        https://*.googletagmanager.com
        https://*.g.doubleclick.net
        https://*.google.com;
      connect-src 'self'
        https://cloudflareinsights.com
        https://challenges.cloudflare.com
        https://*.google-analytics.com
        https://*.analytics.google.com
        https://*.googletagmanager.com
        https://*.g.doubleclick.net
        https://*.google.com
        https://*.ingest.sentry.io;
      frame-src 'self'
        https://challenges.cloudflare.com
        https://www.googletagmanager.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
			.replace(/\s{2,}/g, " ")
			.trim();

		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-nonce", nonce);
		requestHeaders.set("Content-Security-Policy", cspHeader);

		const response = NextResponse.next({
			request: { headers: requestHeaders },
		});

		response.headers.set("Content-Security-Policy", cspHeader);
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		response.headers.set(
			"Permissions-Policy",
			"camera=(), microphone=(), geolocation=(), browsing-topics=()"
		);

		return response;
	} catch {
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
```

### Required layout.tsx change

`app/layout.tsx` must become async and read the nonce for the inline consent script:

```tsx
import { headers } from 'next/headers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <html lang="en" ...>
      <head>
        <JsonLd />
        <LocalBusinessJsonLd />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=...consent mode v2 script...`,
          }}
        />
      </head>
      <body>...</body>
    </html>
  );
}
```

### Required GoogleAnalytics component change

The `<Script id="google-analytics">` inline block needs the nonce passed explicitly if Next.js doesn't auto-propagate it in all cases:

```tsx
// Pass nonce down from layout via prop, or read headers() directly in the component
// Next.js 15 docs say it auto-propagates via x-nonce, but defensive explicit passing is safer
<Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
	{`gtag('js', new Date()); ...`}
</Script>
```

---

## 11. What's Missing From Current middleware.ts

| Gap                                               | Impact                                                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| No GA4 domains in connect-src                     | GA4 data collection silently fails or is blocked                        |
| No GA4 domains in img-src                         | GA4 pixel/beacon requests blocked                                       |
| No `https://*.googletagmanager.com` in script-src | gtag.js external script blocked                                         |
| `'unsafe-eval'` absent but present in dev only    | Correct for prod — current prod script-src lacks it                     |
| No Google Fonts domains                           | Fonts loaded from `font-src 'self'` — may work if fonts are self-hosted |
| No Sentry domains in connect-src                  | Sentry error reporting broken                                           |
| `'unsafe-inline'` in script-src                   | Primary weakness — eliminates XSS protection for scripts                |

---

## 12. Incremental Upgrade Path

If full nonce migration is too risky at once, this is the order:

### Step 1 (immediate, low risk): Fix connect-src gaps

Add GA4, Sentry, and Google Fonts domains. No behavior change, just unblocking currently-broken tracking.

### Step 2 (medium risk): Add Google Fonts to font-src

Add `https://fonts.gstatic.com` only if fonts are not self-hosted.

### Step 3 (highest risk): Nonce-based script-src

Implement nonce flow: middleware generates nonce, passes x-nonce, layout reads it, consent script gets nonce. Test in dev thoroughly. Disables static page optimization.

---

## Summary Table

| Question                                        | Answer                                                                     | Confidence |
| ----------------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| Can middleware generate nonces on edge?         | Yes — `crypto.randomUUID()` + Buffer work in CF Workers                    | VERIFIED   |
| Can 'unsafe-inline' be removed from script-src? | Yes — nonce + strict-dynamic replaces it                                   | VERIFIED   |
| Can 'unsafe-inline' be removed from style-src?  | No — Framer Motion requires it                                             | VERIFIED   |
| Does Tailwind 4 require 'unsafe-inline'?        | No — pure external CSS                                                     | VERIFIED   |
| Does Framer Motion require 'unsafe-inline'?     | Yes — inline style attributes, wontfix                                     | VERIFIED   |
| GA4 connect-src domains?                        | _.google-analytics.com, _.analytics.google.com, \*.googletagmanager.com    | VERIFIED   |
| Turnstile CSP requirements?                     | script-src + frame-src: challenges.cloudflare.com; supports strict-dynamic | VERIFIED   |
| CSP at Cloudflare Transform Rule level?         | Possible for static policies, not usable for nonces                        | VERIFIED   |
| SRI as nonce alternative?                       | Webpack only — not available with Turbopack                                | VERIFIED   |

---

---

## 13. Custom-Worker.ts + HTMLRewriter Approach (2026-03-14 addition)

### The Architecture Question: Worker Wrapper vs Middleware

The site now uses a **dual-layer** security header system:

1. `middleware.ts` — runs inside the OpenNext/Next.js request pipeline, sets CSP on the response
2. `custom-worker.ts` — wraps the entire OpenNext handler, overrides headers on HTML responses

The custom-worker.ts **overwrites** whatever middleware.ts set. Both currently emit `'unsafe-inline'` so there is no conflict, but for nonce-based CSP this creates a critical problem: the nonce must be **the same value** in the CSP header AND in the HTML script tags. Middleware generates the nonce during SSR and bakes it into the HTML; the Worker wrapper runs post-SSR. They cannot share the same nonce if both independently generate one.

### Approach A: Middleware-only (RECOMMENDED)

Move all nonce logic to `middleware.ts`, remove CSP from `custom-worker.ts`, keep only non-CSP security headers in the Worker wrapper.

**How it works:**

1. `middleware.ts` generates nonce per request
2. Sets `Content-Security-Policy: ... 'nonce-${nonce}' 'strict-dynamic' ...` on both request and response headers
3. Sets `x-nonce: ${nonce}` on the request headers (forwarded to SSR)
4. Next.js reads `Content-Security-Policy` header during SSR, extracts nonce, auto-applies to all framework scripts
5. `layout.tsx` reads `x-nonce` via `headers()` and passes nonce to the inline consent script
6. `GoogleAnalytics` component passes nonce explicitly to inline `<Script id="google-analytics">`
7. `custom-worker.ts` strips its own CSP override (or skips setting CSP), keeps other security headers

**Confirmed behavior (Next.js 15 docs, 2026-02-27):** Next.js automatically attaches the extracted nonce to:

- Framework scripts (React, Next.js runtime)
- Page-specific JS bundles
- Inline scripts generated by Next.js internals
- `<Script>` components with `strategy="afterInteractive"` or `"beforeInteractive"`

**Critical production gotcha (GitHub discussion #80997):** If any page is statically generated at build time, the nonce from middleware is NOT applied to the pre-built HTML — the HTML was rendered at build time when no request headers existed. The page will load but every script tag will lack the nonce, causing CSP violations. Fix: either add `export const dynamic = 'force-dynamic'` to all pages, or use `await connection()` from `next/server` to opt into dynamic rendering.

### Approach B: HTMLRewriter in custom-worker.ts (NOT RECOMMENDED for this project)

The Worker wrapper could use Cloudflare's HTMLRewriter to add `nonce="xxx"` attributes to all `<script>` tags in the streamed response:

```typescript
// Pattern only — NOT recommended for this project (see reasons below)
class NonceInjector {
	constructor(private nonce: string) {}
	element(element: Element) {
		// Only inject on script tags that don't already have a nonce
		if (!element.getAttribute("nonce")) {
			element.setAttribute("nonce", this.nonce);
		}
	}
}

export default {
	async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
		const nonce = btoa(crypto.randomUUID());
		const response = await handler.fetch(request, env, ctx);

		const contentType = response.headers.get("content-type") ?? "";
		if (!contentType.includes("text/html")) return response;

		const csp = buildCspHeader(nonce); // function that builds the CSP string
		const newHeaders = new Headers(response.headers);
		newHeaders.set("Content-Security-Policy", csp);

		// HTMLRewriter adds nonce to every <script> tag post-SSR
		return new HTMLRewriter().on("script", new NonceInjector(nonce)).transform(
			new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			})
		);
	},
};
```

**Why this is NOT recommended for this project:**

1. **It misses Next.js's inline script content, not just attributes.** Next.js emits many inline scripts as `<script>` tags with no `src`. HTMLRewriter can add `nonce` to their tag attributes, but the _body content_ (the JS code) is unaffected. This is actually fine — nonce on the element attribute is exactly what CSP checks. However...

2. **The nonce generated in custom-worker.ts is NOT available to middleware.ts or SSR.** The Worker wraps the entire OpenNext handler. To inject nonces via HTMLRewriter, the Worker generates the nonce AFTER Next.js has rendered the page. Next.js cannot retroactively bake this nonce into its generated scripts because Next.js already ran. The HTMLRewriter would add `nonce="xxx"` to the script tags, which would match the CSP header set by the Worker — this actually WOULD work for simple script tag rewriting.

3. **BUT: Next.js emits a nonce-based CSP script loader.** When Next.js detects a nonce in the `Content-Security-Policy` request header (set by middleware), it generates its internal script loader differently, using nonces internally. If the Worker sets a DIFFERENT nonce on the response CSP header than what middleware put in the request, these will diverge. The scripts Next.js rendered (using middleware's nonce) will not match the Worker's nonce on the CSP response header.

4. **The fundamental race condition:** Two nonces cannot coexist for a single request. Either middleware owns the nonce (Approach A) or the Worker owns it. If the Worker owns it, Next.js cannot know the nonce at SSR time, so its script loader won't use it — and any Next.js-managed inline script will have no nonce at all, causing CSP violations even with HTMLRewriter patching.

5. **HTMLRewriter only catches static `<script>` tags.** Next.js also dynamically loads chunks via `__NEXT_CHUNK_LOAD__`. With `'strict-dynamic'`, scripts loaded by a nonced trusted script inherit trust automatically. This makes HTMLRewriter less necessary but does not eliminate the nonce-SSR synchronization problem.

6. **Performance:** HTMLRewriter is streaming and adds minimal overhead (~0.1-1ms per response for a typical HTML page). It is NOT a performance problem. But it IS unnecessary complexity when Approach A works natively.

### Approach C: Hash of inline consent script (NO PER-REQUEST NONCE)

Instead of per-request nonces, compute a SHA-256 hash of the exact inline consent script content and add it to `script-src`:

```
script-src 'self' 'strict-dynamic' 'sha256-BASE64_HASH_HERE' https://...
```

**Feasibility:** The consent script in `layout.tsx` is static (same content on every build). Its SHA-256 can be computed at build time and hardcoded into the CSP. This eliminates the need for dynamic rendering.

**Limitations:**

- Any change to the inline script content requires recomputing and updating the hash in middleware/Worker
- Only covers the consent script. Next.js's own framework inline scripts (hydration, chunk loader, etc.) are NOT static — they change between builds and requests. These still need nonce or `'unsafe-inline'`.
- **SRI for Next.js internals is Webpack-only (experimental), not available with Turbopack.** So you still cannot avoid `'unsafe-inline'` for Next.js framework scripts without nonces.
- Conclusion: hash works for the consent script specifically but does NOT allow removing `'unsafe-inline'` from `script-src` overall. Not a complete solution.

### Decision Matrix: Which Approach for alexmayhew.dev

| Approach                       | Removes 'unsafe-inline' from script-src | Requires dynamic rendering   | Complexity | Recommended         |
| ------------------------------ | --------------------------------------- | ---------------------------- | ---------- | ------------------- |
| A: Middleware nonce            | Yes                                     | Yes (all pages)              | Low        | YES                 |
| B: Worker HTMLRewriter nonce   | Yes (if done correctly)                 | Yes (pages must match nonce) | High       | No                  |
| C: Hash of consent script only | No (Next.js internals still need it)    | No                           | Low        | No                  |
| Status quo: 'unsafe-inline'    | No                                      | No                           | None       | Acceptable baseline |

**For alexmayhew.dev: Use Approach A.** The custom-worker.ts should NOT generate nonces. It should skip setting CSP (letting middleware handle it) and keep only the non-nonce security headers.

### Required changes summary for full nonce migration

**custom-worker.ts:** Remove `Content-Security-Policy` from `SECURITY_HEADERS` constant. Let middleware.ts own CSP entirely.

**middleware.ts:** Add nonce generation, `x-nonce` request header, forward CSP on both request and response headers (see Section 10).

**app/layout.tsx:** Make async, read `x-nonce` via `await headers()`, pass nonce to inline consent script.

**src/components/analytics/google-analytics.tsx:** Read nonce from headers and pass explicitly to `<Script id="google-analytics">` — or rely on Next.js auto-propagation (verify in production before trusting it).

**Dynamic rendering:** Add `export const dynamic = 'force-dynamic'` to the root layout or to all page files, OR use `await connection()` from `next/server` in each page. Without this, statically-generated pages will have nonce mismatches in production (works in dev, breaks in prod — a particularly deceptive failure mode).

---

## Sources

- [Next.js CSP Guide (official, 2026-02-27)](https://nextjs.org/docs/app/guides/content-security-policy)
- [Cloudflare Turnstile CSP Reference](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)
- [Google Tag Platform CSP Guide](https://developers.google.com/tag-platform/security/guides/csp)
- [Framer Motion CSP Issue #1727 (wontfix)](https://github.com/framer/motion/issues/1727)
- [Next.js CSP Production Bug Discussion #80997](https://github.com/vercel/next.js/discussions/80997)
- [OpenNext Custom Worker Docs](https://opennext.js.org/cloudflare/howtos/custom-worker)
- [Cloudflare HTMLRewriter API](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
- [cloudflare-worker-csp-nonce reference impl](https://github.com/moveyourdigital/cloudflare-worker-csp-nonce)
- Prior research: `docs/research/security-tooling-nextjs-cloudflare-2026.md`
