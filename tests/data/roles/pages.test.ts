import { describe, expect, it } from "vitest";

import {
	getAllRoleSlugs,
	getPublishedRolePages,
	getPublishedRoleSlugs,
	getRolePageBySlug,
	rolePages,
} from "@/data/roles/pages";

describe("Role Pages", () => {
	it("getPublishedRolePages returns only published", () => {
		const pages = getPublishedRolePages();
		pages.forEach((page) => expect(page.published).toBe(true));
		const expected = rolePages.filter((p) => p.published).length;
		expect(pages.length).toBe(expected);
	});

	it("getRolePageBySlug returns page for valid slug", () => {
		const first = rolePages[0];
		const page = getRolePageBySlug(first.slug);
		expect(page).toBeDefined();
		expect(page!.slug).toBe(first.slug);
	});

	it("getRolePageBySlug returns undefined for invalid slug", () => {
		expect(getRolePageBySlug("nonexistent-role-xyz")).toBeUndefined();
	});

	it("getAllRoleSlugs returns all slugs", () => {
		const slugs = getAllRoleSlugs();
		expect(slugs.length).toBe(rolePages.length);
		rolePages.forEach((page) => {
			expect(slugs).toContain(page.slug);
		});
	});

	it("getPublishedRoleSlugs returns only published slugs", () => {
		const slugs = getPublishedRoleSlugs();
		const publishedPages = rolePages.filter((p) => p.published);
		expect(slugs.length).toBe(publishedPages.length);
		publishedPages.forEach((page) => {
			expect(slugs).toContain(page.slug);
		});
	});

	it("every page has required fields", () => {
		rolePages.forEach((page) => {
			expect(page.slug).toBeTruthy();
			expect(page.role).toBeTruthy();
			expect(page.seo.title).toBeTruthy();
			expect(page.seo.description).toBeTruthy();
			expect(Array.isArray(page.painPoints)).toBe(true);
			expect(Array.isArray(page.faqs)).toBe(true);
		});
	});

	it("no duplicate slugs", () => {
		const slugs = rolePages.map((p) => p.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});
});
