import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

/**
 * Decorative bullet characters (U+25CF black circle, U+25CB white circle)
 * wrapped in <span> are purely visual (e.g., pulsing status dots before
 * headings). Screen readers announce "black circle" before each heading,
 * creating noise.
 *
 * Rule: every <span>...bullet...</span> in src/ must either include
 * aria-hidden="true" on the span itself, or live under an ancestor with
 * aria-hidden="true".
 */

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.resolve(ROOT, "src");

// Email templates are server-rendered HTML emails, not audited by screen
// readers in the web a11y sense.
const EXCLUDED_FILES = new Set<string>([
	path.resolve(SRC, "components/emails/contact-notification.tsx"),
	// Wave E2 owns this page; tracked separately.
	path.resolve(SRC, "app/tools/traceforge/page.tsx"),
]);

const EXCLUDED_DIR_PREFIXES = [
	path.resolve(SRC, "components/traceforge"),
	path.resolve(SRC, "components/pilot"),
];

function isExcluded(abs: string): boolean {
	if (EXCLUDED_FILES.has(abs)) return true;
	return EXCLUDED_DIR_PREFIXES.some((p) => abs.startsWith(p + path.sep));
}

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const abs = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(abs, out);
		} else if (entry.isFile() && abs.endsWith(".tsx")) {
			out.push(abs);
		}
	}
	return out;
}

const BULLET_SPAN_RE = /<span\b([^>]*)>([^<]*[\u25CF\u25CB][^<]*)<\/span>/g;

function hasUnclosedAriaHiddenAncestor(preceding: string): boolean {
	const openTagRe = /<(\w+)\b[^>]*aria-hidden\s*=\s*["']?true["']?[^>]*?(\/?)>/g;
	let m: RegExpExecArray | null;
	while ((m = openTagRe.exec(preceding)) !== null) {
		const [, tag, selfClose] = m;
		if (selfClose === "/") continue;
		const after = preceding.slice(m.index + m[0].length);
		const closeRe = new RegExp(`</${tag}\\s*>`);
		if (!closeRe.test(after)) return true;
	}
	return false;
}

function findBulletSpanViolations(source: string): Array<{ line: number; snippet: string }> {
	const violations: Array<{ line: number; snippet: string }> = [];
	let match: RegExpExecArray | null;
	BULLET_SPAN_RE.lastIndex = 0;
	while ((match = BULLET_SPAN_RE.exec(source)) !== null) {
		const [full, attrs] = match;
		if (/aria-hidden\s*=\s*["']?true["']?/.test(attrs)) continue;

		const windowStart = Math.max(0, match.index - 400);
		const preceding = source.slice(windowStart, match.index);
		if (hasUnclosedAriaHiddenAncestor(preceding)) continue;

		const line = source.slice(0, match.index).split("\n").length;
		violations.push({ line, snippet: full.slice(0, 120) });
	}
	return violations;
}

const allFiles = walk(SRC).filter((abs) => !isExcluded(abs));
const candidates = allFiles.filter((abs) => {
	const src = fs.readFileSync(abs, "utf-8");
	return /<span\b[^>]*>[^<]*[\u25CF\u25CB][^<]*<\/span>/.test(src);
});
const relCandidates = candidates.map((abs) => path.relative(ROOT, abs));

describe("decorative bullet spans are aria-hidden", () => {
	it.each(relCandidates)("%s ... every bullet span has aria-hidden", (rel) => {
		const source = fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
		const violations = findBulletSpanViolations(source);
		expect(
			violations,
			`Decorative bullet span(s) without aria-hidden in ${rel}:\n${violations
				.slice(0, 20)
				.map((v) => `  line ${v.line}: ${v.snippet}`)
				.join("\n")}${violations.length > 20 ? `\n  ... and ${violations.length - 20} more` : ""}`
		).toHaveLength(0);
	});
});
