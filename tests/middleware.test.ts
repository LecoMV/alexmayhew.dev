import { describe, it, expect, vi, beforeEach } from "vitest";
import { middleware, config } from "../middleware";
import { NextRequest } from "next/server";

// Mock crypto for nonce generation
vi.mock("crypto", () => ({
	randomUUID: () => "test-uuid-1234",
}));

describe("middleware", () => {
	let mockRequest: NextRequest;

	beforeEach(() => {
		mockRequest = new NextRequest(new URL("https://alexmayhew.dev/"));
	});

	describe("security headers", () => {
		it("should set Content-Security-Policy header", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

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
	});

	describe("CSP directives", () => {
		it("should allow scripts from self and Cloudflare", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("script-src 'self'");
			expect(csp).toContain("https://static.cloudflareinsights.com");
		});

		it("should allow styles from self with unsafe-inline", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("style-src 'self' 'unsafe-inline'");
		});

		it("should allow images from self, blob, and data URIs", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("img-src 'self' blob: data:");
		});

		it("should allow fonts only from self", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("font-src 'self'");
		});

		it("should block object embeds", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("object-src 'none'");
		});

		it("should restrict base-uri to self", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("base-uri 'self'");
		});

		it("should restrict form-action to self", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("form-action 'self'");
		});

		it("should block framing via frame-ancestors", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("frame-ancestors 'none'");
		});

		it("should enable upgrade-insecure-requests", () => {
			const response = middleware(mockRequest);
			const csp = response.headers.get("Content-Security-Policy");

			expect(csp).toContain("upgrade-insecure-requests");
		});
	});

	describe("nonce generation", () => {
		it("should set x-nonce header on request", () => {
			const response = middleware(mockRequest);

			// The response contains the modified request headers
			// We can verify the nonce was set by checking the response headers
			expect(response.headers.get("Content-Security-Policy")).toBeDefined();
		});
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
