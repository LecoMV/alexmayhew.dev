import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("technologies page WEBSITE_REF consistency", () => {
	it("does not use inline ${siteUrl}#website @id (should use WEBSITE_REF from schema-utils)", () => {
		const content = readFileSync(join(process.cwd(), "src/app/technologies/page.tsx"), "utf-8");
		expect(content).not.toMatch(/"@id":\s*`\$\{siteUrl\}#website`/);
	});
});
