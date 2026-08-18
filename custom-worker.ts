import * as Sentry from "@sentry/cloudflare";

// Custom Worker wrapper:
// 1. Wraps OpenNext handler with Sentry for server-side error tracking
// 2. Injects defense-in-depth security headers on HTML responses
//    (public/_headers only covers CDN static assets).
//
// CSP ownership: middleware.ts is the SOLE source of truth for
// Content-Security-Policy. It generates a per-request nonce, injects it
// into script-src, and forwards both the CSP and x-nonce headers on the
// request (for Server Components) and the response (for the browser).
//
// This Worker used to overwrite CSP via SECURITY_HEADERS, which silently
// clobbered the nonce and kept production on 'unsafe-inline'. That entry
// has been removed. The remaining SECURITY_HEADERS are defense-in-depth
// for HTML responses that bypass middleware entirely (Worker-level error
// pages emitted before Next.js runs) — none of them depend on per-request
// state, so a static set is safe.
//
// Under no circumstances should this Worker generate its own nonce (via
// crypto.randomUUID or HTMLRewriter rewriting script tags) — that would
// desync from the nonce Next.js already baked into the SSR HTML and
// silently break every inline script. See docs/research/
// csp-nextjs15-cloudflare-workers-2026.md section 13.
// @ts-expect-error — .open-next/worker.js generated at build time
import handler from "./.open-next/worker.js";

// Content-Security-Policy: middleware.ts is PREFERRED source (per-request nonce).
// However, SSG routes bypass middleware on Cloudflare (served from ASSETS binding
// as static HTML), so this Worker must provide a safe fallback CSP — applied
// ONLY when the response lacks one. Dynamic routes retain middleware's nonce CSP.
const FALLBACK_CSP = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.googletagmanager.com",
	"worker-src 'self' blob:",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' blob: data: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
	"font-src 'self'",
	"connect-src 'self' https://cloudflareinsights.com https://challenges.cloudflare.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
	"frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"upgrade-insecure-requests",
	"report-uri /api/csp-report",
	"report-to csp-endpoint",
].join("; ");

// Permanently removed URLs. These three programmatic "service" pages encoded a
// consultant identity (fractional CTO / technical advisor / due-diligence) that
// Alex never held. They are disavowed, not moved, so they return 410 Gone (fast
// deindex signal) rather than a 301 that would carry the old-brand association
// onto /services. Kept in the Worker because Next has no native 410 and the page
// data is unpublished in the same change.
const GONE_PATHS = new Set<string>([
	"/services/fractional-cto-for-startups",
	"/services/technical-advisor-for-startups",
	"/services/technical-due-diligence-consultant",
]);

const GONE_BODY =
	'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Gone</title></head><body><h1>410 Gone</h1><p>This page has been permanently removed. See <a href="/services">/services</a>.</p></body></html>';

const SECURITY_HEADERS: Record<string, string> = {
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
	// Reporting API endpoint group referenced by `report-to csp-endpoint`
	// in FALLBACK_CSP. Mirrors middleware so SSG routes report to the same
	// ingestion surface.
	"Reporting-Endpoints": `csp-endpoint="/api/csp-report"`,
};

export default Sentry.withSentry(
	(env) => ({
		dsn: (env as CloudflareEnv).NEXT_PUBLIC_SENTRY_DSN,
		tracesSampleRate: 0.1,
		environment: "production",
		sendDefaultPii: false,
	}),
	{
		async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
			// Production serves ONLY via alexmayhew.dev (workers_dev off for prod).
			// noindexed to avoid an indexable duplicate on a name-collision domain.
			// (The prior guard checked only .pages.dev, which never matched the
			// OpenNext->Workers mirror, and skipped non-HTML responses entirely.)
			const host = request.headers.get("host") ?? "";
			const isMirror = host.endsWith(".workers.dev") || host.endsWith(".pages.dev");

			// Disavowed identity URLs: 410 Gone before the Next handler runs.
			// Route it through SECURITY_HEADERS so the Worker-level page is covered.
			const pathname = new URL(request.url).pathname;
			if (GONE_PATHS.has(pathname)) {
				const goneHeaders = new Headers({
					"content-type": "text/html; charset=utf-8",
					"X-Robots-Tag": "noindex, nofollow",
				});
				for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
					goneHeaders.set(name, value);
				}
				return new Response(GONE_BODY, { status: 410, headers: goneHeaders });
			}

			const response = await handler.fetch(request, env, ctx);

			const contentType = response.headers.get("content-type") ?? "";
			const isHtml = contentType.includes("text/html");

			// Non-HTML responses only need touching to noindex the mirror host.
			if (!isHtml && !isMirror) {
				return response;
			}

			const newHeaders = new Headers(response.headers);

			if (isMirror) {
				newHeaders.set("X-Robots-Tag", "noindex, nofollow");
			}

			if (isHtml) {
				for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
					newHeaders.set(name, value);
				}
				// Safe-fallback CSP for HTML that bypassed middleware (SSG / static
				// HTML from ASSETS). Do NOT overwrite an existing CSP — middleware's
				// per-request nonce CSP wins for dynamic routes.
				if (!newHeaders.has("Content-Security-Policy")) {
					newHeaders.set("Content-Security-Policy", FALLBACK_CSP);
				}
			}

			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			});
		},
	} satisfies ExportedHandler<CloudflareEnv>
);
