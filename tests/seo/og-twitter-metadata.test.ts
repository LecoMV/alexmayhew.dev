import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("OG and Twitter metadata completeness", () => {
	it("privacy/page.tsx should have openGraph metadata", () => {
		const content = readFileSync(join(process.cwd(), "src/app/privacy/page.tsx"), "utf-8");
		expect(content).toContain("openGraph");
	});

	it("terms/page.tsx should have openGraph metadata", () => {
		const content = readFileSync(join(process.cwd(), "src/app/terms/page.tsx"), "utf-8");
		expect(content).toContain("openGraph");
	});

	it("newsletter/page.tsx should have twitter metadata", () => {
		const content = readFileSync(join(process.cwd(), "src/app/newsletter/page.tsx"), "utf-8");
		expect(content).toContain("twitter");
	});

	it("tools/page.tsx should have twitter metadata", () => {
		const content = readFileSync(join(process.cwd(), "src/app/tools/page.tsx"), "utf-8");
		expect(content).toContain("twitter");
	});
});

describe("Canonicals should use relative format", () => {
	it("no page files should use absolute siteUrl in canonical", () => {
		const files = [
			"src/app/blog/[slug]/page.tsx",
			"src/app/technologies/[slug]/page.tsx",
			"src/app/technologies/page.tsx",
		];
		for (const file of files) {
			const content = readFileSync(join(process.cwd(), file), "utf-8");
			expect(content, `${file} uses absolute canonical`).not.toMatch(/canonical:.*siteUrl/);
		}
	});
});
