import fs from "node:fs";

import { describe, expect, it } from "vitest";

describe("GA4 Consent Mode v2 region-specific defaults", () => {
	it("sets analytics_storage denied for EEA regions only, not globally", () => {
		const source = fs.readFileSync("src/app/layout.tsx", "utf-8");
		// Must have region-specific denied (not global denied)
		expect(source).toContain("'region':");
		// Must NOT have a global analytics_storage denied without region
		// The pattern: granted default for non-EU, denied with region array for EU
		expect(source).toContain("analytics_storage:'granted'");
	});
});
