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

/**
 * The three disavowed consultant-identity service URLs return 410 Gone (fast
 * deindex) rather than 404, and never 301 (which would carry the old brand onto
 * /services). Next has no native 410, so the Worker emits it. Also: every
 * *.workers.dev mirror response must be noindexed (prod disables workers_dev but
 * preview keeps it), which the prior .pages.dev-only guard never did.
 */
describe("custom-worker removal + mirror hygiene", () => {
	const src = readFileSync(join(process.cwd(), "custom-worker.ts"), "utf-8");

	it("declares all three removed identity paths", () => {
		expect(src).toContain("/services/fractional-cto-for-startups");
		expect(src).toContain("/services/technical-advisor-for-startups");
		expect(src).toContain("/services/technical-due-diligence-consultant");
	});

	it("returns HTTP 410 with a noindex body for those paths", () => {
		expect(src).toMatch(/status:\s*410/);
		expect(src).toMatch(/410[\s\S]*noindex/);
	});

	it("noindexes the .workers.dev mirror host, not only .pages.dev", () => {
		expect(src).toContain(".workers.dev");
	});
});
