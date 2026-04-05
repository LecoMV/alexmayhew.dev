import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

/**
 * Voice guide mandates ellipsis (...) instead of em dashes in all content.
 * These source files contain user-facing string content and must comply.
 */
const SOURCE_FILES_NO_EM_DASHES = [
	"src/data/pseo/pages.ts",
	"src/data/pseo/migrations.ts",
	"src/data/pseo/comparisons.ts",
	"src/data/pseo/integrations.ts",
	"src/data/projects.ts",
	"src/app/home-page.tsx",
	"src/components/pages/about-page.tsx",
	"src/app/services/services-page-content.tsx",
	"src/components/pages/tools-page.tsx",
];

function findEmDashes(filePath: string): string[] {
	const content = readFileSync(filePath, "utf-8");
	const lines = content.split("\n");
	const violations: string[] = [];

	lines.forEach((line, i) => {
		// Skip frontmatter delimiters (---) and import/comment lines
		if (line.trim() === "---") return;

		if (line.includes("\u2014")) {
			violations.push(`Line ${i + 1}: ${line.trim().slice(0, 100)}`);
		}
	});

	return violations;
}

describe("source files use ellipsis not em dashes", () => {
	it.each(SOURCE_FILES_NO_EM_DASHES)("%s contains no em dash characters", (filePath) => {
		const violations = findEmDashes(filePath);
		expect(
			violations,
			`Em dash (U+2014) violations in ${filePath}:\n${violations.slice(0, 10).join("\n")}${violations.length > 10 ? `\n... and ${violations.length - 10} more` : ""}`
		).toHaveLength(0);
	});
});
