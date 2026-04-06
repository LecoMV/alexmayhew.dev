import { describe, expect, it } from "vitest";

import {
	comparisonPages,
	getAllComparisonPages,
	getAllComparisonSlugs,
	getComparisonPageBySlug,
	getComparisonPagesByIndustry,
} from "@/data/pseo/comparisons";

describe("pSEO Comparisons", () => {
	it("getAllComparisonSlugs returns string array", () => {
		const slugs = getAllComparisonSlugs();
		expect(Array.isArray(slugs)).toBe(true);
		slugs.forEach((slug) => expect(typeof slug).toBe("string"));
	});

	it("getAllComparisonSlugs only includes published", () => {
		const slugs = getAllComparisonSlugs();
		const expected = comparisonPages.filter((p) => p.published).map((p) => p.slug);
		expect(slugs).toEqual(expected);
	});

	it("getComparisonPageBySlug returns page for valid slug", () => {
		const slugs = getAllComparisonSlugs();
		if (slugs.length === 0) return;
		const page = getComparisonPageBySlug(slugs[0]);
		expect(page).toBeDefined();
		expect(page!.slug).toBe(slugs[0]);
	});

	it("getComparisonPageBySlug returns undefined for invalid slug", () => {
		expect(getComparisonPageBySlug("nonexistent-slug-xyz")).toBeUndefined();
	});

	it("getComparisonPagesByIndustry filters correctly", () => {
		const pages = getComparisonPagesByIndustry("saas");
		pages.forEach((page) => {
			expect(page.published).toBe(true);
			expect(page.targetIndustries).toContain("saas");
		});
	});

	it("getComparisonPagesByIndustry returns empty for fake industry", () => {
		const pages = getComparisonPagesByIndustry("nonexistent" as never);
		expect(pages).toEqual([]);
	});

	it("getAllComparisonPages returns only published", () => {
		const pages = getAllComparisonPages();
		pages.forEach((page) => expect(page.published).toBe(true));
		const expected = comparisonPages.filter((p) => p.published).length;
		expect(pages.length).toBe(expected);
	});

	it("every comparison page has required fields", () => {
		comparisonPages.forEach((page) => {
			expect(page.slug).toBeTruthy();
			expect(page.seo.title).toBeTruthy();
			expect(page.seo.description).toBeTruthy();
			expect(page.optionA).toBeDefined();
			expect(page.optionB).toBeDefined();
			expect(Array.isArray(page.targetIndustries)).toBe(true);
		});
	});

	it("slugs follow kebab-case format", () => {
		comparisonPages.forEach((page) => {
			expect(page.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
		});
	});
});
