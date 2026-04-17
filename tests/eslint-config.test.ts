import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("eslint config honors underscore-prefix convention for unused vars", () => {
	it("declares @typescript-eslint/no-unused-vars with argsIgnorePattern: ^_", () => {
		const source = readFileSync("eslint.config.mjs", "utf-8");
		expect(source).toMatch(/@typescript-eslint\/no-unused-vars/);
		expect(source).toMatch(/argsIgnorePattern.*\^_/);
		expect(source).toMatch(/varsIgnorePattern.*\^_/);
	});
});
