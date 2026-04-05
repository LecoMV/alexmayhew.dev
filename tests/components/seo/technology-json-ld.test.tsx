import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TechnologyJsonLd } from "@/components/seo/technology-json-ld";

import type { Technology } from "@/data/pseo/technologies";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockTech: Technology = {
	id: "react-nextjs",
	displayName: "React & Next.js",
	whenToUse: ["Building SEO-critical marketing sites"],
	commonPitfalls: ["Mixing client and server components incorrectly"],
	bestPractices: ["Structure components as Server Components by default"],
	projectTypes: ["SaaS applications", "E-commerce platforms"],
	complementaryTech: ["TypeScript", "Tailwind CSS"],
	expertiseLevel: "Production experience since Next.js 9.",
	realWorldExample: "PhotoKeep Pro demonstrates advanced patterns.",
	targetKeywords: ["next.js developer", "react developer"],
};

describe("TechnologyJsonLd", () => {
	it("renders Service, best practices ItemList, pitfalls ItemList, WebPage, and BreadcrumbList with PERSON_REF", () => {
		const { container } = render(<TechnologyJsonLd technology={mockTech} />);
		const schemas = parseAllJsonLd(container);
		expect(schemas.length).toBeGreaterThanOrEqual(5);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Service");
		expect(types).toContain("WebPage");
		expect(types).toContain("BreadcrumbList");
		expect(types.filter((t) => t === "ItemList")).toHaveLength(2);

		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service.provider).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service.name).toContain("React & Next.js");
		expect(service["@id"]).toContain("/technologies/react-nextjs#service");

		const itemLists = schemas.filter((s) => s["@type"] === "ItemList");
		const bestPractices = itemLists.find((s) => s.name.includes("Best Practices"));
		expect(bestPractices).toBeDefined();
		expect(bestPractices.itemListElement).toHaveLength(1);

		const pitfalls = itemLists.find((s) => s.name.includes("Pitfalls"));
		expect(pitfalls).toBeDefined();
		expect(pitfalls.itemListElement).toHaveLength(1);
	});
});
