import { describe, expect, it } from "vitest";

import { isSvgSafe, sanitizeSvg } from "@/lib/vectorizer/sanitize";

describe("sanitizeSvg", () => {
	it("returns empty string for null/undefined input", () => {
		expect(sanitizeSvg("")).toBe("");
		expect(sanitizeSvg(null as unknown as string)).toBe("");
		expect(sanitizeSvg(undefined as unknown as string)).toBe("");
	});

	it("preserves valid SVG elements", () => {
		const svg =
			'<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="red"/></svg>';
		const result = sanitizeSvg(svg);
		expect(result).toContain("<rect");
		expect(result).toContain("width");
		expect(result).toContain("fill");
	});

	it("removes script tags", () => {
		const svg = '<svg><script>alert("xss")</script><rect width="100"/></svg>';
		const result = sanitizeSvg(svg);
		expect(result).not.toContain("<script");
		expect(result).not.toContain("alert");
	});

	it("removes javascript: URIs", () => {
		const svg = '<svg><a href="javascript:alert(1)"><rect/></a></svg>';
		const result = sanitizeSvg(svg);
		expect(result).not.toContain("javascript:");
	});

	it("removes event handlers", () => {
		const svg = '<svg><rect onload="alert(1)" width="100"/></svg>';
		const result = sanitizeSvg(svg);
		expect(result).not.toContain("onload");
	});

	it("removes iframe elements", () => {
		const svg = '<svg><foreignObject><iframe src="evil.com"/></foreignObject></svg>';
		const result = sanitizeSvg(svg);
		expect(result).not.toContain("<iframe");
	});

	it("preserves path elements with d attribute", () => {
		const svg = '<svg><path d="M10 10 L90 90" stroke="black"/></svg>';
		const result = sanitizeSvg(svg);
		expect(result).toContain("<path");
		expect(result).toContain('d="M10 10 L90 90"');
	});

	it("preserves gradient elements", () => {
		const svg =
			'<svg><defs><linearGradient id="g1"><stop offset="0%" stop-color="red"/></linearGradient></defs></svg>';
		const result = sanitizeSvg(svg);
		expect(result).toContain("linearGradient");
		expect(result).toContain("stop");
	});
});

describe("isSvgSafe", () => {
	it("returns false for empty/null input", () => {
		expect(isSvgSafe("")).toBe(false);
		expect(isSvgSafe(null as unknown as string)).toBe(false);
		expect(isSvgSafe(undefined as unknown as string)).toBe(false);
	});

	it("returns true for clean SVG", () => {
		const svg = '<svg><rect width="100" height="100"/></svg>';
		expect(isSvgSafe(svg)).toBe(true);
	});

	it("returns false for SVG with script tag", () => {
		expect(isSvgSafe("<svg><script>alert(1)</script></svg>")).toBe(false);
	});

	it("returns false for SVG with javascript: URI", () => {
		expect(isSvgSafe('<svg><a href="javascript:void(0)"></a></svg>')).toBe(false);
	});

	it("returns false for SVG with event handler", () => {
		expect(isSvgSafe('<svg onload="alert(1)"></svg>')).toBe(false);
	});

	it("returns false for SVG with iframe", () => {
		expect(isSvgSafe('<svg><iframe src="x"/></svg>')).toBe(false);
	});

	it("returns false for SVG with object tag", () => {
		expect(isSvgSafe('<svg><object data="x"/></svg>')).toBe(false);
	});

	it("returns false for data:text/html URI", () => {
		expect(isSvgSafe('<svg><image href="data:text/html,<script>"/></svg>')).toBe(false);
	});
});
