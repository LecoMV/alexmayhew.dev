import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

/**
 * Voice guide mandates ellipsis (...) instead of em dashes in all content.
 * These source files contain user-facing string content and must comply.
 */
const SOURCE_FILES_NO_EM_DASHES = [
	// Previously cleaned files
	"src/data/pseo/pages.ts",
	"src/data/pseo/migrations.ts",
	"src/data/pseo/comparisons.ts",
	"src/data/pseo/integrations.ts",
	"src/data/projects.ts",
	"src/app/home-page.tsx",
	"src/components/pages/about-page.tsx",
	"src/app/services/services-page-content.tsx",
	"src/components/pages/tools-page.tsx",
	// Remaining 25 files with em dashes
	"src/data/pseo/technologies.ts",
	"src/data/roles/pages.ts",
	"src/app/blog/[slug]/hub-faqs.ts",
	"src/components/blog/table-of-contents.tsx",
	"src/app/api/chat/route.ts",
	"src/app/sitemap.ts",
	"src/lib/blog-themes/themes/classified.ts",
	"src/components/terminal/commands/index.ts",
	"src/app/layout.tsx",
	"src/lib/logger.ts",
	"src/components/terminal/terminal.tsx",
	"src/components/seo/json-ld.tsx",
	"src/components/seo/case-study-json-ld.tsx",
	"src/components/pages/contact-page.tsx",
	"src/components/newsletter/newsletter-signup.tsx",
	"src/components/blog/blog-article.tsx",
	"src/components/analytics/page-analytics.tsx",
	"src/components/analytics/google-analytics.tsx",
	"src/app/work/[slug]/page.tsx",
	"src/app/tools/traceforge/page.tsx",
	"src/app/tools/pilot/page.tsx",
	"src/app/technologies/technologies-page-content.tsx",
	"src/app/actions/newsletter.ts",
	"src/app/actions/contact.ts",
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
