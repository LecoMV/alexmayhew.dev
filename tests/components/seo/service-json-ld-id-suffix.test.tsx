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
		keywords: ["nextjs", "healthcare"],
	},
	uniqueInsights: ["A".repeat(60), "B".repeat(60), "C".repeat(60), "D".repeat(60), "E".repeat(60)],
	industryRegulations: [],
	commonPainPoints: [
		{ title: "X", description: "Y", solution: "Z" },
		{ title: "X2", description: "Y2", solution: "Z2" },
		{ title: "X3", description: "Y3", solution: "Z3" },
		{ title: "X4", description: "Y4", solution: "Z4" },
		{ title: "X5", description: "Y5", solution: "Z5" },
	],
	techStackRecommendations: [{ component: "X", technology: "Y", rationale: "Z" }],
	whyThisStack: "W".repeat(200),
	projectApproach: "P".repeat(200),
	budgetGuidance: {
		mvpMin: 30000,
		mvpMax: 80000,
		fullMin: 80000,
		fullMax: 250000,
		currency: "USD",
		factors: ["A"],
	},
	faqs: [
		{ question: "Q1", answer: "A1" },
		{ question: "Q2", answer: "A2" },
		{ question: "Q3", answer: "A3" },
		{ question: "Q4", answer: "A4" },
	],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("ServiceJsonLd @id suffix", () => {
	it("Service @id is suffixed with #service to avoid collision with WebPage @id", () => {
		const { container } = render(<ServiceJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service["@id"]).toBe("https://alexmayhew.dev/services/nextjs-healthcare#service");
	});
});
