import { describe, expect, it } from "vitest";

import { parseFrontmatter, parseTags } from "@/lib/frontmatter";

describe("parseTags", () => {
	it("parses inline array format", () => {
		expect(parseTags('["react", "typescript"]')).toEqual(["react", "typescript"]);
	});

	it("parses single-quoted inline array", () => {
		expect(parseTags("['react', 'next']")).toEqual(["react", "next"]);
	});

	it("returns empty array for non-array input", () => {
		expect(parseTags("not an array")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(parseTags("")).toEqual([]);
	});

	it("trims whitespace from tags", () => {
		expect(parseTags("[  react ,  typescript  ]")).toEqual(["react", "typescript"]);
	});
});

describe("parseFrontmatter", () => {
	it("parses key-value pairs from frontmatter", () => {
		const content = "---\ntitle: Hello World\nauthor: John\n---\n\nContent here";
		const result = parseFrontmatter(content);
		expect(result.title).toBe("Hello World");
		expect(result.author).toBe("John");
	});

	it("strips quotes from values", () => {
		const content = '---\ntitle: "Hello World"\n---';
		const result = parseFrontmatter(content);
		expect(result.title).toBe("Hello World");
	});

	it("returns empty object for no frontmatter", () => {
		expect(parseFrontmatter("No frontmatter here")).toEqual({});
	});

	it("handles array items under a key", () => {
		const content = "---\ntags:\n  - react\n  - typescript\n---";
		const result = parseFrontmatter(content);
		expect(result.tags).toBe("react,typescript");
	});

	it("handles hyphenated keys", () => {
		const content = "---\npublish-date: 2026-01-01\n---";
		const result = parseFrontmatter(content);
		expect(result["publish-date"]).toBe("2026-01-01");
	});

	it("handles empty frontmatter", () => {
		const content = "---\n---\nContent";
		const result = parseFrontmatter(content);
		expect(Object.keys(result).length).toBe(0);
	});
});
