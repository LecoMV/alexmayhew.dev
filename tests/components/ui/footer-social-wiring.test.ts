import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Footer must render social icons through SocialLink so every outbound
 * click fires GA4 social_click via the shared client island.
 */
describe("Footer uses SocialLink for social icons", () => {
	it("imports and renders SocialLink", () => {
		const src = readFileSync(join(process.cwd(), "src/components/ui/footer.tsx"), "utf-8");
		expect(src).toMatch(/from "\.\/social-link"/);
		expect(src).toMatch(/<SocialLink/);
	});
});
