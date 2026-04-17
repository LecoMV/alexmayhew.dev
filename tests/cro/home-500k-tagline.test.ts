import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Homepage surfaces the $500K architecture mistake tagline", () => {
	it("src/app/home-page.tsx contains the $500K signature tagline", () => {
		const content = readFileSync(join(process.cwd(), "src/app/home-page.tsx"), "utf-8");
		const hasTagline = content.includes("$500K") || content.includes("$500k");
		expect(hasTagline, "Homepage must reference the $500K architecture mistake tagline").toBe(true);
	});
});
