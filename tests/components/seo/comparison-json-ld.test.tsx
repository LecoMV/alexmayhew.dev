import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComparisonJsonLd } from "@/components/seo/comparison-json-ld";

import type { ComparisonPage } from "@/data/pseo/comparisons";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockPage: ComparisonPage = {
	slug: "next-js-vs-remix-for-saas",
	optionA: {
		name: "Next.js",
		version: "15.x",
		yearReleased: 2016,
		maintainer: "Vercel",
		githubStars: "128k+",
		npmDownloads: "7M+ weekly",
		strengths: ["SSR"],
		limitations: ["Complex"],
		idealFor: ["SaaS"],
		avoidWhen: ["Simple sites"],
	},
	optionB: {
		name: "Remix",
		version: "2.x",
		yearReleased: 2021,
		maintainer: "Shopify",
		githubStars: "30k+",
		npmDownloads: "500k weekly",
		strengths: ["Web standards"],
		limitations: ["Smaller ecosystem"],
		idealFor: ["Web apps"],
		avoidWhen: ["Static sites"],
	},
	useCase: "for SaaS",
	targetIndustries: ["saas"],
	seo: {
		title: "Next.js vs Remix for SaaS",
		description: "Detailed comparison for SaaS development.",
		keywords: ["next.js", "remix", "saas"],
	},
	introduction: "Both are excellent.",
	criteria: [],
	decisionMatrix: [],
	uniqueInsights: ["Insight 1"],
	whenToChooseA: "Choose Next.js when you need ISR.",
	whenToChooseB: "Choose Remix for web standards.",
	expertVerdict: {
		summary: "Depends on team.",
		defaultRecommendation: "depends",
		rationale: "Both viable.",
	},
	budgetGuidance: {
		optionA: {
			mvpMin: 15000,
			mvpMax: 50000,
			fullMin: 50000,
			fullMax: 200000,
			currency: "USD",
			factors: [],
		},
		optionB: {
			mvpMin: 12000,
			mvpMax: 40000,
			fullMin: 40000,
			fullMax: 150000,
			currency: "USD",
			factors: [],
		},
	},
	faqs: [{ question: "Which is faster?", answer: "Depends on the use case." }],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("ComparisonJsonLd", () => {
	it("renders Service, FAQPage, WebPage, BreadcrumbList, and TechArticle schemas with PERSON_REF", () => {
		const { container } = render(<ComparisonJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		expect(schemas.length).toBeGreaterThanOrEqual(5);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Service");
		expect(types).toContain("FAQPage");
		expect(types).toContain("WebPage");
		expect(types).toContain("BreadcrumbList");
		expect(types).toContain("TechArticle");

		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service.provider).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service["@id"]).toContain("/services/comparisons/next-js-vs-remix-for-saas");

		const article = schemas.find((s) => s["@type"] === "TechArticle");
		expect(article.author).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(article.publisher).toEqual({ "@id": "https://alexmayhew.dev/#organization" });
	});
});
