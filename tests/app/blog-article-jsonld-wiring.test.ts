import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * The blog post route must forward `readingTime` to ArticleJsonLd so the
 * rendered Article schema emits timeRequired. Without this wiring, the new
 * ArticleJsonLd.readingTime prop is unused in production.
 */
describe("blog/[slug] wires readingTime into ArticleJsonLd", () => {
	it("parses post.readingTime and passes minutes to the readingTime prop", () => {
		const src = readFileSync(join(process.cwd(), "src/app/blog/[slug]/page.tsx"), "utf-8");
		expect(src).toMatch(/readingTime=\{parseReadingMinutes\(post\.readingTime\)\}/);
	});
});
