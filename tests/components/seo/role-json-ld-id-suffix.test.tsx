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
	subheadline: "Strategic guidance.",
	painPoints: [],
	idealTiers: ["advisory-retainer"],
	proofMetrics: [],
	positioning: "Positioning.",
	timelineExpectations: "Weekly.",
	relatedServices: [],
	faqs: [],
	seo: {
		title: "Technical Advisor for CTOs",
		description: "Guidance.",
		keywords: ["cto"],
	},
	published: true,
};

describe("RoleJsonLd @id suffix", () => {
	it("Service @id is suffixed with #service", () => {
		const { container } = render(<RoleJsonLd page={mockPage} />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "Service");
		expect(service["@id"]).toBe("https://alexmayhew.dev/for/cto#service");
	});
});
