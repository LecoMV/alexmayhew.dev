import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IntegrationJsonLd } from "@/components/seo/integration-json-ld";

import type { IntegrationPage } from "@/data/pseo/integrations";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const mockPage: IntegrationPage = {
	slug: "salesforce-stripe-integration",
	saasA: {
		name: "Salesforce",
		category: "CRM",
		apiDocsUrl: "https://developer.salesforce.com/docs/apis",
		authMethods: ["oauth2"],
		rateLimit: { requestsPerMinute: 100, notes: "Varies by edition" },
		webhookSupport: true,
		sandboxAvailable: true,
		capabilities: ["CRUD", "Bulk API"],
	},
	saasB: {
		name: "Stripe",
		category: "Payments",
		apiDocsUrl: "https://stripe.com/docs/api",
		authMethods: ["api_key"],
		rateLimit: { requestsPerMinute: 100, notes: "Per-key limit" },
		webhookSupport: true,
		sandboxAvailable: true,
		capabilities: ["Payments", "Subscriptions"],
	},
	targetIndustries: ["fintech", "saas"],
	patterns: [
		{
			name: "Event-Driven Sync",
			description: "Webhook-based real-time sync",
			whenToUse: ["Real-time needs"],
			architecture: "Webhook -> Queue -> Processor",
			complexity: "medium",
		},
	],
	seo: {
		title: "Salesforce Stripe Integration",
		description: "Connect Salesforce with Stripe.",
		keywords: ["salesforce", "stripe", "integration"],
	},
	uniqueInsights: ["Revenue data sync is critical."],
	complianceConsiderations: [],
	challenges: [],
	dataSyncStrategies: [],
	integrationApproach: "Event-driven architecture with webhook processing.",
	benefitsNarrative: "Unified revenue view.",
	budgetGuidance: {
		mvpMin: 15000,
		mvpMax: 40000,
		fullMin: 40000,
		fullMax: 120000,
		currency: "USD",
		factors: [],
	},
	timeline: { discoveryWeeks: 2, mvpWeeks: 4, productionWeeks: 8, factors: [] },
	faqs: [{ question: "How long does integration take?", answer: "4-8 weeks typically." }],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("IntegrationJsonLd", () => {
	it("renders Service, HowTo, FAQPage, WebPage, and BreadcrumbList schemas with PERSON_REF", () => {
		const { container } = render(<IntegrationJsonLd page={mockPage} />);
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
		expect(service.name).toContain("Salesforce");
		expect(service.name).toContain("Stripe");

		const howTo = schemas.find((s) => s["@type"] === "HowTo");
		expect(howTo.step.length).toBeGreaterThan(0);
		expect(howTo.totalTime).toBe("P8W");
	});
});
