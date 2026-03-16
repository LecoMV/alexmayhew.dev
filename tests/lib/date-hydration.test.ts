import { describe, expect, it } from "vitest";

/**
 * React #418 hydration fix: dates must render identically on server (UTC) and client (any timezone).
 * When frontmatter has date: "2026-03-15", toLocaleDateString without timeZone: "UTC"
 * renders "March 14" in US timezones (midnight UTC = 7pm EST on the 14th).
 */
describe("date formatting hydration safety", () => {
	it("blog theme dateFormat includes timeZone: UTC to prevent hydration mismatch", async () => {
		const { defaultTheme } = await import("@/lib/blog-themes/themes/default");
		expect(defaultTheme.typography.dateFormat).toHaveProperty("timeZone", "UTC");
	});

	it("no toLocaleDateString calls without timeZone: UTC in blog components", async () => {
		const { readFileSync } = await import("fs");
		const files = [
			"src/components/blog/blog-article.tsx",
			"src/components/blog/layouts/cards-layout.tsx",
			"src/components/blog/layouts/dossier-layout.tsx",
			"src/components/blog/layouts/terminal-layout.tsx",
			"src/app/newsletter/page.tsx",
			"src/app/newsletter/[slug]/page.tsx",
			"src/app/privacy/page.tsx",
			"src/app/terms/page.tsx",
		];

		for (const file of files) {
			const content = readFileSync(file, "utf-8");
			const calls = content.match(/toLocaleDateString\([^)]*\{[^}]*\}/gs) || [];
			for (const call of calls) {
				expect(call, `${file} has toLocaleDateString without timeZone: "UTC"`).toContain(
					"timeZone"
				);
			}
		}
	});
});
