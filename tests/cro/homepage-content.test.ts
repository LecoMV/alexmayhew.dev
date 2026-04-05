import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Homepage content expansion", () => {
	it("homepage should have an About snippet with link to /about", () => {
		const content = readFileSync(join(process.cwd(), "src/app/home-page.tsx"), "utf-8");
		expect(content).toContain('href="/about"');
		expect(content).toMatch(/15\+?\s*years/i);
	});
});
