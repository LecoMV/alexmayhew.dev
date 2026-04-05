import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RoleJsonLd } from "@/components/seo/role-json-ld";

import type { RolePage } from "@/data/roles";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockPage: RolePage = {
	slug: "cto",
	role: "cto",
	roleTitle: "Chief Technology Officer",
	headline: "Technical Advisory for CTOs",
	subheadline: "Strategic guidance for technology leaders.",
	painPoints: [
		{
			title: "Architecture Debt",
			description: "Legacy systems slow velocity.",
			whyMatters: "Blocks growth.",
			solution: "Migration roadmap.",
		},
	],
	idealTiers: ["advisory-retainer", "fractional-cto"],
	proofMetrics: ["337x performance improvement"],
	positioning: "I help CTOs make architectural decisions that compound. ".repeat(8),
	timelineExpectations: "Expect weekly syncs and monthly deliverables.",
	relatedServices: [],
	faqs: [{ question: "What does a fractional CTO do?", answer: "Part-time technical leadership." }],
	seo: {
		title: "Technical Advisor for CTOs",
		description: "Strategic technical guidance for CTOs.",
		keywords: ["cto", "technical advisor"],
	},
	published: true,
	lastUpdated: new Date("2026-03-01"),
};

describe("RoleJsonLd", () => {
	it("renders Service, FAQPage, WebPage, and BreadcrumbList schemas with PERSON_REF provider", () => {
		const { container } = render(<RoleJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		expect(schemas.length).toBeGreaterThanOrEqual(4);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Service");
		expect(types).toContain("FAQPage");
		expect(types).toContain("WebPage");
		expect(types).toContain("BreadcrumbList");

		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service.provider).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service.name).toContain("CTO");
		expect(service["@id"]).toContain("/for/cto");
		expect(service.hasOfferCatalog.itemListElement).toHaveLength(2);
	});
});
