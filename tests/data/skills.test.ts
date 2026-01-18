import { describe, it, expect } from "vitest";
import {
	skills,
	blogPosts,
	getSkillCategories,
	getSkillsForCategory,
	getAllSkills,
} from "@/data/skills";

describe("skills data", () => {
	describe("skills object", () => {
		it("should have at least one category", () => {
			expect(Object.keys(skills).length).toBeGreaterThan(0);
		});

		it("each category should have at least one skill", () => {
			Object.values(skills).forEach((categorySkills) => {
				expect(categorySkills.length).toBeGreaterThan(0);
			});
		});

		it("should include expected categories", () => {
			expect(skills.frontend).toBeDefined();
			expect(skills.backend).toBeDefined();
		});
	});

	describe("getSkillCategories", () => {
		it("should return all category names", () => {
			const categories = getSkillCategories();
			expect(categories).toContain("frontend");
			expect(categories).toContain("backend");
		});

		it("should return same count as skills keys", () => {
			const categories = getSkillCategories();
			expect(categories.length).toBe(Object.keys(skills).length);
		});
	});

	describe("getSkillsForCategory", () => {
		it("should return skills for valid category", () => {
			const frontendSkills = getSkillsForCategory("frontend");
			expect(frontendSkills).toEqual(skills.frontend);
		});

		it("should return empty array for invalid category", () => {
			const result = getSkillsForCategory("nonexistent");
			expect(result).toEqual([]);
		});
	});

	describe("getAllSkills", () => {
		it("should return flat array of all skills", () => {
			const all = getAllSkills();
			expect(Array.isArray(all)).toBe(true);
		});

		it("should contain skills from all categories", () => {
			const all = getAllSkills();
			Object.values(skills).forEach((categorySkills) => {
				categorySkills.forEach((skill) => {
					expect(all).toContain(skill);
				});
			});
		});
	});

	describe("blogPosts", () => {
		it("should have at least one blog post", () => {
			expect(blogPosts.length).toBeGreaterThan(0);
		});

		it("each post should have slug and title", () => {
			blogPosts.forEach((post) => {
				expect(post.slug).toBeDefined();
				expect(post.title).toBeDefined();
			});
		});

		it("slugs should be URL-safe", () => {
			const urlSafeRegex = /^[a-z0-9-]+$/;
			blogPosts.forEach((post) => {
				expect(post.slug).toMatch(urlSafeRegex);
			});
		});
	});
});
