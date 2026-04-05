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
		limitations: ["No security patches"],
	},
	modernTech: {
		name: "Next.js",
		currentVersion: "15.x",
		ltsStatus: "Active development",
		talentAvailability: 78,
		performanceGain: "60-80% faster",
		advantages: ["Server Components"],
	},
	targetIndustries: ["saas", "fintech"],
	patterns: [
		{
			name: "Strangler Fig",
			description: "Incremental replacement",
			whenToUse: ["Large codebases"],
			risks: ["Complexity"],
			durationMultiplier: 1.2,
		},
	],
	seo: {
		title: "AngularJS to Next.js Migration",
		description: "Migrate from AngularJS to Next.js.",
		keywords: ["angularjs", "nextjs", "migration"],
	},
	uniqueInsights: ["Critical security risk drives urgency."],
	complianceConsiderations: [],
	challenges: [],
	urgencyDrivers: ["EOL security risk"],
	migrationApproach: "Strangler fig pattern with module-by-module migration.",
	roiNarrative: "60-80% performance improvement.",
	budgetGuidance: {
		mvpMin: 25000,
		mvpMax: 75000,
		fullMin: 75000,
		fullMax: 300000,
		currency: "USD",
		factors: [],
	},
	timeline: { assessmentWeeks: 2, mvpWeeks: 8, fullMigrationWeeks: 24, factors: [] },
	faqs: [{ question: "How long does migration take?", answer: "6-12 months typically." }],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("MigrationJsonLd", () => {
	it("renders Service, HowTo, FAQPage, WebPage, and BreadcrumbList schemas with PERSON_REF", () => {
		const { container } = render(<MigrationJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		expect(schemas.length).toBeGreaterThanOrEqual(5);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Service");
		expect(types).toContain("HowTo");
		expect(types).toContain("FAQPage");
		expect(types).toContain("WebPage");
		expect(types).toContain("BreadcrumbList");

		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service.provider).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service.name).toContain("AngularJS");
		expect(service.name).toContain("Next.js");
		expect(service["@id"]).toContain("/services/migrations/angularjs-to-nextjs-migration");

		const howTo = schemas.find((s) => s["@type"] === "HowTo");
		expect(howTo.step.length).toBeGreaterThan(0);
		expect(howTo.totalTime).toBe("P24W");
	});
});
