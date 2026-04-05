import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

describe("width design tokens in globals.css", () => {
	const cssPath = path.resolve(__dirname, "../../src/app/globals.css");
	const content = fs.readFileSync(cssPath, "utf-8");

	it("defines --max-width-article: 1280px", () => {
		expect(content).toMatch(/--max-width-article:\s*1280px/);
	});

	it("defines --max-width-narrow: 900px", () => {
		expect(content).toMatch(/--max-width-narrow:\s*900px/);
	});

	it("defines --max-width-newsletter: 700px", () => {
		expect(content).toMatch(/--max-width-newsletter:\s*700px/);
	});
});

describe("source files use tokens instead of arbitrary values", () => {
	it("blog-article.tsx uses max-w-article instead of max-w-[1280px]", () => {
		const filePath = path.resolve(__dirname, "../../src/components/blog/blog-article.tsx");
		const source = fs.readFileSync(filePath, "utf-8");
		expect(source).not.toContain("max-w-[1280px]");
		expect(source).toContain("max-w-article");
	});

	it("newsletter/page.tsx uses max-w-narrow instead of max-w-[900px]", () => {
		const filePath = path.resolve(__dirname, "../../src/app/newsletter/page.tsx");
		const source = fs.readFileSync(filePath, "utf-8");
		expect(source).not.toContain("max-w-[900px]");
		expect(source).toContain("max-w-narrow");
	});

	it("newsletter/[slug]/page.tsx uses max-w-newsletter instead of max-w-[700px]", () => {
		const filePath = path.resolve(__dirname, "../../src/app/newsletter/[slug]/page.tsx");
		const source = fs.readFileSync(filePath, "utf-8");
		expect(source).not.toContain("max-w-[700px]");
		expect(source).toContain("max-w-newsletter");
	});
});
