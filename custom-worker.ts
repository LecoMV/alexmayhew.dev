import * as Sentry from "@sentry/cloudflare";

// Custom Worker wrapper:
// 1. Wraps OpenNext handler with Sentry for server-side error tracking
// 2. Injects security headers on HTML responses (public/_headers only covers CDN static assets)
// @ts-expect-error — .open-next/worker.js generated at build time
import handler from "./.open-next/worker.js";

const SECURITY_HEADERS: Record<string, string> = {
	"Content-Security-Policy": [
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
