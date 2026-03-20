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

describe("P1-7: Privacy/Terms date stability", () => {
	it("privacy page should not use new Date() for Last updated", () => {
		const source = fs.readFileSync("src/app/privacy/page.tsx", "utf-8");
		expect(source).not.toMatch(/new Date\(\)\.toLocaleDateString/);
	});

	it("terms page should not use new Date() for Last updated", () => {
		const source = fs.readFileSync("src/app/terms/page.tsx", "utf-8");
		expect(source).not.toMatch(/new Date\(\)\.toLocaleDateString/);
	});
});

describe("P1-6: Privacy page accuracy", () => {
	it("privacy page should mention Google Analytics if GA4 is used", () => {
		const source = fs.readFileSync("src/app/privacy/page.tsx", "utf-8");
		expect(source).toContain("Google Analytics");
	});
});

describe("P1-9: Footer internal links", () => {
	it("footer should include /newsletter link", () => {
		const source = fs.readFileSync("src/components/ui/footer.tsx", "utf-8");
		expect(source).toContain('href: "/newsletter"');
	});
});

describe("P1-11: Schema consolidation", () => {
	it("should not have both ConsultingService and ProfessionalService schemas", () => {
		const jsonLdSource = fs.readFileSync("src/components/seo/json-ld.tsx", "utf-8");
		const localBizSource = fs.readFileSync(
			"src/components/seo/local-business-json-ld.tsx",
			"utf-8"
		);
		const jsonLdHasBusiness = jsonLdSource.includes("ConsultingService");
		const localBizHasBusiness = localBizSource.includes("ProfessionalService");
		expect(jsonLdHasBusiness && localBizHasBusiness).toBe(false);
	});
});

describe("P1-10: Navigation internal links", () => {
	it("navigation should include /newsletter link", () => {
		const source = fs.readFileSync("src/components/ui/navigation.tsx", "utf-8");
		expect(source).toContain('href: "/newsletter"');
	});
});

describe("P2-19: Remove deprecated HowTo schema", () => {
	it("migration pages should not use HowToJsonLd", () => {
		const source = fs.readFileSync("src/app/services/migrations/[slug]/page.tsx", "utf-8");
		expect(source).not.toContain("HowToJsonLd");
	});

	it("integration pages should not use HowToJsonLd", () => {
		const source = fs.readFileSync("src/app/services/integrations/[slug]/page.tsx", "utf-8");
		expect(source).not.toContain("HowToJsonLd");
	});
});

describe("P2-15: Dynamic OG images on all page types", () => {
	it("role pages should use dynamic OG images via /og route", () => {
		const source = fs.readFileSync("src/app/for/[role]/page.tsx", "utf-8");
		expect(source).toContain("/og?");
	});

	it("technology pages should use dynamic OG images via /og route", () => {
		const source = fs.readFileSync("src/app/technologies/[slug]/page.tsx", "utf-8");
		expect(source).toContain("/og?");
	});

	it("migration pages should use dynamic OG images via /og route", () => {
		const source = fs.readFileSync("src/app/services/migrations/[slug]/page.tsx", "utf-8");
		expect(source).toContain("/og?");
	});

	it("integration pages should use dynamic OG images via /og route", () => {
		const source = fs.readFileSync("src/app/services/integrations/[slug]/page.tsx", "utf-8");
		expect(source).toContain("/og?");
	});

	it("comparison pages should use dynamic OG images via /og route", () => {
		const source = fs.readFileSync("src/app/services/comparisons/[slug]/page.tsx", "utf-8");
		expect(source).toContain("/og?");
	});
});

describe("P3-22: Image sitemap for blog posts", () => {
	it("sitemap should include images for blog posts", () => {
		const source = fs.readFileSync("src/app/sitemap.ts", "utf-8");
		expect(source).toContain("images:");
	});
});

describe("P2-21: SoftwareApplication schema for tools", () => {
	it("traceforge should have SoftwareApplication structured data", () => {
		const source = fs.readFileSync("src/app/tools/traceforge/page.tsx", "utf-8");
		expect(source).toContain("SoftwareJsonLd");
	});

	it("voice-cloner should have SoftwareApplication structured data", () => {
		const source = fs.readFileSync("src/app/tools/voice-cloner/page.tsx", "utf-8");
		expect(source).toContain("SoftwareJsonLd");
	});

	it("pilot should have SoftwareApplication structured data", () => {
		const source = fs.readFileSync("src/app/tools/pilot/page.tsx", "utf-8");
		expect(source).toContain("SoftwareJsonLd");
	});
});

describe("P3-23: RSS lastBuildDate consistency", () => {
	it("blog/rss.xml should not use new Date() for lastBuildDate", () => {
		const source = fs.readFileSync("src/app/blog/rss.xml/route.ts", "utf-8");
		expect(source).not.toContain("new Date().toUTCString()");
	});
});

describe("P2-13/14: _headers deprecated directives", () => {
	it("should use browsing-topics, not interest-cohort", () => {
		const headers = fs.readFileSync("public/_headers", "utf-8");
		expect(headers).not.toContain("interest-cohort");
	});
});

describe("P2-16: dynamicParams = false on dynamic routes", () => {
	it("blog/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("services/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/services/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("for/[role] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/for/[role]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("technologies/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/technologies/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("work/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/work/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("services/migrations/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/services/migrations/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("services/integrations/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/services/integrations/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});

	it("services/comparisons/[slug] should export dynamicParams = false", () => {
		const source = fs.readFileSync("src/app/services/comparisons/[slug]/page.tsx", "utf-8");
		expect(source).toContain("dynamicParams");
	});
});

describe("P2-17: Canonical URL consistency", () => {
	it("blog hub should use relative canonical, not absolute", async () => {
		const source = fs.readFileSync("src/app/blog/page.tsx", "utf-8");
		expect(source).not.toMatch(/canonical:\s*["']https?:\/\//);
	});
});

describe("P2-18: Blog generateStaticParams excludes drafts", () => {
	it("should filter out drafts in generateStaticParams", () => {
		const source = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf-8");
		expect(source).toMatch(/generateStaticParams[\s\S]*?filter[\s\S]*?draft/);
	});
});

describe("P2-20: HSTS preload", () => {
	it("middleware should include preload in HSTS header", () => {
		const source = fs.readFileSync("middleware.ts", "utf-8");
		expect(source).toContain("preload");
	});
});
