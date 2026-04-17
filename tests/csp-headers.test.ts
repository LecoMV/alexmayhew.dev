import { readFileSync } from "fs";

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { middleware } from "../middleware";

/**
 * Post-fix contract (2026-04-17): two-layer CSP strategy.
 *
 * Middleware is PREFERRED source — generates per-request nonce for
 * dynamic routes (Server Components, API, anything hitting middleware).
 *
 * custom-worker.ts provides a SAFE-FALLBACK CSP that applies ONLY when
 * the response lacks one. Required because SSG routes on Cloudflare are
 * served from the ASSETS binding and bypass middleware entirely — without
 * the fallback, those routes would ship zero CSP (security regression).
 *
 * The fallback omits nonce (uses 'unsafe-inline' transitionally) but is
 * strictly safer than no CSP. Middleware CSP always wins for dynamic routes.
 */
describe("CSP source of truth", () => {
	const workerSource = readFileSync("custom-worker.ts", "utf-8");

	it("custom-worker only sets CSP when response lacks one (fallback, not overwrite)", () => {
		const executable = workerSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
		// Must guard the set() call with has("Content-Security-Policy") check
		expect(executable).toMatch(
			/if\s*\(!?\s*newHeaders\.has\(\s*["']Content-Security-Policy["']\s*\)/
		);
	});

	it("custom-worker fallback CSP has the minimum required directives", () => {
		expect(workerSource).toMatch(/default-src 'self'/);
		expect(workerSource).toMatch(/frame-ancestors 'none'/);
		expect(workerSource).toMatch(/object-src 'none'/);
	});

	it("middleware CSP contains a per-request nonce in script-src", () => {
		const req = new NextRequest(new URL("https://alexmayhew.dev/"));
		const csp = middleware(req).headers.get("Content-Security-Policy") ?? "";

		expect(csp).toMatch(/script-src[^;]*'nonce-[A-Za-z0-9+/=]+'/);
	});

	it("middleware CSP includes worker-src 'self' blob: (Sentry session replay)", () => {
		const req = new NextRequest(new URL("https://alexmayhew.dev/"));
		const csp = middleware(req).headers.get("Content-Security-Policy") ?? "";

		expect(csp).toMatch(/worker-src[^;]*'self'[^;]*blob:/);
	});
});
