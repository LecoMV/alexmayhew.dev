import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MigrationJsonLd } from "@/components/seo/migration-json-ld";

import type { MigrationPage } from "@/data/pseo/migrations";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockPage: MigrationPage = {
	slug: "angularjs-to-nextjs-migration",
	legacyTech: {
		name: "AngularJS",
		eolDate: "December 31, 2021",
		supportEndDate: "December 31, 2021",
		cveCount: 23,
		securityRisk: "critical",
		talentAvailability: 8,
		salaryPremium: "40-60% premium",
		limitations: [],
	},
	modernTech: {
		name: "Next.js",
		currentVersion: "15.x",
		ltsStatus: "Active",
		talentAvailability: 78,
		performanceGain: "60-80% faster",
		advantages: [],
	},
	targetIndustries: ["saas"],
	patterns: [
		{
			name: "Strangler Fig",
			description: "Incremental replacement",
			whenToUse: [],
			risks: [],
			durationMultiplier: 1.2,
		},
	],
	seo: {
		title: "AngularJS to Next.js Migration",
		description: "Migrate from AngularJS to Next.js.",
		keywords: ["migration"],
	},
	uniqueInsights: [],
	complianceConsiderations: [],
	challenges: [],
	urgencyDrivers: [],
	migrationApproach: "Strangler fig pattern.",
	roiNarrative: "60% faster.",
	budgetGuidance: {
		mvpMin: 25000,
		mvpMax: 75000,
		fullMin: 75000,
		fullMax: 300000,
		currency: "USD",
		factors: [],
	},
	timeline: { assessmentWeeks: 2, mvpWeeks: 8, fullMigrationWeeks: 24, factors: [] },
	faqs: [],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("MigrationJsonLd @id suffix", () => {
	it("Service @id is suffixed with #service to avoid collision with WebPage @id", () => {
		const { container } = render(<MigrationJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service["@id"]).toBe(
			"https://alexmayhew.dev/services/migrations/angularjs-to-nextjs-migration#service"
		);
	});
});
