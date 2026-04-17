import { readdirSync, readFileSync } from "fs";

import { describe, expect, it } from "vitest";

const INTERNAL_LINK_FLOOR = 4;

// Hub-and-spoke SEO equity flows through /blog/ links specifically.
// Service-page CTAs appear in every post footer, so they don't signal
// topical relatedness the way blog-to-blog links do.
const INTERNAL_PATH_PREFIXES = [
	"/blog/",
	"/services",
	"/newsletter",
	"/tools",
	"/about",
	"/contact",
	"/for/",
	"/work",
	"/quiz",
	"/docs",
];

const BLOG_LINK_FLOOR = 4;
const BLOG_PATH_PREFIX = "/blog/";

function stripFrontmatter(content: string): string {
	if (!content.startsWith("---")) return content;
	const closeIdx = content.indexOf("\n---", 3);
	if (closeIdx === -1) return content;
	return content.slice(closeIdx + 4);
}

function isInternalPath(href: string): boolean {
	if (!href.startsWith("/")) return false;
	return INTERNAL_PATH_PREFIXES.some((prefix) => href.startsWith(prefix));
}

function extractLinks(slug: string): string[] {
	const raw = readFileSync(`content/blog/${slug}.mdx`, "utf-8");
	const body = stripFrontmatter(raw);
	const links: string[] = [];

	// Markdown: [text](/path)
	const mdPattern = /\[[^\]]+\]\(([^)]+)\)/g;
	for (const match of body.matchAll(mdPattern)) {
		const href = match[1].split(/\s+/)[0];
		links.push(href);
	}

	// JSX: <Link href="/path"> or <a href="/path">
	const jsxPattern = /<(?:Link|a)\s+[^>]*href=["']([^"']+)["']/g;
	for (const match of body.matchAll(jsxPattern)) {
		links.push(match[1]);
	}

	return links;
}

function countInternalLinks(slug: string): { count: number; links: string[] } {
	const links = extractLinks(slug).filter(isInternalPath);
	return { count: links.length, links };
}

function countBlogLinks(slug: string): { count: number; links: string[] } {
	const links = extractLinks(slug).filter((href) => href.startsWith(BLOG_PATH_PREFIX));
	return { count: links.length, links };
}

const BLOG_SLUGS = readdirSync("content/blog")
	.filter((f) => f.endsWith(".mdx"))
	.map((f) => f.replace(/\.mdx$/, ""))
	.filter((slug) => slug !== "hello-world")
	.filter((slug) => {
		const content = readFileSync(`content/blog/${slug}.mdx`, "utf-8");
		return !/^\s*draft:\s*true/m.test(content);
	});

describe("blog posts meet internal-link floor", () => {
	it.each(BLOG_SLUGS)("%s has at least " + INTERNAL_LINK_FLOOR + " internal links", (slug) => {
		const { count, links } = countInternalLinks(slug);
		expect(
			count,
			`${slug}: found ${count} internal links (need ${INTERNAL_LINK_FLOOR}+). Links: ${links.join(", ")}`
		).toBeGreaterThanOrEqual(INTERNAL_LINK_FLOOR);
	});

	it.each(BLOG_SLUGS)("%s has at least " + BLOG_LINK_FLOOR + " /blog/ links", (slug) => {
		const { count, links } = countBlogLinks(slug);
		expect(
			count,
			`${slug}: found ${count} /blog/ links (need ${BLOG_LINK_FLOOR}+ for hub-spoke equity). Links: ${links.join(", ")}`
		).toBeGreaterThanOrEqual(BLOG_LINK_FLOOR);
	});
});
