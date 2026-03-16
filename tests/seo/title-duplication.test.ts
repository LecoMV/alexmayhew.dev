import { describe, expect, it } from "vitest";

/**
 * Root layout has `title.template: "%s | Alex Mayhew"`.
 * Pages must NOT append "| Alex Mayhew" themselves — that doubles the suffix.
 */
describe("page titles do not duplicate site name suffix", () => {
	it("no page metadata contains '| Alex Mayhew' since root template adds it", async () => {
		const { readFileSync } = await import("fs");
		const { globSync } = await import("glob");

		const files = globSync("src/app/**/page.tsx");
		const violations: string[] = [];

		for (const file of files) {
			// Skip root layout
			if (file.includes("layout.tsx")) continue;

			const content = readFileSync(file, "utf-8");

			// Match title strings that contain "| Alex Mayhew" (but not the template definition)
			const titleMatches = content.match(/title:\s*[`"'].*\|\s*Alex Mayhew[`"']/g) || [];
			for (const match of titleMatches) {
				violations.push(`${file}: ${match.trim()}`);
			}
		}

		expect(
			violations,
			`Pages with "| Alex Mayhew" in title (root template already adds this):\n${violations.join("\n")}`
		).toHaveLength(0);
	});
});
