import { readFileSync } from "fs";

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

import { middleware } from "../middleware";

const CSP_HEADER = "Content-Security-Policy";

/**
 * TDD gate for nonce-based CSP migration.
 *
 * See docs/research/csp-nextjs15-cloudflare-workers-2026.md (Approach A).
 *
 * Partial-migration contract (as of 2026-04-16):
 *   - Middleware MUST generate a per-request nonce.
 *   - CSP header MUST carry `'nonce-<value>'` in script-src.
 *   - The `x-nonce` request header MUST be set so Server Components can read it.
 *   - Middleware is the SOLE source of truth for CSP. custom-worker.ts must
 *     NOT set a Content-Security-Policy header — doing so overwrites the
 *     per-request nonce and was the root cause of the live site still
 *     carrying only 'unsafe-inline' despite G2 plumbing.
 *   - `'unsafe-inline'` is RETAINED in script-src as a transitional safety net —
 *     see the TODO in middleware.ts for what blocks removal.
 *   - When the site is fully on nonce + strict-dynamic, the
 *     `script-src MUST NOT contain unsafe-inline` assertion below will flip
 *     from `.skip` to active.
 */
describe("middleware nonce generation", () => {
	let mockRequest: NextRequest;

	beforeEach(() => {
		mockRequest = new NextRequest(new URL("https://alexmayhew.dev/"));
	});

	it("generates a per-request nonce and injects it into script-src", () => {
		const response = middleware(mockRequest);
		const csp = response.headers.get(CSP_HEADER);

		expect(csp).toBeDefined();
		// Expect nonce-<base64> present in script-src directive
		expect(csp).toMatch(/script-src[^;]*'nonce-[A-Za-z0-9+/=]+'/);
	});

	it("produces a fresh nonce on every request (non-deterministic)", () => {
		const r1 = middleware(new NextRequest(new URL("https://alexmayhew.dev/")));
		const r2 = middleware(new NextRequest(new URL("https://alexmayhew.dev/")));

		const csp1 = r1.headers.get(CSP_HEADER) ?? "";
		const csp2 = r2.headers.get(CSP_HEADER) ?? "";

		const nonce1 = csp1.match(/'nonce-([A-Za-z0-9+/=]+)'/)?.[1];
		const nonce2 = csp2.match(/'nonce-([A-Za-z0-9+/=]+)'/)?.[1];

		expect(nonce1).toBeDefined();
		expect(nonce2).toBeDefined();
		expect(nonce1).not.toBe(nonce2);
	});

	it("forwards the nonce to Server Components via x-nonce request header", () => {
		const response = middleware(mockRequest);
		// (NextResponse.next({ request: { headers } }) preserves request headers for SSR)
		const csp = response.headers.get(CSP_HEADER) ?? "";
		const nonceFromCsp = csp.match(/'nonce-([A-Za-z0-9+/=]+)'/)?.[1];

		// layers (layout.tsx via headers()) can read it. Next.js forwards
		const xNonce = response.headers.get("x-nonce");
		expect(xNonce).toBe(nonceFromCsp);
	});

	it("CSP uses strict-dynamic to allow nonced scripts to load chunks", () => {
		const response = middleware(mockRequest);
		const csp = response.headers.get(CSP_HEADER) ?? "";

		expect(csp).toMatch(/script-src[^;]*'strict-dynamic'/);
	});

	/**
	 * Partial migration: 'unsafe-inline' is retained as a safety net because
	 * production verification of CF Insights + GA4 with a strict nonce policy
	 * is not possible in this environment. Once verified in prod, this test
	 * should flip to asserting absence.
	 *
	 * When you flip this: also remove 'unsafe-inline' from custom-worker.ts
	 * SECURITY_HEADERS (or preferably drop Content-Security-Policy from
	 * SECURITY_HEADERS entirely so middleware owns CSP unambiguously).
	 */
	it.skip("STRICT MODE: script-src MUST NOT contain 'unsafe-inline'", () => {
		const response = middleware(mockRequest);
		const csp = response.headers.get(CSP_HEADER) ?? "";

		// Isolate the script-src directive
		const scriptSrc = csp.match(/script-src[^;]*/)?.[0] ?? "";
		expect(scriptSrc).not.toContain("'unsafe-inline'");
	});

	it("retains 'unsafe-inline' in script-src during partial migration (transitional)", () => {
		const response = middleware(mockRequest);
		const csp = response.headers.get(CSP_HEADER) ?? "";
		const scriptSrc = csp.match(/script-src[^;]*/)?.[0] ?? "";

		// This assertion will be inverted when we complete the migration.
		expect(scriptSrc).toContain("'unsafe-inline'");
	});
});

describe("custom-worker CSP nonce-readiness", () => {
	const workerSource = readFileSync("custom-worker.ts", "utf-8");

	it("documents that middleware owns CSP (no duplicate nonce generation)", () => {
		// middleware's nonce baked into SSR HTML — see research doc section 13).
		// comments that intentionally reference these APIs.
		const executable = workerSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
		expect(executable).not.toMatch(/crypto\.randomUUID\(\)/);
		expect(executable).not.toMatch(/new\s+HTMLRewriter/);
	});

	it("SECURITY_HEADERS does NOT contain a Content-Security-Policy key (middleware owns CSP)", () => {
		// Strip comments so documentation mentioning CSP doesn't false-positive.
		const executable = workerSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
		expect(executable).not.toMatch(/"Content-Security-Policy"\s*:/);
	});
});
