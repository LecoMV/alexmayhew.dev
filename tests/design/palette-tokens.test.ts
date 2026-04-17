import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

/**
 * Design palette TDD gate.
 *
 * The audit (2026-04-05) flagged amber-400, blue-400, green-400, green-500,
 * yellow-400, and purple-400 as off-palette. They formed a de facto 7th palette
 * that was never formalized.
 *
 * Resolution: three semantic signal tokens added to globals.css
 * (signal-warn / signal-info / signal-caution), plus cyber-lime for success.
 * green/amber/blue/yellow/purple-400 utilities are banned in the owned files.
 *
 * This test scopes enforcement to the files actually cleaned up in the
 * formalization pass. Other directories (app/services, app/tools page.tsx
 * files, components/pages, components/blog/layouts) still contain violations
 * and will be swept in a follow-up pass.
 */

const REPO_ROOT = path.resolve(__dirname, "../..");
const OFFENDING =
	/\b(text|bg|border|from|to|via|ring|outline|fill|stroke|decoration|placeholder|caret|accent|shadow|divide|ring-offset)-(amber|blue|green|yellow|purple)-(400|500)\b/;

const ENFORCED_PATHS = [
	"src/components/traceforge",
	"src/components/pilot",
	"src/components/ui/navigation.tsx",
	"src/components/ui/footer.tsx",
	"src/components/tools/saas-readiness-quiz.tsx",
	"src/components/terminal/terminal.tsx",
	"src/app/home-page.tsx",
];

function walk(p: string, out: string[] = []): string[] {
	const stat = fs.statSync(p);
	if (stat.isDirectory()) {
		for (const entry of fs.readdirSync(p)) walk(path.join(p, entry), out);
	} else if (p.endsWith(".tsx") || p.endsWith(".ts")) {
		out.push(p);
	}
	return out;
}

describe("globals.css formal signal tokens", () => {
	const cssPath = path.resolve(REPO_ROOT, "src/app/globals.css");
	const content = fs.readFileSync(cssPath, "utf-8");

	it("defines --color-signal-warn", () => {
		expect(content).toMatch(/--color-signal-warn:\s*#[0-9a-fA-F]{6}/);
	});

	it("defines --color-signal-info", () => {
		expect(content).toMatch(/--color-signal-info:\s*#[0-9a-fA-F]{6}/);
	});

	it("defines --color-signal-caution", () => {
		expect(content).toMatch(/--color-signal-caution:\s*#[0-9a-fA-F]{6}/);
	});
});

describe("off-palette Tailwind utilities are banned in enforced paths", () => {
	const files: string[] = [];
	for (const rel of ENFORCED_PATHS) {
		const abs = path.resolve(REPO_ROOT, rel);
		if (fs.existsSync(abs)) walk(abs, files);
	}

	it.each(files)("%s has no amber/blue/green/yellow/purple-400|500 utilities", (file) => {
		const src = fs.readFileSync(file, "utf-8");
		const match = src.match(OFFENDING);
		expect(match, `Off-palette utility found: ${match?.[0]}`).toBeNull();
	});
});
