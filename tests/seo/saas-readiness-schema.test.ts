import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("saas-readiness page schema", () => {
	it("imports and renders SoftwareJsonLd at top of rendered component", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/tools/saas-readiness/page.tsx"),
			"utf-8"
		);
		expect(content).toMatch(/from ["']@\/components\/seo\/software-json-ld["']/);
		expect(content).toMatch(/<SoftwareJsonLd/);
	});
});
