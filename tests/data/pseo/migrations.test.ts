import { describe, expect, it } from "vitest";

import {
	getAllMigrationPages,
	getAllMigrationSlugs,
	getMigrationPageBySlug,
	getMigrationPagesByIndustry,
	migrationPages,
} from "@/data/pseo/migrations";

describe("pSEO Migrations", () => {
	it("getAllMigrationSlugs returns string array of published", () => {
		const slugs = getAllMigrationSlugs();
		expect(Array.isArray(slugs)).toBe(true);
		slugs.forEach((slug) => expect(typeof slug).toBe("string"));
		const expected = migrationPages.filter((p) => p.published).map((p) => p.slug);
		expect(slugs).toEqual(expected);
	});

	it("getMigrationPageBySlug returns page for valid slug", () => {
		const slugs = getAllMigrationSlugs();
		if (slugs.length === 0) return;
		const page = getMigrationPageBySlug(slugs[0]);
		expect(page).toBeDefined();
		expect(page!.slug).toBe(slugs[0]);
	});

	it("getMigrationPageBySlug returns undefined for invalid slug", () => {
		expect(getMigrationPageBySlug("nonexistent-migration")).toBeUndefined();
	});

	it("getMigrationPagesByIndustry filters correctly", () => {
		const pages = getMigrationPagesByIndustry("saas");
		pages.forEach((page) => {
			expect(page.published).toBe(true);
			expect(page.targetIndustries).toContain("saas");
		});
	});

	it("getMigrationPagesByIndustry returns empty for fake industry", () => {
		expect(getMigrationPagesByIndustry("fake" as never)).toEqual([]);
	});

	it("getAllMigrationPages returns only published", () => {
		const pages = getAllMigrationPages();
		pages.forEach((page) => expect(page.published).toBe(true));
		const expected = migrationPages.filter((p) => p.published).length;
		expect(pages.length).toBe(expected);
	});

	it("every migration page has required fields", () => {
		migrationPages.forEach((page) => {
			expect(page.slug).toBeTruthy();
			expect(page.seo.title).toBeTruthy();
			expect(page.seo.description).toBeTruthy();
			expect(page.legacyTech).toBeDefined();
			expect(page.modernTech).toBeDefined();
			expect(Array.isArray(page.targetIndustries)).toBe(true);
		});
	});
});
