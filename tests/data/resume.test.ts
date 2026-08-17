import { describe, expect, it } from "vitest";

import {
	resumeEducation,
	resumeMeta,
	resumeRoles,
	resumeSkills,
	resumeSummary,
} from "@/data/resume";

describe("resume data (canonical source for /resume page + PDF)", () => {
	it("carries the role-neutral identity and correct handles", () => {
		expect(resumeMeta.name).toBe("Alex Mayhew");
		expect(resumeMeta.headline).toContain("Technology Specialist");
		expect(resumeMeta.linkedin).toBe("linkedin.com/in/alexmmayhew");
		expect(resumeMeta.github).toBe("github.com/LecoMV");
		expect(resumeMeta.email).toBe("alex@alexmayhew.dev");
	});

	it("has two roles with resume-matching titles and dates", () => {
		expect(resumeRoles).toHaveLength(2);
		const solar = resumeRoles.find((r) => r.org === "Harvest Sun Solar");
		expect(solar?.title).toBe("Solar Designer & Technology Specialist");
		expect(solar?.start).toBe("March 2016");
		expect(solar?.end).toBe("December 2025");
		const current = resumeRoles.find((r) => r.org === "Mayhew Technology LLC");
		expect(current?.start).toBe("January 2026");
		expect(current?.end).toBe("Present");
	});

	it("never states a banned identity claim or names the NDA client", () => {
		const blob = JSON.stringify({ resumeSummary, resumeRoles, resumeSkills, resumeEducation });
		for (const banned of [
			"Technical Advisor",
			"Systems Architect",
			"15+ year",
			"30+ startup",
			"Rose Cay",
		]) {
			expect(blob).not.toContain(banned);
		}
	});

	it("lists at least six skill groups covering web through solar", () => {
		expect(resumeSkills.length).toBeGreaterThanOrEqual(6);
		const labels = resumeSkills.map((s) => s.label);
		expect(labels).toContain("Web");
		expect(labels).toContain("Servers & DevOps");
		expect(labels).toContain("Solar");
	});
});
