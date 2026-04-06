import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HowToJsonLd } from "@/components/seo/howto-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("HowToJsonLd", () => {
	it("renders HowTo type with required fields and step positions", () => {
		const props = {
			name: "How to Migrate from AngularJS to Next.js",
			description: "Step-by-step migration guide.",
			steps: [
				{ name: "Assessment", text: "Audit the existing codebase." },
				{ name: "Planning", text: "Design the target architecture." },
			],
		};
		const { container } = render(<HowToJsonLd {...props} />);
		const data = parseJsonLd(container);
		expect(data["@context"]).toBe("https://schema.org");
		expect(data["@type"]).toBe("HowTo");
		expect(data.name).toBe(props.name);
		expect(data.description).toBe(props.description);
		expect(data.step).toHaveLength(2);
		expect(data.step[0]["@type"]).toBe("HowToStep");
		expect(data.step[0].position).toBe(1);
		expect(data.step[1].position).toBe(2);
	});

	it("includes optional fields when provided", () => {
		const props = {
			name: "Build an API",
			description: "Build a REST API.",
			steps: [{ name: "Setup", text: "Install dependencies." }],
			totalTime: "PT2H30M",
			estimatedCost: { currency: "USD", minValue: 5000, maxValue: 20000 },
			tool: ["Docker", "Node.js"],
			supply: ["API key", "Database"],
			image: "https://example.com/image.png",
		};
		const { container } = render(<HowToJsonLd {...props} />);
		const data = parseJsonLd(container);
		expect(data.totalTime).toBe("PT2H30M");
		expect(data.image).toBe("https://example.com/image.png");
		expect(data.estimatedCost["@type"]).toBe("MonetaryAmount");
		expect(data.estimatedCost.currency).toBe("USD");
		expect(data.tool).toHaveLength(2);
		expect(data.tool[0]["@type"]).toBe("HowToTool");
		expect(data.supply).toHaveLength(2);
		expect(data.supply[0]["@type"]).toBe("HowToSupply");
	});
});

import {
	generateIntegrationHowToSteps,
	generateMigrationHowToSteps,
} from "@/components/seo/howto-json-ld";

describe("generateMigrationHowToSteps", () => {
	it("returns 6 steps with correct structure", () => {
		const steps = generateMigrationHowToSteps("AngularJS", "Next.js");
		expect(steps).toHaveLength(6);
		steps.forEach((step) => {
			expect(step.name).toBeTruthy();
			expect(step.text).toBeTruthy();
		});
	});

	it("includes technology names in step text", () => {
		const steps = generateMigrationHowToSteps("Rails", "FastAPI");
		expect(steps[0].text).toContain("Rails");
		expect(steps[1].text).toContain("FastAPI");
	});
});

describe("generateIntegrationHowToSteps", () => {
	it("returns 6 steps with correct structure", () => {
		const steps = generateIntegrationHowToSteps("Stripe", "Salesforce");
		expect(steps).toHaveLength(6);
		steps.forEach((step) => {
			expect(step.name).toBeTruthy();
			expect(step.text).toBeTruthy();
		});
	});

	it("includes SaaS names in step text", () => {
		const steps = generateIntegrationHowToSteps("HubSpot", "Slack");
		expect(steps[0].text).toContain("HubSpot");
		expect(steps[0].text).toContain("Slack");
	});
});
