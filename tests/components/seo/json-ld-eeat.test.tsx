import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/json-ld";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

describe("JsonLd E-E-A-T enrichments", () => {
	it("Person.worksFor uses ORG_REF @id (not inline Organization)", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(person.worksFor).toEqual({ "@id": "https://alexmayhew.dev/#organization" });
	});

	it("Person has hasCredential with at least one EducationalOccupationalCredential", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(Array.isArray(person.hasCredential)).toBe(true);
		expect(person.hasCredential.length).toBeGreaterThan(0);
		expect(person.hasCredential[0]["@type"]).toBe("EducationalOccupationalCredential");
	});

	it("Organization and ConsultingService sameAs include Bluesky (matches Person)", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const org = schemas.find((s) => s["@type"] === "Organization");
		const service = schemas.find((s) => s["@type"] === "ConsultingService");
		const bsky = "https://bsky.app/profile/alexmayhewdev.bsky.social";
		expect(org.sameAs).toContain(bsky);
		expect(service.sameAs).toContain(bsky);
	});
});
