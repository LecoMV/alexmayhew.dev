import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/json-ld";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

describe("JsonLd (main Person/Org/WebSite/ConsultingService)", () => {
	it("renders four JSON-LD scripts: Person, Organization, WebSite, ConsultingService", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		expect(schemas).toHaveLength(4);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Person");
		expect(types).toContain("Organization");
		expect(types).toContain("WebSite");
		expect(types).toContain("ConsultingService");
	});

	it("Person schema has correct @id and uses sameAs for social links", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(person["@id"]).toBe("https://alexmayhew.dev/#person");
		expect(person.name).toBe("Alex Mayhew");
		expect(person.url).toBe("https://alexmayhew.dev");
		expect(person.sameAs).toBeInstanceOf(Array);
		expect(person.sameAs.length).toBeGreaterThan(0);
		expect(person.knowsAbout).toBeInstanceOf(Array);
	});

	it("Organization references Person @id as founder", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const org = schemas.find((s) => s["@type"] === "Organization");
		expect(org["@id"]).toBe("https://alexmayhew.dev/#organization");
		expect(org.founder).toEqual({ "@id": "https://alexmayhew.dev/#person" });
	});

	it("WebSite schema references Person and Organization via @id", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const site = schemas.find((s) => s["@type"] === "WebSite");
		expect(site["@id"]).toBe("https://alexmayhew.dev/#website");
		expect(site.author).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(site.publisher).toEqual({ "@id": "https://alexmayhew.dev/#organization" });
	});

	it("ConsultingService has @id, offer catalog, and area served", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "ConsultingService");
		expect(service["@id"]).toBe("https://alexmayhew.dev/#business");
		expect(service.founder).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service.hasOfferCatalog["@type"]).toBe("OfferCatalog");
		expect(service.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
		expect(service.areaServed).toBeInstanceOf(Array);
		expect(service.priceRange).toBe("$$$$");
	});
});
