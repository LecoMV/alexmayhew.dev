import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

const AI_SERIES_POSTS = [
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

function checkVoiceViolations(slug: string): string[] {
	const content = readFileSync(`content/blog/${slug}.mdx`, "utf-8");
	const lines = content.split("\n");
	const violations: string[] = [];

	lines.forEach((line, i) => {
		if (line === "---") return;
		if (line.includes("—")) violations.push(`Line ${i + 1} (em dash): ${line.trim().slice(0, 80)}`);
		if (line.includes(" -- "))
			violations.push(`Line ${i + 1} (double dash): ${line.trim().slice(0, 80)}`);
	});

	return violations;
}

describe("blog voice rules", () => {
	it.each(AI_SERIES_POSTS)("%s contains no em dashes or double dashes", (slug) => {
		const violations = checkVoiceViolations(slug);
		expect(violations, `Voice violations found:\n${violations.join("\n")}`).toHaveLength(0);
	});
});
