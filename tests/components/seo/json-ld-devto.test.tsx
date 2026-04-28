/**
 * Person.sameAs must include dev.to/alexmayhewdev (cross-platform identity
 * signal for AI search; entity-graph cluster reinforcement).
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/json-ld";

describe("JsonLd Person.sameAs cross-platform identity", () => {
	it("includes the dev.to profile in sameAs", () => {
		const { container } = render(<JsonLd />);
		const scripts = container.querySelectorAll('script[type="application/ld+json"]');
		const person = Array.from(scripts)
			.map((s) => JSON.parse(s.innerHTML))
			.find((s) => s["@type"] === "Person");
		expect(person.sameAs).toContain("https://dev.to/alexmayhewdev");
	});
});
