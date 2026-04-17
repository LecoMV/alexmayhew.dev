import fs from "node:fs";
import path from "node:path";

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

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function publishedBlogSlugs(): string[] {
	return fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith(".mdx"))
		.map((f) => f.replace(/\.mdx$/, ""))
		.sort();
}

describe("hub-faqs", () => {
	it.each(AI_SERIES_FAQ_SLUGS)("has FAQ entries for %s post", (slug) => {
		expect(hubFaqs[slug]).toBeDefined();
		expect(hubFaqs[slug].length).toBeGreaterThanOrEqual(3);
	});

	it.each(publishedBlogSlugs())("every published blog post has at least 3 FAQs: %s", (slug) => {
		expect(hubFaqs[slug], `missing FAQ entries for slug: ${slug}`).toBeDefined();
		expect(hubFaqs[slug].length).toBeGreaterThanOrEqual(3);
	});
});
