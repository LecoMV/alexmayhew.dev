import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("Logo sizing matches pre-swap wordmark dimensions", () => {
	it("footer Image uses wide aspect (40x24) matching tight-viewBox SVG", () => {
		const source = readFileSync("src/components/ui/footer.tsx", "utf-8");
		expect(source).toMatch(/width=\{40\}\s+height=\{24\}/);
		expect(source).toMatch(/className="h-6 w-auto"/);
	});
});
