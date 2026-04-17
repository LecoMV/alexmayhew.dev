import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { config, middleware } from "../middleware";

const CSP_HEADER = "Content-Security-Policy";

describe("middleware", () => {
	let mockRequest: NextRequest;

	beforeEach(() => {
		mockRequest = new NextRequest(new URL("https://alexmayhew.dev/"));
	});

	describe("security headers", () => {
		it("should set Content-Security-Policy header", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toBeDefined();
			expect(csp).toContain("default-src 'self'");
		});

		it("should set X-Frame-Options to DENY", () => {
			const response = middleware(mockRequest);

			expect(response.headers.get("X-Frame-Options")).toBe("DENY");
		});

		it("should set X-Content-Type-Options to nosniff", () => {
			const response = middleware(mockRequest);

			expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
		});

		it("should set Referrer-Policy header", () => {
			const response = middleware(mockRequest);

			expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
		});

		it("should set Permissions-Policy header", () => {
			const response = middleware(mockRequest);
			const permissionsPolicy = response.headers.get("Permissions-Policy");

			expect(permissionsPolicy).toBeDefined();
			expect(permissionsPolicy).toContain("camera=()");
			expect(permissionsPolicy).toContain("microphone=()");
			expect(permissionsPolicy).toContain("geolocation=()");
		});

		it("should set Strict-Transport-Security header", () => {
			const response = middleware(mockRequest);

			expect(response.headers.get("Strict-Transport-Security")).toBe(
				"max-age=31536000; includeSubDomains; preload"
			);
		});
	});

	describe("CSP directives", () => {
		it("should allow scripts from self and Cloudflare", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("script-src 'self'");
			expect(csp).toContain("https://static.cloudflareinsights.com");
			expect(csp).toContain("https://challenges.cloudflare.com");
		});

		it("should not include unsafe-eval", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).not.toContain("'unsafe-eval'");
		});

		it("should allow styles from self with unsafe-inline", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("style-src 'self' 'unsafe-inline'");
		});

		it("should allow images from self, blob, and data URIs", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("img-src 'self' blob: data:");
		});

		it("should declare a report-uri for CSP violation ingestion", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);
			expect(csp).toContain("report-uri /api/csp-report");
		});

		it("should declare a report-to group for the Reporting API", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);
			expect(csp).toContain("report-to csp-endpoint");
		});

		it("should set a Reporting-Endpoints response header matching the report-to group", () => {
			const response = middleware(mockRequest);
			const endpoints = response.headers.get("Reporting-Endpoints");
			expect(endpoints).toContain(`csp-endpoint="/api/csp-report"`);
		});

		it("should allow fonts only from self", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("font-src 'self'");
		});

		it("should allow connections to Sentry and Cloudflare", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("connect-src 'self'");
			expect(csp).toContain("https://cloudflareinsights.com");
			expect(csp).toContain("https://*.ingest.sentry.io");
			expect(csp).toContain("https://*.ingest.us.sentry.io");
		});

		it("should allow GA4 domains in connect-src", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("https://*.google-analytics.com");
			expect(csp).toContain("https://*.analytics.google.com");
			expect(csp).toContain("https://*.googletagmanager.com");
		});

		it("should allow GA4 scripts in script-src", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("script-src");
			expect(csp).toContain("https://*.googletagmanager.com");
		});

		it("should allow GA4 image domains in img-src", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("https://*.google-analytics.com");
			expect(csp).toContain("https://*.googletagmanager.com");
			expect(csp).toContain("https://*.g.doubleclick.net");
			expect(csp).toContain("https://*.google.com");
		});

		it("should allow Google Tag Manager frames in frame-src", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("https://www.googletagmanager.com");
		});

		it("should allow frames from Cloudflare Turnstile", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("frame-src 'self' https://challenges.cloudflare.com");
		});

		it("should block object embeds", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("object-src 'none'");
		});

		it("should restrict base-uri to self", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("base-uri 'self'");
		});

		it("should restrict form-action to self", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("form-action 'self'");
		});

		it("should block framing via frame-ancestors", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("frame-ancestors 'none'");
		});

		it("should enable upgrade-insecure-requests", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get(CSP_HEADER);

			expect(csp).toContain("upgrade-insecure-requests");
		});
	});
});

describe("middleware error handling", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return passthrough response when headers.set throws", () => {
		const mockRequest = new NextRequest(new URL("https://alexmayhew.dev/"));
		const originalNext = NextResponse.next;
		let callCount = 0;

		vi.spyOn(NextResponse, "next").mockImplementation(() => {
			callCount++;
			if (callCount === 1) {
				// First call: return a response whose headers.set throws
				const badResponse = originalNext.call(NextResponse);
				vi.spyOn(badResponse.headers, "set").mockImplementation(() => {
					throw new Error("Simulated header failure");
				});
				return badResponse;
			}
			// Second call (from catch): return a normal passthrough
			return originalNext.call(NextResponse);
		});

		const response = middleware(mockRequest);
		expect(response).toBeDefined();
		expect(response.status).toBe(200);
	});
});

describe("middleware config", () => {
	it("should have a matcher configuration", () => {
		expect(config.matcher).toBeDefined();
		expect(Array.isArray(config.matcher)).toBe(true);
	});

	it("should exclude API routes from middleware", () => {
		const matcherSource = config.matcher[0].source;

		// The regex should NOT match /api paths
		expect(matcherSource).toContain("(?!api");
	});

	it("should exclude _next/static from middleware", () => {
		const matcherSource = config.matcher[0].source;

		expect(matcherSource).toContain("_next/static");
	});

	it("should exclude _next/image from middleware", () => {
		const matcherSource = config.matcher[0].source;

		expect(matcherSource).toContain("_next/image");
	});

	it("should exclude favicon.ico from middleware", () => {
		const matcherSource = config.matcher[0].source;

		expect(matcherSource).toContain("favicon.ico");
	});

	it("should exclude prefetch requests", () => {
		const matcher = config.matcher[0];

		expect(matcher.missing).toBeDefined();
		expect(matcher.missing).toContainEqual({
			type: "header",
			key: "next-router-prefetch",
		});
		expect(matcher.missing).toContainEqual({
			type: "header",
			key: "purpose",
			value: "prefetch",
		});
	});
});
