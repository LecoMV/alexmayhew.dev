import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd, ServicesJsonLd } from "@/components/seo/json-ld";

function parseAllJsonLd(container: HTMLElement) {
	const scripts = container.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
}

const BANNED_IDENTITY_CLAIMS = [
	"Technical Advisor",
	"Systems Architect",
	"15+ year",
	"15+ Years",
	"30+ startup",
	"Series C",
	"dozens of high-growth",
];

describe("JsonLd (global Person/Organization/WebSite graph)", () => {
	it("renders exactly three JSON-LD scripts: Person, Organization, WebSite (no global ProfessionalService)", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		expect(schemas).toHaveLength(3);

		const types = schemas.map((s) => s["@type"]);
		expect(types).toContain("Person");
		expect(types).toContain("Organization");
		expect(types).toContain("WebSite");
		expect(types).not.toContain("ProfessionalService");
	});

	it("Person keeps the canonical @id and uses sameAs for social links", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(person["@id"]).toBe("https://alexmayhew.dev/#person");
		expect(person.name).toBe("Alex Mayhew");
		expect(person.url).toBe("https://alexmayhew.dev");
		expect(person.sameAs).toBeInstanceOf(Array);
		expect(person.sameAs).toContain("https://github.com/LecoMV");
		expect(person.sameAs).toContain("https://www.linkedin.com/in/alexmmayhew");
		expect(person.knowsAbout).toBeInstanceOf(Array);
	});

	it("Person jobTitle is the role-neutral identity, with no award or credential nodes", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(person.jobTitle).toBe("Technology Specialist");
		expect(person.award).toBeUndefined();
		expect(person.hasCredential).toBeUndefined();
	});

	it("Person carries a dated hasOccupation history matching the resume", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const person = schemas.find((s) => s["@type"] === "Person");
		expect(person.hasOccupation).toBeInstanceOf(Array);
		expect(person.hasOccupation).toHaveLength(2);

		const roles = person.hasOccupation as Array<{
			"@type": string;
			startDate: string;
			endDate?: string;
			hasOccupation: { name: string };
		}>;
		const solar = roles.find((r) => r.endDate === "2025-12");
		expect(solar).toBeDefined();
		expect(solar?.startDate).toBe("2016-03");
		expect(solar?.hasOccupation.name).toBe("Solar Designer & Technology Specialist");

		const current = roles.find((r) => !r.endDate);
		expect(current).toBeDefined();
		expect(current?.startDate).toBe("2026-01");
	});

	it("Organization is the real legal entity with a truthful founding date", () => {
		const { container } = render(<JsonLd />);
		const schemas = parseAllJsonLd(container);
		const org = schemas.find((s) => s["@type"] === "Organization");
		expect(org["@id"]).toBe("https://alexmayhew.dev/#organization");
		expect(org.name).toBe("Mayhew Technology LLC");
		expect(org.foundingDate).toBe("2026-03-30");
		expect(org.founder).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		// Personal social profiles belong on the Person node only.
		expect(org.sameAs).toBeUndefined();
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

	it("emits none of the banned identity claims anywhere in the global graph", () => {
		const { container } = render(<JsonLd />);
		const serialized = JSON.stringify(parseAllJsonLd(container));
		for (const banned of BANNED_IDENTITY_CLAIMS) {
			expect(serialized).not.toContain(banned);
		}
	});
});

describe("ServicesJsonLd (route-scoped ProfessionalService)", () => {
	it("renders one ProfessionalService node with the canonical @id and founder ref", () => {
		const { container } = render(<ServicesJsonLd />);
		const schemas = parseAllJsonLd(container);
		expect(schemas).toHaveLength(1);
		const service = schemas[0];
		expect(service["@type"]).toBe("ProfessionalService");
		expect(service["@id"]).toBe("https://alexmayhew.dev/#business");
		expect(service.name).toBe("Mayhew Technology LLC");
		expect(service.founder).toEqual({ "@id": "https://alexmayhew.dev/#person" });
	});

	it("offer catalog carries no prices of any kind", () => {
		const { container } = render(<ServicesJsonLd />);
		const service = parseAllJsonLd(container)[0];
		expect(service.hasOfferCatalog["@type"]).toBe("OfferCatalog");
		expect(service.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
		const serialized = JSON.stringify(service);
		expect(serialized).not.toContain("priceSpecification");
		expect(serialized).not.toContain("minPrice");
		expect(serialized).not.toContain("maxPrice");
		expect(service.priceRange).toBeUndefined();
		expect(service.paymentAccepted).toBeUndefined();
		expect(service.currenciesAccepted).toBeUndefined();
	});

	it("address locks to East Falmouth, MA (regression lock)", () => {
		const { container } = render(<ServicesJsonLd />);
		const service = parseAllJsonLd(container)[0];
		expect(service.address["@type"]).toBe("PostalAddress");
		expect(service.address.addressLocality).toBe("East Falmouth");
		expect(service.address.addressRegion).toBe("MA");
		expect(service.address.addressCountry).toBe("US");
		const areaServedNames = service.areaServed.map((a: { name: string }) => a.name);
		expect(areaServedNames).not.toContain("Boston");
	});

	it("emits none of the banned identity claims", () => {
		const { container } = render(<ServicesJsonLd />);
		const serialized = JSON.stringify(parseAllJsonLd(container));
		for (const banned of BANNED_IDENTITY_CLAIMS) {
			expect(serialized).not.toContain(banned);
		}
	});
});
