import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Command palette lazy loading", () => {
	it("layout.tsx should not statically import CommandPaletteServer", () => {
		const content = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf-8");
		expect(content).not.toMatch(/import\s*\{?\s*CommandPaletteServer\s*\}?\s*from/);
	});

	it("layout.tsx should use LazyCommandPaletteServer in JSX", () => {
		const content = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf-8");
		expect(content).toContain("<LazyCommandPaletteServer");
	});
});
