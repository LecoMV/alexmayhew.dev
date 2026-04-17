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
		rateLimit: { requestsPerMinute: 100, notes: "Varies" },
		webhookSupport: true,
		sandboxAvailable: true,
		capabilities: [],
	},
	saasB: {
		name: "Stripe",
		category: "Payments",
		apiDocsUrl: "https://stripe.com/docs/api",
		authMethods: ["api_key"],
		rateLimit: { requestsPerMinute: 100, notes: "Per-key limit" },
		webhookSupport: true,
		sandboxAvailable: true,
		capabilities: [],
	},
	targetIndustries: ["saas"],
	patterns: [
		{
			name: "Event-Driven Sync",
			description: "Webhook-based",
			whenToUse: [],
			architecture: "W->Q->P",
			complexity: "medium",
		},
	],
	seo: {
		title: "Salesforce Stripe Integration",
		description: "Connect.",
		keywords: ["integration"],
	},
	uniqueInsights: [],
	complianceConsiderations: [],
	challenges: [],
	dataSyncStrategies: [],
	integrationApproach: "Event-driven.",
	benefitsNarrative: "Unified.",
	budgetGuidance: {
		mvpMin: 15000,
		mvpMax: 40000,
		fullMin: 40000,
		fullMax: 120000,
		currency: "USD",
		factors: [],
	},
	timeline: { discoveryWeeks: 2, mvpWeeks: 4, productionWeeks: 8, factors: [] },
	faqs: [],
	relatedServices: [],
	relatedBlogPosts: [],
	published: true,
};

describe("IntegrationJsonLd @id suffix", () => {
	it("Service @id is suffixed with #service", () => {
		const { container } = render(<IntegrationJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service["@id"]).toBe(
			"https://alexmayhew.dev/services/integrations/salesforce-stripe-integration#service"
		);
	});
});
