import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Sitemap pruning for domain authority", () => {
	it("sitemap should not include migration pages until domain authority builds", () => {
		const content = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(content).not.toMatch(/\.\.\.migrationPages/);
	});

	it("migration page metadata should have noindex", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/services/migrations/[slug]/page.tsx"),
			"utf-8"
		);
		expect(content).toContain("index: false");
	});
});
