import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "../..");
const OFFENDING =
	/\b(text|bg|border|from|to|via|ring|outline|fill|stroke|decoration|placeholder|caret|accent|shadow|divide|ring-offset)-(amber|blue|green|yellow|purple)-(400|500)\b/;

const ENFORCED_FILES = [
	"src/app/services/migrations/[slug]/migration-page-content.tsx",
	"src/app/services/integrations/[slug]/integration-page-content.tsx",
	"src/app/services/comparisons/[slug]/comparison-page-content.tsx",
	"src/app/tools/pilot/page.tsx",
	"src/app/tools/traceforge/page.tsx",
	"src/components/pages/tools-page.tsx",
	"src/components/blog/layouts/terminal-layout.tsx",
];

describe("Wave F2 off-palette sweep (continuation)", () => {
	it.each(ENFORCED_FILES)("%s has no amber/blue/green/yellow/purple-400|500 utilities", (file) => {
		const abs = path.resolve(REPO_ROOT, file);
		const src = fs.readFileSync(abs, "utf-8");
		const match = src.match(OFFENDING);
		expect(match, `Off-palette utility: ${match?.[0]}`).toBeNull();
	});
});
