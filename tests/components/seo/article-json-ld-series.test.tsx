import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleJsonLd } from "@/components/seo/article-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("ArticleJsonLd series support", () => {
	const baseProps = {
		title: "Post in a series",
		description: "A post belonging to a content cluster.",
		publishedAt: new Date("2026-02-01T00:00:00Z"),
		slug: "series-post",
		category: "architecture",
	};

	it("emits isPartOf CreativeWorkSeries when series prop provided", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} series="saas-architecture" />);
		const data = parseJsonLd(container);
		expect(data.isPartOf).toEqual({
			"@type": "CreativeWorkSeries",
			name: "saas-architecture",
		});
	});
});
