import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqJsonLd } from "@/components/seo/faq-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("FaqJsonLd", () => {
	it("renders FAQPage type with Question entities and acceptedAnswer", () => {
		const faqs = [
			{ question: "What is Next.js?", answer: "A React framework for production." },
			{ question: "Why TypeScript?", answer: "Type safety reduces runtime errors." },
		];
		const { container } = render(<FaqJsonLd faqs={faqs} />);
		const data = parseJsonLd(container);
		expect(data["@context"]).toBe("https://schema.org");
		expect(data["@type"]).toBe("FAQPage");
		expect(data.mainEntity).toHaveLength(2);
		expect(data.mainEntity[0]["@type"]).toBe("Question");
		expect(data.mainEntity[0].name).toBe("What is Next.js?");
		expect(data.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
		expect(data.mainEntity[0].acceptedAnswer.text).toBe("A React framework for production.");
		expect(data.mainEntity[1].name).toBe("Why TypeScript?");
	});
});
