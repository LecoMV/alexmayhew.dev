import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("llms.txt content", () => {
	it("does not cap spokes via slice(0, 20) ... AI crawlers need all articles", () => {
		const content = readFileSync(join(process.cwd(), "src/app/llms.txt/route.ts"), "utf-8");
		expect(content).not.toMatch(/\.slice\(0,\s*20\)/);
	});
});
