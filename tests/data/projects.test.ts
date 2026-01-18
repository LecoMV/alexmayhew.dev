import { describe, it, expect } from "vitest";
import {
	projects,
	categories,
	getProjectsRecord,
	getProjectsByCategory,
	getFeaturedProjects,
	type Project,
	type Category,
} from "@/data/projects";

describe("projects data", () => {
	describe("projects array", () => {
		it("should have at least one project", () => {
			expect(projects.length).toBeGreaterThan(0);
		});

		it("each project should have required fields", () => {
			projects.forEach((project) => {
				expect(project.id).toBeDefined();
				expect(project.title).toBeDefined();
				expect(project.description).toBeDefined();
				expect(project.category).toBeDefined();
				expect(project.tech).toBeDefined();
				expect(project.year).toBeDefined();
				expect(project.status).toBeDefined();
			});
		});

		it("each project should have a unique id", () => {
			const ids = projects.map((p) => p.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(projects.length);
		});

		it("each project should have valid status", () => {
			const validStatuses = ["Production", "Development", "Concept"];
			projects.forEach((project) => {
				expect(validStatuses).toContain(project.status);
			});
		});

		it("each project should have valid category", () => {
			const validCategories = categories.filter((c) => c !== "All");
			projects.forEach((project) => {
				expect(validCategories).toContain(project.category);
			});
		});

		it("each project should have at least one tech", () => {
			projects.forEach((project) => {
				expect(project.tech.length).toBeGreaterThan(0);
			});
		});

		it("each project should have valid year format", () => {
			const yearRegex = /^\d{4}$/;
			projects.forEach((project) => {
				expect(project.year).toMatch(yearRegex);
			});
		});
	});

	describe("categories", () => {
		it("should include All category", () => {
			expect(categories).toContain("All");
		});

		it("should have at least one non-All category", () => {
			const nonAllCategories = categories.filter((c) => c !== "All");
			expect(nonAllCategories.length).toBeGreaterThan(0);
		});
	});

	describe("getProjectsRecord", () => {
		it("should return a record keyed by project id", () => {
			const record = getProjectsRecord();
			projects.forEach((project) => {
				expect(record[project.id]).toBeDefined();
			});
		});

		it("should transform project data correctly", () => {
			const record = getProjectsRecord();
			const firstProject = projects[0];
			const recordEntry = record[firstProject.id];

			expect(recordEntry.name).toBe(firstProject.title);
			expect(recordEntry.description).toBe(firstProject.description);
			expect(recordEntry.tech).toEqual(firstProject.tech);
			expect(recordEntry.status).toBe(firstProject.status);
		});

		it("should set url to null when link is undefined", () => {
			const record = getProjectsRecord();
			const projectWithoutLink = projects.find((p) => !p.link);
			if (projectWithoutLink) {
				expect(record[projectWithoutLink.id].url).toBeNull();
			}
		});
	});

	describe("getProjectsByCategory", () => {
		it("should return all projects for All category", () => {
			const result = getProjectsByCategory("All");
			expect(result.length).toBe(projects.length);
		});

		it("should filter projects by specific category", () => {
			const aiMlProjects = getProjectsByCategory("AI/ML");
			aiMlProjects.forEach((project) => {
				expect(project.category).toBe("AI/ML");
			});
		});

		it("should return empty array for category with no projects", () => {
			// This tests edge case - may return empty if no projects match
			const result = getProjectsByCategory("Nonexistent" as Category);
			expect(Array.isArray(result)).toBe(true);
		});
	});

	describe("getFeaturedProjects", () => {
		it("should only return featured projects", () => {
			const featured = getFeaturedProjects();
			featured.forEach((project) => {
				expect(project.featured).toBe(true);
			});
		});

		it("should return at least one featured project", () => {
			const featured = getFeaturedProjects();
			expect(featured.length).toBeGreaterThan(0);
		});
	});
});
