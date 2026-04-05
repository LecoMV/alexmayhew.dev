import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Auto-update schema date via NEXT_PUBLIC_BUILD_TIME", () => {
	it("sitemap.ts should use NEXT_PUBLIC_BUILD_TIME instead of hardcoded date", () => {
		const content = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(content).toContain("NEXT_PUBLIC_BUILD_TIME");
		expect(content).not.toMatch(/siteLastUpdated\s*=\s*new Date\("\d{4}-\d{2}-\d{2}"\)/);
	});

	it("about/page.tsx should use NEXT_PUBLIC_BUILD_TIME for dateModified", () => {
		const content = readFileSync(join(process.cwd(), "src/app/about/page.tsx"), "utf-8");
		expect(content).toContain("NEXT_PUBLIC_BUILD_TIME");
		expect(content).not.toMatch(/dateModified:\s*"\d{4}-\d{2}-\d{2}"/);
	});
});
