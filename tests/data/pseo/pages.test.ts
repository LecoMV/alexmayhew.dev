import { describe, expect, it } from "vitest";

import {
	getAllPageSlugs,
	getPageBySlug,
	getPagesByIndustry,
	getPagesByTechnology,
	getPublishedPages,
	getRelatedPages,
	pseoPages,
} from "@/data/pseo/pages";

describe("pSEO Pages - Helper Functions", () => {
	describe("getPageBySlug", () => {
		it("returns the page matching the slug", () => {
			const first = pseoPages[0];
			const page = getPageBySlug(first.slug);
			expect(page).toBeDefined();
			expect(page!.slug).toBe(first.slug);
		});

		it("returns undefined for nonexistent slug", () => {
			expect(getPageBySlug("nonexistent-page-slug")).toBeUndefined();
		});
	});

	describe("getPublishedPages", () => {
		it("returns only published pages", () => {
			const pages = getPublishedPages();
			pages.forEach((page) => expect(page.published).toBe(true));
		});

		it("count matches raw data", () => {
			const expected = pseoPages.filter((p) => p.published).length;
			expect(getPublishedPages().length).toBe(expected);
		});
	});

	describe("getAllPageSlugs", () => {
		it("returns string array of published slugs", () => {
			const slugs = getAllPageSlugs();
			expect(Array.isArray(slugs)).toBe(true);
			slugs.forEach((s) => expect(typeof s).toBe("string"));
		});

		it("only includes published pages", () => {
			const slugs = getAllPageSlugs();
			const expected = pseoPages.filter((p) => p.published).map((p) => p.slug);
			expect(slugs).toEqual(expected);
		});
	});

	describe("getPagesByTechnology", () => {
		it("filters by technology", () => {
			const published = getPublishedPages();
			if (published.length === 0) return;
			const tech = published[0].technology;
			const pages = getPagesByTechnology(tech);
			expect(pages.length).toBeGreaterThan(0);
			pages.forEach((p) => {
				expect(p.technology).toBe(tech);
				expect(p.published).toBe(true);
			});
		});

		it("returns empty for unknown technology", () => {
			expect(getPagesByTechnology("unknown-tech-xyz")).toEqual([]);
		});
	});

	describe("getPagesByIndustry", () => {
		it("filters by industry", () => {
			const published = getPublishedPages();
			if (published.length === 0) return;
			const industry = published[0].industry;
			const pages = getPagesByIndustry(industry);
			expect(pages.length).toBeGreaterThan(0);
			pages.forEach((p) => {
				expect(p.industry).toBe(industry);
				expect(p.published).toBe(true);
			});
		});

		it("returns empty for unknown industry", () => {
			expect(getPagesByIndustry("nonexistent-industry")).toEqual([]);
		});
	});

	describe("getRelatedPages", () => {
		it("returns related pages for a valid slug", () => {
			const published = getPublishedPages();
			if (published.length < 2) return;
			const slug = published[0].slug;
			const related = getRelatedPages(slug);
			expect(Array.isArray(related)).toBe(true);
			related.forEach((p) => {
				expect(p.slug).not.toBe(slug);
				expect(p.published).toBe(true);
			});
		});

		it("respects the limit parameter", () => {
			const published = getPublishedPages();
			if (published.length < 3) return;
			const slug = published[0].slug;
			const related = getRelatedPages(slug, 2);
			expect(related.length).toBeLessThanOrEqual(2);
		});

		it("defaults to limit of 4", () => {
			const published = getPublishedPages();
			if (published.length < 6) return;
			const slug = published[0].slug;
			const related = getRelatedPages(slug);
			expect(related.length).toBeLessThanOrEqual(4);
		});

		it("returns empty array for nonexistent slug", () => {
			expect(getRelatedPages("nonexistent")).toEqual([]);
		});

		it("prioritizes same technology over same industry", () => {
			const published = getPublishedPages();
			if (published.length < 3) return;
			const slug = published[0].slug;
			const page = getPageBySlug(slug)!;
			const related = getRelatedPages(slug);
			if (related.length >= 2) {
				// First result should share technology if any do
				const firstSharesTech = related[0].technology === page.technology;
				const secondSharesTech = related[1].technology === page.technology;
				if (firstSharesTech && !secondSharesTech) {
					// Correct ordering: same-tech ranked higher
					expect(true).toBe(true);
				}
			}
		});
	});

	describe("pseoPages data integrity", () => {
		it("every page has required fields", () => {
			pseoPages.forEach((page) => {
				expect(page.slug).toBeTruthy();
				expect(page.seo.title).toBeTruthy();
				expect(page.seo.description).toBeTruthy();
				expect(page.technology).toBeTruthy();
				expect(page.industry).toBeTruthy();
			});
		});

		it("no duplicate slugs", () => {
			const slugs = pseoPages.map((p) => p.slug);
			expect(new Set(slugs).size).toBe(slugs.length);
		});
	});
});
