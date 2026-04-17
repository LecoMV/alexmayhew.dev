import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("collection page JSON-LD", () => {
	it("/work page includes CollectionPage JSON-LD with ItemList", () => {
		const content = readFileSync(join(process.cwd(), "src/app/work/page.tsx"), "utf-8");
		expect(content).toContain("CollectionPage");
		expect(content).toContain("ItemList");
	});

	it("/tools page includes CollectionPage JSON-LD with ItemList", () => {
		const content = readFileSync(join(process.cwd(), "src/app/tools/page.tsx"), "utf-8");
		expect(content).toContain("CollectionPage");
		expect(content).toContain("ItemList");
	});
});
