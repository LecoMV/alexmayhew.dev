import { describe, expect, it } from "vitest";

import robots from "@/app/robots";

describe("robots.txt disallow rules", () => {
	it("disallows /offline for general crawlers (no content value)", () => {
		const config = robots();
		const generalRule = config.rules as Array<{ userAgent: string; disallow?: string[] | string }>;
		const general = generalRule.find((r) => r.userAgent === "*");
		expect(general).toBeDefined();
		const disallow = Array.isArray(general?.disallow) ? general!.disallow : [general?.disallow];
		expect(disallow).toContain("/offline");
	});
});
