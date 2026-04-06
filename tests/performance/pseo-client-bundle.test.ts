import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Ensures pSEO client components do not import data-fetching functions
 * from @/data/pseo, which would bundle 195KB of pSEO data into client JS.
 *
 * Labels (TECHNOLOGY_LABELS, INDUSTRY_LABELS) and data-fetching functions
 * (getPageBySlug, getPublishedPages, getRelatedPages) must be resolved
 * server-side and passed as props.
 */
describe("pSEO client bundle: no @/data/pseo imports", () => {
	const clientComponents = [
		"src/app/services/[slug]/service-page-content.tsx",
		"src/app/services/comparisons/[slug]/comparison-page-content.tsx",
		"src/app/services/migrations/[slug]/migration-page-content.tsx",
		"src/app/services/integrations/[slug]/integration-page-content.tsx",
	];

	for (const filePath of clientComponents) {
		const name = filePath.split("/").slice(-2).join("/");

		it(`${name} should not have value imports from @/data/pseo`, () => {
			const content = readFileSync(join(process.cwd(), filePath), "utf-8");
			// Type-only imports are erased at compile time (zero bundle cost).
			// Only value imports drag 195KB of pSEO data into the client bundle.
			const lines = content.split("\n");
			const valueImports = lines.filter(
				(line) => /from\s+["']@\/data\/pseo/.test(line) && !/^import\s+type\s/.test(line.trim())
			);
			expect(valueImports).toEqual([]);
		});

		it(`${name} should be a "use client" component`, () => {
			const content = readFileSync(join(process.cwd(), filePath), "utf-8");
			expect(content).toMatch(/^"use client"/);
		});
	}
});
