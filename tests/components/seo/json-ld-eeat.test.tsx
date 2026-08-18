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

	it("Person carries the machine-readable career history via hasOccupation", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(Array.isArray(person.hasOccupation)).toBe(true);
		expect(person.hasOccupation.length).toBeGreaterThan(0);
		expect(person.hasOccupation[0]["@type"]).toBe("Role");
	});

	it("Person.sameAs includes Bluesky and the correct GitHub handle", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(person.sameAs).toContain("https://bsky.app/profile/alexmayhewdev.bsky.social");
		expect(person.sameAs).toContain("https://github.com/LecoMV");
	});
});
