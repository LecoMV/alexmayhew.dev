import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";

import type { NextRequest } from "next/server";

/**
 * Per-request CSP nonce generation (Approach A, middleware-only).
 *
 * See docs/research/csp-nextjs15-cloudflare-workers-2026.md for full rationale.
 *
 * Current state: PARTIAL MIGRATION.
 *   - Nonce is generated and injected into CSP `script-src` alongside
 *     `'strict-dynamic'`.
 *   - Inline scripts (consent-mode bootstrap in layout.tsx, GA4 loader)
 *     consume the nonce via the `x-nonce` request header.
 *   - `'unsafe-inline'` REMAINS in `script-src` as a transitional safety net.
 *
 * TODO(csp-strict-mode): Remove `'unsafe-inline'` from `script-src` after
 * verifying in production that:
 *   (a) Cloudflare Web Analytics beacon still loads (not flagged by CSP
 *       violation reports).
 *   (b) GA4 gtag.js + inline `<Script id="google-analytics">` still fire.
 *   (c) Next.js framework scripts and dynamic chunks inherit trust via
 *       `'strict-dynamic'` on every route (watch for routes that are
 *       statically generated — they will ignore middleware nonces; see
 *       research doc section 13 gotcha).
 * When flipped: flip the `STRICT MODE` skipped test in
 * tests/middleware-nonce.test.ts from `.skip` to active. (CSP ownership is
 * already middleware-only as of 2026-04-16 — custom-worker.ts no longer
 * sets a Content-Security-Policy header.)
 */
function generateNonce(): string {
	// crypto.getRandomValues is available in the Cloudflare Workers runtime
	// (edge) and in Node.js 18+. Buffer is available via nodejs_compat.
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Buffer.from(bytes).toString("base64");
}

export function middleware(request: NextRequest) {
	try {
		const nonce = generateNonce();

		// Note: 'unsafe-inline' retained transitionally (see TODO above).
		// 'strict-dynamic' causes CSP3 browsers to ignore 'unsafe-inline'
		// and host-allowlists, so the partial migration is forward-compatible.
		// 'unsafe-eval' is intentionally NOT included, even in dev — project
		// policy (see tests/middleware.test.ts "should not include unsafe-eval").
		const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.googletagmanager.com;
    worker-src 'self' blob:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com;
    font-src 'self';
    connect-src 'self' https://cloudflareinsights.com https://challenges.cloudflare.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com;
    frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    report-uri /api/csp-report;
    report-to csp-endpoint;
  `
			.replace(/\s{2,}/g, " ")
			.trim();

		// Forward x-nonce + CSP on request headers so Server Components
		// (layout.tsx, GoogleAnalytics) can read them via next/headers.
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-nonce", nonce);
		requestHeaders.set("Content-Security-Policy", cspHeader);

		const response = NextResponse.next({
			request: { headers: requestHeaders },
		});

		response.headers.set("Content-Security-Policy", cspHeader);
		// Reporting API endpoint group referenced by `report-to csp-endpoint`
		// above. Browsers that only understand legacy `report-uri` ignore this.
		response.headers.set("Reporting-Endpoints", `csp-endpoint="/api/csp-report"`);
		// Expose x-nonce on response for observability + tests. Safe: a nonce
		// leaked in response headers is only useful within the same request's
		// page lifecycle, after which it is discarded.
		response.headers.set("x-nonce", nonce);
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		response.headers.set(
			"Permissions-Policy",
			"camera=(), microphone=(), geolocation=(), browsing-topics=()"
		);
		response.headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains; preload"
		);

		return response;
	} catch (err) {
		logger.error("middleware failed to set security headers", { err: String(err) });
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
