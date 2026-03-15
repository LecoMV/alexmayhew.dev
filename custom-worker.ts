// Custom Worker wrapper — injects security headers on HTML responses.
// Cloudflare's public/_headers only applies to CDN static assets,
// not Worker-generated HTML. This wrapper covers ALL responses.
// @ts-expect-error — .open-next/worker.js generated at build time
import handler from "./.open-next/worker.js";

const SECURITY_HEADERS: Record<string, string> = {
	"Content-Security-Policy": [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.googletagmanager.com",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' blob: data: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
		"font-src 'self'",
		"connect-src 'self' https://cloudflareinsights.com https://challenges.cloudflare.com https://*.ingest.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
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
};

export default {
	async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
		const response = await handler.fetch(request, env, ctx);

		const contentType = response.headers.get("content-type") ?? "";
		if (!contentType.includes("text/html")) {
			return response;
		}

		const newHeaders = new Headers(response.headers);
		for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
			newHeaders.set(name, value);
		}

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	},
} satisfies ExportedHandler<CloudflareEnv>;
