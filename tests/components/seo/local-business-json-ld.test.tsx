import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";

describe("LocalBusinessJsonLd", () => {
	it("renders null with no script tags (consolidated into main JsonLd)", () => {
		const { container } = render(<LocalBusinessJsonLd />);
		expect(container.innerHTML).toBe("");
		const scripts = container.querySelectorAll('script[type="application/ld+json"]');
		expect(scripts).toHaveLength(0);
	});
});
