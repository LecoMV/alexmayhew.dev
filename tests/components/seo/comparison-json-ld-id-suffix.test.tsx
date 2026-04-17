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
		npmDownloads: "7M+",
		strengths: [],
		limitations: [],
		idealFor: [],
		avoidWhen: [],
	},
	optionB: {
		name: "Remix",
		version: "2.x",
		yearReleased: 2021,
		maintainer: "Shopify",
		githubStars: "30k+",
		npmDownloads: "500k",
		strengths: [],
		limitations: [],
		idealFor: [],
		avoidWhen: [],
	},
	useCase: "for SaaS",
	targetIndustries: ["saas"],
	seo: {
		title: "Next.js vs Remix for SaaS",
		description: "Comparison.",
		keywords: ["comparison"],
	},
	introduction: "Intro.",
	criteria: [],
	decisionMatrix: [],
	uniqueInsights: [],
	whenToChooseA: "A.",
	whenToChooseB: "B.",
	expertVerdict: {
		summary: "Depends.",
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
	faqs: [],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("ComparisonJsonLd @id suffix", () => {
	it("Service @id is suffixed with #service", () => {
		const { container } = render(<ComparisonJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service["@id"]).toBe(
			"https://alexmayhew.dev/services/comparisons/next-js-vs-remix-for-saas#service"
		);
	});
});
