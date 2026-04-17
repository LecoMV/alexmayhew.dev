import * as Sentry from "@sentry/cloudflare";

// Custom Worker wrapper:
// 1. Wraps OpenNext handler with Sentry for server-side error tracking
// 2. Injects security headers on HTML responses (public/_headers only covers CDN static assets)
//
// CSP ownership: middleware.ts generates the per-request nonce and sets
// Content-Security-Policy on both request and response headers. This Worker
// wrapper's SECURITY_HEADERS overwrites the CSP header with a static policy
// ONLY as a fallback for HTML responses that never passed through middleware
// (e.g. error pages emitted by the Worker itself before Next.js runs).
//
// TODO(csp-strict-mode): When the nonce migration in middleware.ts flips to
// strict mode (removes 'unsafe-inline' from script-src), this fallback CSP
// MUST be kept in lockstep — or, preferably, the "Content-Security-Policy"
// entry should be dropped from SECURITY_HEADERS so middleware owns CSP
// unambiguously. Under no circumstances should this Worker generate its own
// nonce (via crypto.randomUUID or HTMLRewriter rewriting script tags) — that
// would desync from the nonce Next.js already baked into the SSR HTML and
// silently break every inline script. See docs/research/
// csp-nextjs15-cloudflare-workers-2026.md section 13.
// @ts-expect-error — .open-next/worker.js generated at build time
import handler from "./.open-next/worker.js";

const SECURITY_HEADERS: Record<string, string> = {
	"Content-Security-Policy": [
		"default-src 'self'",
		// 'unsafe-inline' retained as a transitional safety net until
		// middleware's nonce migration is verified in production (CF Insights
		// + GA4 + Next.js framework scripts). See TODO(csp-strict-mode) above.
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
	].join("; "),
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
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
			const response = await handler.fetch(request, env, ctx);

			const contentType = response.headers.get("content-type") ?? "";
			if (!contentType.includes("text/html")) {
				return response;
			}

			const newHeaders = new Headers(response.headers);

			// Prevent Google from indexing the .pages.dev mirror (duplicate content)
			const host = request.headers.get("host") ?? "";
			if (host.endsWith(".pages.dev")) {
				newHeaders.set("X-Robots-Tag", "noindex, nofollow");
			}

			for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
				newHeaders.set(name, value);
			}

			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			});
		},
	} satisfies ExportedHandler<CloudflareEnv>
);
