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

// Content-Security-Policy intentionally NOT in this map. See middleware.ts.
const SECURITY_HEADERS: Record<string, string> = {
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
