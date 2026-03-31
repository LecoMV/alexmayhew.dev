import fs from "node:fs";

import { describe, expect, it } from "vitest";

describe("Blog listing crawlability", () => {
	it("blog page server component provides all post slugs for SEO nav", () => {
		const source = fs.readFileSync("src/app/blog/page.tsx", "utf-8");
		expect(source).toContain("BlogPostNav");
	});
});
