import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const FILES = [
	"src/app/services/services-page-content.tsx",
	"src/app/demo/backgrounds/page.tsx",
	"src/app/demo/page.tsx",
	"src/components/traceforge/preset-selector.tsx",
];

describe("No bare delay transitions without spring spec", () => {
	for (const file of FILES) {
		it(`${file} uses springTransition with delay (not bare delay)`, () => {
			const source = readFileSync(resolve(process.cwd(), file), "utf-8");
			const bareDelayPattern = /transition=\{\{\s*delay:\s*[^,}]+\s*\}\}/;
			expect(bareDelayPattern.test(source)).toBe(false);
		});
	}
});
