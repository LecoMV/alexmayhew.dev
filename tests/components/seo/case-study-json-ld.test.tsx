import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CaseStudyJsonLd } from "@/components/seo/case-study-json-ld";

import type { Project } from "@/data/projects";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockProject: Project = {
	id: "traceforge",
	title: "TraceForge",
	description: "High-performance vectorization engine for distributed tracing.",
	category: "Developer Tools",
	tech: ["Rust", "TypeScript", "PostgreSQL"],
	year: "2025",
	status: "Production",
};

describe("CaseStudyJsonLd", () => {
	it("renders CreativeWork and BreadcrumbList schemas with PERSON_REF author", () => {
		const { container } = render(<CaseStudyJsonLd project={mockProject} />);
		const schemas = parseAllJsonLd(container);
		expect(schemas).toHaveLength(2);

		const creative = schemas.find((s) => s["@type"] === "CreativeWork");
		expect(creative).toBeDefined();
		expect(creative["@context"]).toBe("https://schema.org");
		expect(creative.name).toContain("TraceForge");
		expect(creative.author).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(creative.url).toBe("https://alexmayhew.dev/work/traceforge");
		expect(creative.keywords).toBe("Rust, TypeScript, PostgreSQL");
		expect(creative.datePublished).toBe("2025-01-01");

		const breadcrumb = schemas.find((s) => s["@type"] === "BreadcrumbList");
		expect(breadcrumb).toBeDefined();
		expect(breadcrumb.itemListElement).toHaveLength(3);
	});
});
