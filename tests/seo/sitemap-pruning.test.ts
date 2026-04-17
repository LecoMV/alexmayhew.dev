import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Updated 2026-04-17: migration/integration/comparison pSEO pages are now
// indexable and included in the sitemap. The original "wait for DR>20" gate
// was blocking quality-gated content while near-zero backlinks are the real
// indexing bottleneck. See docs/superpowers/plans/audit-2026-04-17/seo.md.
describe("Sitemap and indexability for pSEO pages", () => {
	it("sitemap spreads migrationPages into the exported list", () => {
		const content = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(content).toMatch(/\.\.\.migrationPages/);
	});

	it("sitemap spreads integrationPages into the exported list", () => {
		const content = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(content).toMatch(/\.\.\.integrationPages/);
	});

	it("sitemap spreads comparisonPages into the exported list", () => {
		const content = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(content).toMatch(/\.\.\.comparisonPages/);
	});

	it("migration page metadata no longer declares index: false", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/services/migrations/[slug]/page.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("index: false");
	});

	it("integration page metadata no longer declares index: false", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/services/integrations/[slug]/page.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("index: false");
	});

	it("comparison page metadata no longer declares index: false", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/services/comparisons/[slug]/page.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("index: false");
	});
});
