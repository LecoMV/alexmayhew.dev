import { readFileSync } from "fs";
import { resolve } from "path";

import { describe, expect, it } from "vitest";

/**
 * Enforces that each dynamic route page imports its primary data lookup
 * from `@/lib/cached-data` so generateStaticParams / generateMetadata /
 * default export share a single cache()-wrapped call per slug, rather
 * than each running an independent `.find()` over the dataset.
 */

const repoRoot = resolve(__dirname, "..", "..");

function readSource(relPath: string): string {
	return readFileSync(resolve(repoRoot, relPath), "utf8");
}

const cases: Array<{ file: string; fetcher: string }> = [
	{ file: "src/app/services/[slug]/page.tsx", fetcher: "getPseoPageBySlug" },
	{
		file: "src/app/services/comparisons/[slug]/page.tsx",
		fetcher: "getComparisonBySlug",
	},
	{
		file: "src/app/services/integrations/[slug]/page.tsx",
		fetcher: "getIntegrationBySlug",
	},
	{
		file: "src/app/services/migrations/[slug]/page.tsx",
		fetcher: "getMigrationBySlug",
	},
	{ file: "src/app/technologies/[slug]/page.tsx", fetcher: "getTechnologyBySlug" },
	{ file: "src/app/for/[role]/page.tsx", fetcher: "getRoleBySlug" },
	{ file: "src/app/work/[slug]/page.tsx", fetcher: "getWorkBySlug" },
];

describe("dynamic routes use cached-data fetchers", () => {
	for (const { file, fetcher } of cases) {
		it(`${file} imports ${fetcher} from @/lib/cached-data`, () => {
			const src = readSource(file);
			expect(src).toContain(`from "@/lib/cached-data"`);
			expect(src).toContain(fetcher);
		});

		it(`${file} does not retain the uncached data lookup inside generateMetadata/default export`, () => {
			const src = readSource(file);
			// Only the import line or the cached call should reference the fetcher import.
			// The original per-slug data functions should no longer be called directly
			// at the three callsites (static params is allowed to use list helpers).
			const uncached: Record<string, string[]> = {
				getPseoPageBySlug: ["getPageBySlug("],
				getComparisonBySlug: ["getComparisonPageBySlug("],
				getIntegrationBySlug: ["getIntegrationPageBySlug("],
				getMigrationBySlug: ["getMigrationPageBySlug("],
				getTechnologyBySlug: ["getTechnology("],
				getRoleBySlug: ["getRolePageBySlug("],
				getWorkBySlug: ["getProjectById("],
			};
			const forbidden = uncached[fetcher] ?? [];
			for (const needle of forbidden) {
				// Allow the pattern to appear only in comments or not at all;
				// simplest check: the exact call token must not occur twice
				// (once as import, once as call) — post-migration the import
				const occurrences = src.split(needle).length - 1;
				expect(occurrences, `${needle} still present in ${file}`).toBe(0);
			}
		});
	}
});
