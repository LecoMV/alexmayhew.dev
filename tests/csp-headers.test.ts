import { readFileSync } from "fs";

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { middleware } from "../middleware";

/**
 * Post-fix contract (2026-04-16): middleware.ts is the SOLE source of truth
 * for Content-Security-Policy. custom-worker.ts must NOT set CSP, because
 * doing so overwrites the per-request nonce baked into the middleware CSP.
 */
describe("CSP source of truth", () => {
	const workerSource = readFileSync("custom-worker.ts", "utf-8");

	it("SECURITY_HEADERS in custom-worker.ts does NOT define a Content-Security-Policy key", () => {
		// Strip comments so documentation mentioning CSP doesn't trigger this.
		const executable = workerSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

		expect(executable).not.toMatch(/"Content-Security-Policy"\s*:/);
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
