import { describe, expect, it } from "vitest";

import { hubFaqs } from "@/app/blog/[slug]/hub-faqs";

describe("hub-faqs", () => {
	it("has FAQ entries for cognitive-debt-ai-teams post", () => {
		expect(hubFaqs["cognitive-debt-ai-teams"]).toBeDefined();
		expect(hubFaqs["cognitive-debt-ai-teams"].length).toBeGreaterThanOrEqual(3);
	});

	it("has FAQ entries for metr-paradox-ai-productivity post", () => {
		expect(hubFaqs["metr-paradox-ai-productivity"]).toBeDefined();
		expect(hubFaqs["metr-paradox-ai-productivity"].length).toBeGreaterThanOrEqual(3);
	});
});
