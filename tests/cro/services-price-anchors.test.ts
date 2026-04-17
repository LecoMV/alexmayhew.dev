import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Services page renders price anchors for self-qualification", () => {
	const content = readFileSync(
		join(process.cwd(), "src/app/services/services-page-content.tsx"),
		"utf-8"
	);

	it("renders three distinct price range strings via priceRange field", () => {
		const stringMatches = Array.from(content.matchAll(/priceRange:\s*"([^"]+)"/g)).map((m) => m[1]);
		expect(stringMatches).toHaveLength(3);
		const unique = new Set(stringMatches);
		expect(unique.size).toBe(3);
		expect(content).toContain("tier.priceRange");
	});
});
