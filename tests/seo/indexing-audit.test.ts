import fs from "fs";

import { describe, expect, it } from "vitest";

import type { Metadata } from "next";

describe("P0-1: .pages.dev duplicate content protection", () => {
	it("custom-worker.ts should set X-Robots-Tag noindex for .pages.dev hosts", () => {
		const workerSource = fs.readFileSync("custom-worker.ts", "utf-8");

		expect(workerSource).toContain(".pages.dev");
		expect(workerSource).toContain("X-Robots-Tag");
		expect(workerSource).toContain("noindex");
	});
});

describe("P0-2: Missing canonical URLs", () => {
	it("/newsletter should have canonical", () => {
		const source = fs.readFileSync("src/app/newsletter/page.tsx", "utf-8");
		expect(source).toContain("canonical");
		expect(source).toMatch(/canonical:\s*["'`]\/newsletter["'`]/);
	});

	it("/tools/traceforge should have canonical", async () => {
		const { metadata } = (await import("@/app/tools/traceforge/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical?: string };
		expect(alternates.canonical).toBe("/tools/traceforge");
	});

	it("/tools/pilot should have canonical", async () => {
		const { metadata } = (await import("@/app/tools/pilot/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical?: string };
		expect(alternates.canonical).toBe("/tools/pilot");
	});

	it("/tools/voice-cloner should have canonical", async () => {
		const { metadata } = (await import("@/app/tools/voice-cloner/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical?: string };
		expect(alternates.canonical).toBe("/tools/voice-cloner");
	});

	it("/docs pages should have canonical in generateMetadata", () => {
		const source = fs.readFileSync("src/app/docs/[[...slug]]/page.tsx", "utf-8");
		expect(source).toContain("canonical");
	});

	it("/newsletter/[slug] pages should have canonical in generateMetadata", () => {
		const source = fs.readFileSync("src/app/newsletter/[slug]/page.tsx", "utf-8");
		expect(source).toContain("canonical");
	});
});

describe("P0-3: Sitemap completeness", () => {
	it("sitemap should include /tools/voice-cloner", () => {
		const sitemapSource = fs.readFileSync("src/app/sitemap.ts", "utf-8");
		expect(sitemapSource).toContain("tools/voice-cloner");
	});

	it("sitemap should include docs pages", () => {
		const sitemapSource = fs.readFileSync("src/app/sitemap.ts", "utf-8");
		expect(sitemapSource).toContain("docsPages");
	});
});

describe("P0-5: ArticleJsonLd mainEntityOfPage", () => {
	it("should not hardcode /blog/ prefix in mainEntityOfPage @id", () => {
		const source = fs.readFileSync("src/components/seo/article-json-ld.tsx", "utf-8");
		// NOT hardcode `/blog/${slug}` — newsletter pages pass slug="newsletter/issue-1"
		expect(source).not.toContain("`${siteUrl}/blog/${slug}`");
	});

	it("publisher should reference Organization, not Person", () => {
		const source = fs.readFileSync("src/components/seo/article-json-ld.tsx", "utf-8");
		// Google requires publisher to be Organization type for Article rich results
		expect(source).toContain("#organization");
		expect(source).not.toMatch(/publisher:.*#person/);
	});
});
