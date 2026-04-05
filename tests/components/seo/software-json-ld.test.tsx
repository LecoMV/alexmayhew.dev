import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SoftwareJsonLd } from "@/components/seo/software-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("SoftwareJsonLd", () => {
	const baseProps = {
		name: "TraceForge",
		description: "High-performance vectorization engine",
		url: "/work/traceforge",
		applicationCategory: "DeveloperApplication",
		operatingSystem: "Web",
	};

	it("renders SoftwareApplication type with schema.org context", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data["@context"]).toBe("https://schema.org");
		expect(data["@type"]).toBe("SoftwareApplication");
	});

	it("sets required fields correctly", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.name).toBe("TraceForge");
		expect(data.description).toBe("High-performance vectorization engine");
		expect(data.applicationCategory).toBe("DeveloperApplication");
		expect(data.operatingSystem).toBe("Web");
	});

	it("prepends site URL to the url field", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.url).toBe("https://alexmayhew.dev/work/traceforge");
	});

	it("uses PERSON_REF for author", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.author).toEqual({ "@id": "https://alexmayhew.dev/#person" });
	});

	it("defaults price to 0 USD", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.offers.price).toBe("0");
		expect(data.offers.priceCurrency).toBe("USD");
	});

	it("uses custom price and currency when provided", () => {
		const { container } = render(
			<SoftwareJsonLd {...baseProps} price="49.99" priceCurrency="EUR" />
		);
		const data = parseJsonLd(container);
		expect(data.offers.price).toBe("49.99");
		expect(data.offers.priceCurrency).toBe("EUR");
	});

	it("includes featureList when provided", () => {
		const features = ["Feature A", "Feature B"];
		const { container } = render(<SoftwareJsonLd {...baseProps} featureList={features} />);
		const data = parseJsonLd(container);
		expect(data.featureList).toEqual(features);
	});

	it("omits featureList when not provided", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data).not.toHaveProperty("featureList");
	});

	it("includes softwareVersion when provided", () => {
		const { container } = render(<SoftwareJsonLd {...baseProps} softwareVersion="2.1.0" />);
		const data = parseJsonLd(container);
		expect(data.softwareVersion).toBe("2.1.0");
	});

	it("includes downloadUrl when provided", () => {
		const { container } = render(
			<SoftwareJsonLd {...baseProps} downloadUrl="https://github.com/repo/releases" />
		);
		const data = parseJsonLd(container);
		expect(data.downloadUrl).toBe("https://github.com/repo/releases");
	});
});
