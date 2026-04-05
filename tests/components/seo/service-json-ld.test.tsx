import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServiceJsonLd } from "@/components/seo/service-json-ld";

import type { PseoPage } from "@/data/pseo";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockPage: PseoPage = {
	slug: "nextjs-healthcare",
	technology: "nextjs",
	industry: "healthcare",
	seo: {
		title: "Next.js for Healthcare",
		description: "HIPAA-compliant Next.js development.",
		keywords: ["nextjs", "healthcare", "hipaa"],
	},
	uniqueInsights: [
		"HIPAA requires encryption at rest.",
		"Audit logging is mandatory.",
		"PHI data isolation.",
		"BAA with cloud providers.",
		"Role-based access control.",
	],
	industryRegulations: [
		{
			name: "HIPAA",
			fullName: "Health Insurance Portability and Accountability Act",
			technicalImplications: "Requires encryption.",
			requirements: ["Encryption at rest"],
		},
	],
	commonPainPoints: [
		{
			title: "Compliance",
			description: "HIPAA compliance is complex.",
			solution: "Automated audit trails.",
		},
	],
	techStackRecommendations: [{ component: "Auth", technology: "Auth0", rationale: "HIPAA-ready." }],
	whyThisStack: "Next.js provides server-side rendering crucial for healthcare portals. ".repeat(5),
	projectApproach: "We start with a HIPAA compliance assessment and build from there. ".repeat(5),
	budgetGuidance: {
		mvpMin: 30000,
		mvpMax: 80000,
		fullMin: 80000,
		fullMax: 250000,
		currency: "USD",
		factors: ["Compliance"],
	},
	faqs: [{ question: "Is Next.js HIPAA compliant?", answer: "With proper configuration, yes." }],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("ServiceJsonLd", () => {
	it("renders Service, FAQPage, WebPage, and BreadcrumbList schemas with PERSON_REF provider", () => {
		const { container } = render(<ServiceJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		expect(schemas.length).toBeGreaterThanOrEqual(4);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Service");
		expect(types).toContain("FAQPage");
		expect(types).toContain("WebPage");
		expect(types).toContain("BreadcrumbList");

		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service.provider).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service.name).toContain("Next.js");
		expect(service.name).toContain("Healthcare");
		expect(service["@id"]).toContain("/services/nextjs-healthcare");
		expect(service.hasOfferCatalog.itemListElement).toHaveLength(2);
	});
});
