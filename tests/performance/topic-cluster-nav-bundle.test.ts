import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("TopicClusterNav client bundle boundary", () => {
	it("should not have value imports from @/data/pseo", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/topic-cluster-nav.tsx"),
			"utf-8"
		);
		const lines = content.split("\n");
		const valueImports = lines.filter(
			(line) => /from\s+["']@\/data\/pseo/.test(line) && !/^import\s+type\s/.test(line.trim())
		);
		expect(valueImports).toEqual([]);
	});
});
