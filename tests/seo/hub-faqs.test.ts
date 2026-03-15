import { describe, expect, it } from "vitest";

import { hubFaqs } from "@/app/blog/[slug]/hub-faqs";

const AI_SERIES_FAQ_SLUGS = [
	"cognitive-debt-ai-teams",
	"metr-paradox-ai-productivity",
	"production-mcp-servers",
	"when-not-to-use-ai-coding",
	"ai-technical-debt-bomb",
	"agentic-engineering",
	"ai-tdd-non-deterministic-code",
	"ai-security-red-team-playbook",
	"claude-code-vs-cursor-cost-analysis",
	"vibe-coding-hangover-recovery",
	"hiring-ai-engineers",
	"enterprise-ai-sdlc-blueprint",
];

describe("hub-faqs", () => {
	it.each(AI_SERIES_FAQ_SLUGS)("has FAQ entries for %s post", (slug) => {
		expect(hubFaqs[slug]).toBeDefined();
		expect(hubFaqs[slug].length).toBeGreaterThanOrEqual(3);
	});
});
