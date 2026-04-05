import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactJsonLd } from "@/components/seo/contact-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("ContactJsonLd", () => {
	it("renders ContactPage type with schema.org context", () => {
		const { container } = render(<ContactJsonLd />);
		const data = parseJsonLd(container);
		expect(data["@context"]).toBe("https://schema.org");
		expect(data["@type"]).toBe("ContactPage");
	});

	it("sets the correct URL", () => {
		const { container } = render(<ContactJsonLd />);
		const data = parseJsonLd(container);
		expect(data.url).toBe("https://alexmayhew.dev/contact");
	});

	it("uses PERSON_REF for mainEntity (not inline Person)", () => {
		const { container } = render(<ContactJsonLd />);
		const data = parseJsonLd(container);
		expect(data.mainEntity).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(data.mainEntity).not.toHaveProperty("name");
	});
});
