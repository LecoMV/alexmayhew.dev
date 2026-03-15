import { readdirSync, readFileSync } from "fs";

import { describe, expect, it } from "vitest";

describe("blog voice rules", () => {
	it("cognitive-debt post contains no em dashes or double dashes", () => {
		const content = readFileSync("content/blog/cognitive-debt-ai-teams.mdx", "utf-8");
		const lines = content.split("\n");
		const violations: string[] = [];

		lines.forEach((line, i) => {
			if (line === "---") return;
			if (line.includes("—"))
				violations.push(`Line ${i + 1} (em dash): ${line.trim().slice(0, 80)}`);
			if (line.includes(" -- "))
				violations.push(`Line ${i + 1} (double dash): ${line.trim().slice(0, 80)}`);
		});

		expect(violations, `Voice violations found:\n${violations.join("\n")}`).toHaveLength(0);
	});

	it("metr-paradox post contains no em dashes or double dashes", () => {
		const content = readFileSync("content/blog/metr-paradox-ai-productivity.mdx", "utf-8");
		const lines = content.split("\n");
		const violations: string[] = [];

		lines.forEach((line, i) => {
			if (line === "---") return;
			if (line.includes("—"))
				violations.push(`Line ${i + 1} (em dash): ${line.trim().slice(0, 80)}`);
			if (line.includes(" -- "))
				violations.push(`Line ${i + 1} (double dash): ${line.trim().slice(0, 80)}`);
		});

		expect(violations, `Voice violations found:\n${violations.join("\n")}`).toHaveLength(0);
	});
});
