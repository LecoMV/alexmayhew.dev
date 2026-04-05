import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("BreadcrumbJsonLd", () => {
	it("renders BreadcrumbList type with schema.org context", () => {
		const { container } = render(<BreadcrumbJsonLd items={[{ name: "Home", url: "/" }]} />);
		const data = parseJsonLd(container);
		expect(data["@context"]).toBe("https://schema.org");
		expect(data["@type"]).toBe("BreadcrumbList");
	});

	it("assigns 1-indexed positions to breadcrumb items", () => {
		const items = [
			{ name: "Home", url: "/" },
			{ name: "Blog", url: "/blog" },
			{ name: "Post", url: "/blog/my-post" },
		];
		const { container } = render(<BreadcrumbJsonLd items={items} />);
		const data = parseJsonLd(container);
		expect(data.itemListElement).toHaveLength(3);
		expect(data.itemListElement[0].position).toBe(1);
		expect(data.itemListElement[1].position).toBe(2);
		expect(data.itemListElement[2].position).toBe(3);
	});

	it("sets ListItem type on each element", () => {
		const { container } = render(<BreadcrumbJsonLd items={[{ name: "Home", url: "/" }]} />);
		const data = parseJsonLd(container);
		expect(data.itemListElement[0]["@type"]).toBe("ListItem");
	});

	it("prepends site URL for relative paths", () => {
		const { container } = render(<BreadcrumbJsonLd items={[{ name: "Blog", url: "/blog" }]} />);
		const data = parseJsonLd(container);
		expect(data.itemListElement[0].item).toBe("https://alexmayhew.dev/blog");
	});

	it("keeps absolute URLs unchanged", () => {
		const { container } = render(
			<BreadcrumbJsonLd items={[{ name: "External", url: "https://example.com" }]} />
		);
		const data = parseJsonLd(container);
		expect(data.itemListElement[0].item).toBe("https://example.com");
	});

	it("handles empty items array", () => {
		const { container } = render(<BreadcrumbJsonLd items={[]} />);
		const data = parseJsonLd(container);
		expect(data.itemListElement).toEqual([]);
	});
});
