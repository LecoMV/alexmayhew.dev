import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * SSG routes bypass middleware and rely on custom-worker.ts's FALLBACK_CSP.
 * That fallback must carry the same reporting directives as middleware so
 * CSP violations on static HTML also land in /api/csp-report.
 */
describe("custom-worker FALLBACK_CSP reporting directives", () => {
	const src = readFileSync(join(process.cwd(), "custom-worker.ts"), "utf-8");

	it("includes a report-uri pointing at /api/csp-report", () => {
		expect(src).toContain('"report-uri /api/csp-report"');
	});

	it("includes a report-to csp-endpoint directive", () => {
		expect(src).toContain('"report-to csp-endpoint"');
	});

	it("sets a matching Reporting-Endpoints response header", () => {
		expect(src).toMatch(/Reporting-Endpoints.*csp-endpoint/);
	});
});
