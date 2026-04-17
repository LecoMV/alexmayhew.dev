import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { describe, expect, it } from "vitest";

const BLOG_DIR = "content/blog";
const TITLE_MAX = 60;
const DESC_MAX = 160;

function parseFrontmatter(content: string): { title?: string; description?: string } {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const fm = match[1];

	const extract = (key: string): string | undefined => {
		const line = fm.split("\n").find((l) => l.startsWith(`${key}:`));
		if (!line) return undefined;
		const raw = line.slice(key.length + 1).trim();
		if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
			return raw.slice(1, -1).replace(/\\"/g, '"').replace(/''/g, "'");
		}
		return raw;
	};

	return { title: extract("title"), description: extract("description") };
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

describe("blog meta lengths (SERP compliance)", () => {
	it.each(files)("%s title <= 60 chars (excluding ' | Alex Mayhew' suffix)", (file) => {
		const content = readFileSync(join(BLOG_DIR, file), "utf-8");
		const { title } = parseFrontmatter(content);
		expect(title, `Missing title in ${file}`).toBeDefined();
		expect(
			title!.length,
			`Title in ${file} is ${title!.length} chars (max ${TITLE_MAX}): "${title}"`
		).toBeLessThanOrEqual(TITLE_MAX);
	});

	it.each(files)("%s description 140-160 chars for SERP snippet", (file) => {
		const content = readFileSync(join(BLOG_DIR, file), "utf-8");
		const { description } = parseFrontmatter(content);
		expect(description, `Missing description in ${file}`).toBeDefined();
		expect(
			description!.length,
			`Description in ${file} is ${description!.length} chars (max ${DESC_MAX}): "${description}"`
		).toBeLessThanOrEqual(DESC_MAX);
	});
});
