import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/json-ld";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

describe("JsonLd (main Person/Org/WebSite/ProfessionalService)", () => {
	it("renders four JSON-LD scripts: Person, Organization, WebSite, ProfessionalService", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		expect(schemas).toHaveLength(4);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Person");
		expect(types).toContain("Organization");
		expect(types).toContain("WebSite");
		expect(types).toContain("ProfessionalService");
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

	it("WebSite declares a SearchAction potentialAction for sitelinks searchbox", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const site = schemas.find((s) => s["@type"] === "WebSite");
		expect(site.potentialAction).toBeDefined();
		expect(site.potentialAction["@type"]).toBe("SearchAction");
		expect(site.potentialAction.target).toBeDefined();
		expect(site.potentialAction["query-input"]).toBe("required name=search_term_string");
	});

	it("Organization declares knowsAbout, description, areaServed, foundingDate", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const org = schemas.find((s) => s["@type"] === "Organization");
		expect(org.knowsAbout).toBeInstanceOf(Array);
		expect(org.knowsAbout.length).toBeGreaterThan(0);
		expect(org.description).toEqual(expect.any(String));
		expect(org.areaServed).toBeDefined();
		expect(org.foundingDate).toEqual(expect.any(String));
	});

	it("ProfessionalService has @id, offer catalog, and area served", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "ProfessionalService");
		expect(service["@id"]).toBe("https://alexmayhew.dev/#business");
		expect(service.founder).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(service.hasOfferCatalog["@type"]).toBe("OfferCatalog");
		expect(service.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
		expect(service.areaServed).toBeInstanceOf(Array);
		// priceRange intentionally omitted: Google ignores non-enum values like
		// "$$$$" and a real priceSpecification lives inside hasOfferCatalog.
		expect(service.priceRange).toBeUndefined();
	});

	it("ProfessionalService address locks to East Falmouth, MA (regression lock)", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const service = schemas.find((s) => s["@type"] === "ProfessionalService");
		expect(service.address["@type"]).toBe("PostalAddress");
		expect(service.address.addressLocality).toBe("East Falmouth");
		expect(service.address.addressRegion).toBe("MA");
		expect(service.address.addressCountry).toBe("US");
		const areaServedNames = service.areaServed.map((a: { name: string }) => a.name);
		expect(areaServedNames).not.toContain("Boston");
	});
});
