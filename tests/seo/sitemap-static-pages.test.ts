import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("sitemap static pages", () => {
	it("includes /tools/saas-readiness", () => {
		const content = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(content).toContain("/tools/saas-readiness");
	});
});
