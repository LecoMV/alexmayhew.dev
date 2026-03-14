import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
	try {
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

		const response = NextResponse.next();

		response.headers.set("Content-Security-Policy", cspHeader);
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		response.headers.set(
			"Permissions-Policy",
			"camera=(), microphone=(), geolocation=(), browsing-topics=()"
		);
		response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

		return response;
	} catch {
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
