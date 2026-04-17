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
	it("emits TechArticle with publisher, headline, mainEntityOfPage, image", () => {
		const { container } = render(<CaseStudyJsonLd project={mockProject} />);
		const schemas = parseAllJsonLd(container);
		const article = schemas.find((s) => s["@type"] === "TechArticle");
		expect(article).toBeDefined();
		expect(article["@context"]).toBe("https://schema.org");
		expect(article.headline).toContain("TraceForge");
		expect(article.author).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(article.publisher).toEqual({ "@id": "https://alexmayhew.dev/#organization" });
		expect(article.url).toBe("https://alexmayhew.dev/work/traceforge");
		expect(article.keywords).toBe("Rust, TypeScript, PostgreSQL");
		expect(article.datePublished).toBe("2025-01-01");
		expect(article.mainEntityOfPage).toEqual({
			"@type": "WebPage",
			"@id": "https://alexmayhew.dev/work/traceforge",
		});
		expect(article.image).toBeDefined();
	});

	it("renders a BreadcrumbList with 3 levels", () => {
		const { container } = render(<CaseStudyJsonLd project={mockProject} />);
		const schemas = parseAllJsonLd(container);
		const breadcrumb = schemas.find((s) => s["@type"] === "BreadcrumbList");
		expect(breadcrumb).toBeDefined();
		expect(breadcrumb.itemListElement).toHaveLength(3);
	});
});
