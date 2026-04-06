import { describe, expect, it } from "vitest";

import {
	getAllIntegrationPages,
	getAllIntegrationSlugs,
	getIntegrationPageBySlug,
	getIntegrationPagesByIndustry,
	integrationPages,
} from "@/data/pseo/integrations";

describe("pSEO Integrations", () => {
	it("getAllIntegrationSlugs returns string array of published", () => {
		const slugs = getAllIntegrationSlugs();
		expect(Array.isArray(slugs)).toBe(true);
		slugs.forEach((slug) => expect(typeof slug).toBe("string"));
		const expected = integrationPages.filter((p) => p.published).map((p) => p.slug);
		expect(slugs).toEqual(expected);
	});

	it("getIntegrationPageBySlug returns page for valid slug", () => {
		const slugs = getAllIntegrationSlugs();
		if (slugs.length === 0) return;
		const page = getIntegrationPageBySlug(slugs[0]);
		expect(page).toBeDefined();
		expect(page!.slug).toBe(slugs[0]);
		expect(page!.published).toBe(true);
	});

	it("getIntegrationPageBySlug returns undefined for invalid slug", () => {
		expect(getIntegrationPageBySlug("nonexistent-integration")).toBeUndefined();
	});

	it("getIntegrationPagesByIndustry returns published pages only", () => {
		const pages = getIntegrationPagesByIndustry("saas");
		pages.forEach((page) => {
			expect(page.published).toBe(true);
			expect(page.targetIndustries).toContain("saas");
		});
	});

	it("getIntegrationPagesByIndustry returns empty for fake industry", () => {
		expect(getIntegrationPagesByIndustry("fake" as never)).toEqual([]);
	});

	it("getAllIntegrationPages returns only published", () => {
		const pages = getAllIntegrationPages();
		pages.forEach((page) => expect(page.published).toBe(true));
		const expected = integrationPages.filter((p) => p.published).length;
		expect(pages.length).toBe(expected);
	});

	it("every integration page has required fields", () => {
		integrationPages.forEach((page) => {
			expect(page.slug).toBeTruthy();
			expect(page.seo.title).toBeTruthy();
			expect(page.seo.description).toBeTruthy();
			expect(page.saasA).toBeDefined();
			expect(page.saasB).toBeDefined();
			expect(Array.isArray(page.targetIndustries)).toBe(true);
		});
	});
});
