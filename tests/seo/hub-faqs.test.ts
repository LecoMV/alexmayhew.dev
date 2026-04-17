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

	it("every FAQ answer is at least 50 characters and at most 600", () => {
		const violations: string[] = [];
		for (const [slug, faqs] of Object.entries(hubFaqs)) {
			for (const faq of faqs) {
				if (faq.answer.length < 50 || faq.answer.length > 600) {
					violations.push(
						`${slug}: answer length ${faq.answer.length} for "${faq.question.slice(0, 60)}..."`
					);
				}
			}
		}
		expect(violations, violations.join("\n")).toEqual([]);
	});
});
