import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	AREA_SERVED,
	breadcrumbSchema,
	faqSchema,
	JsonLdScript,
	SCHEMA_CONTEXT,
	SITE_URL,
	webPageSchema,
	WEBSITE_REF,
} from "@/components/seo/schema-utils";

describe("SEO schema constants", () => {
	it("SITE_URL equals the production domain", () => {
		expect(SITE_URL).toBe("https://alexmayhew.dev");
	});

	it("SCHEMA_CONTEXT equals schema.org URL", () => {
		expect(SCHEMA_CONTEXT).toBe("https://schema.org");
	});

	it("AREA_SERVED represents worldwide coverage", () => {
		expect(AREA_SERVED["@type"]).toBe("Place");
		expect(AREA_SERVED.name).toBe("Worldwide");
	});

	it("WEBSITE_REF has correct structure", () => {
		expect(WEBSITE_REF["@type"]).toBe("WebSite");
		expect(WEBSITE_REF["@id"]).toBe(`${SITE_URL}/#website`);
		expect(WEBSITE_REF.url).toBe(SITE_URL);
		expect(WEBSITE_REF.name).toBe("Alex Mayhew");
	});
});

describe("faqSchema", () => {
	it("returns FAQPage type with schema.org context", () => {
		const result = faqSchema([{ question: "Q?", answer: "A." }]);
		expect(result["@context"]).toBe("https://schema.org");
		expect(result["@type"]).toBe("FAQPage");
	});

	it("maps FAQs to Question entities with accepted answers", () => {
		const faqs = [
			{ question: "What is Next.js?", answer: "A React framework." },
			{ question: "Why use TypeScript?", answer: "Type safety." },
		];
		const result = faqSchema(faqs);
		expect(result.mainEntity).toHaveLength(2);
		expect(result.mainEntity[0]["@type"]).toBe("Question");
		expect(result.mainEntity[0].name).toBe("What is Next.js?");
		expect(result.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
		expect(result.mainEntity[0].acceptedAnswer.text).toBe("A React framework.");
	});

	it("returns empty mainEntity for empty FAQs", () => {
		const result = faqSchema([]);
		expect(result.mainEntity).toEqual([]);
	});
});

describe("breadcrumbSchema", () => {
	it("returns BreadcrumbList with context", () => {
		const result = breadcrumbSchema([{ name: "Home", item: "/" }]);
		expect(result["@context"]).toBe("https://schema.org");
		expect(result["@type"]).toBe("BreadcrumbList");
	});

	it("assigns 1-indexed positions to items", () => {
		const items = [
			{ name: "Home", item: "/" },
			{ name: "Blog", item: "/blog" },
			{ name: "Post", item: "/blog/post" },
		];
		const result = breadcrumbSchema(items);
		expect(result.itemListElement).toHaveLength(3);
		expect(result.itemListElement[0].position).toBe(1);
		expect(result.itemListElement[1].position).toBe(2);
		expect(result.itemListElement[2].position).toBe(3);
	});

	it("sets ListItem type on each element", () => {
		const result = breadcrumbSchema([{ name: "Home", item: "/" }]);
		expect(result.itemListElement[0]["@type"]).toBe("ListItem");
	});
});

describe("webPageSchema", () => {
	const baseParams = {
		pageUrl: "https://alexmayhew.dev/about",
		title: "About",
		description: "About page",
		aboutName: "Alex Mayhew",
		keywords: ["consulting", "architecture"],
	};

	it("includes all required fields", () => {
		const result = webPageSchema(baseParams);
		expect(result["@context"]).toBe("https://schema.org");
		expect(result["@type"]).toBe("WebPage");
		expect(result["@id"]).toBe(baseParams.pageUrl);
		expect(result.url).toBe(baseParams.pageUrl);
		expect(result.name).toBe("About");
		expect(result.description).toBe("About page");
		expect(result.inLanguage).toBe("en-US");
	});

	it("includes dateModified when provided", () => {
		const result = webPageSchema({ ...baseParams, dateModified: "2026-01-15" });
		expect(result.dateModified).toBe("2026-01-15");
	});

	it("omits dateModified when not provided", () => {
		const result = webPageSchema(baseParams);
		expect(result).not.toHaveProperty("dateModified");
	});

	it("falls back to pageUrl for mainEntityId when not provided", () => {
		const result = webPageSchema(baseParams);
		expect(result.mainEntity["@id"]).toBe(baseParams.pageUrl);
	});

	it("uses provided mainEntityId", () => {
		const result = webPageSchema({ ...baseParams, mainEntityId: "#service" });
		expect(result.mainEntity["@id"]).toBe("#service");
	});

	it("joins keywords as comma-separated string", () => {
		const result = webPageSchema(baseParams);
		expect(result.keywords).toBe("consulting, architecture");
	});
});

describe("JsonLdScript", () => {
	it("renders a script element with application/ld+json type", () => {
		const data = { "@type": "WebSite", name: "Test" };
		const { container } = render(JsonLdScript({ data }));
		const script = container.querySelector("script");
		expect(script).not.toBeNull();
		expect(script!.getAttribute("type")).toBe("application/ld+json");
	});

	it("contains JSON-stringified data", () => {
		const data = { "@type": "WebSite", name: "Test" };
		const { container } = render(JsonLdScript({ data }));
		const script = container.querySelector("script");
		expect(script!.innerHTML).toBe(JSON.stringify(data));
	});
});
