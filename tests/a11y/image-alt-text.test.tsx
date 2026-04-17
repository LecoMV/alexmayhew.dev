import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

/**
 * Every <Image> or <img> in src/ must have either:
 *   (a) alt="" combined with aria-hidden="true" or role="presentation"
 *       (decorative image)
 *   (b) alt={...} with >= 3 chars and not matching generic placeholder
 *       patterns (image, photo, picture, img, or bare file extensions).
 *
 * Generic alt text ("image", "photo", a filename) conveys no meaning to
 * screen-reader users and fails WCAG 1.1.1 Non-text Content (Level A).
 */

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.resolve(ROOT, "src");

const GENERIC_ALT_RE = /^(image|photo|picture|img|\.webp|\.png|\.jpg|\.jpeg|\.gif|\.svg)$/i;

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

type Violation = {
	line: number;
	reason: string;
	snippet: string;
};

const IMAGE_TAG_RE = /<(Image|img)\b([^>]*?)\/>/gs;

function findImageViolations(source: string): Violation[] {
	const violations: Violation[] = [];
	let match: RegExpExecArray | null;
	IMAGE_TAG_RE.lastIndex = 0;
	while ((match = IMAGE_TAG_RE.exec(source)) !== null) {
		const [full, , attrs] = match;
		const line = source.slice(0, match.index).split("\n").length;
		const snippet = full.replace(/\s+/g, " ").slice(0, 160);

		const ariaHidden = /aria-hidden\s*=\s*\{?["']?true["']?\}?/.test(attrs);
		const rolePresentation = /role\s*=\s*["']presentation["']/.test(attrs);
		const decorative = ariaHidden || rolePresentation;

		const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]+)\})/);

		if (!altMatch) {
			if (decorative) continue;
			violations.push({ line, reason: "missing alt attribute", snippet });
			continue;
		}

		const literal = altMatch[1] ?? altMatch[2];
		const expr = altMatch[3];

		if (typeof literal === "string") {
			if (literal === "") {
				if (!decorative) {
					violations.push({
						line,
						reason: 'alt="" without aria-hidden or role="presentation"',
						snippet,
					});
				}
				continue;
			}
			if (GENERIC_ALT_RE.test(literal.trim())) {
				violations.push({ line, reason: `generic alt text: "${literal}"`, snippet });
				continue;
			}
			if (literal.trim().length < 3) {
				violations.push({ line, reason: `alt too short (<3 chars): "${literal}"`, snippet });
				continue;
			}
		} else if (typeof expr === "string") {
			const trimmed = expr.trim();
			if ((trimmed === '""' || trimmed === "''") && !decorative) {
				violations.push({
					line,
					reason: 'alt={""} without aria-hidden or role="presentation"',
					snippet,
				});
			}
			const literalExprMatch = trimmed.match(/^["']([^"']*)["']$/);
			if (literalExprMatch && GENERIC_ALT_RE.test(literalExprMatch[1].trim())) {
				violations.push({
					line,
					reason: `generic alt text in expression: ${trimmed}`,
					snippet,
				});
			}
		}
	}
	return violations;
}

const allFiles = walk(SRC);
const candidateFiles = allFiles.filter((abs) => {
	const src = fs.readFileSync(abs, "utf-8");
	return /<(Image|img)\b/.test(src);
});
const relCandidates = candidateFiles.map((abs) => path.relative(ROOT, abs));

describe("image alt text is descriptive or decorative", () => {
	it.each(relCandidates)("%s ... every Image/img tag passes alt text rules", (rel) => {
		const source = fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
		const violations = findImageViolations(source);
		expect(
			violations,
			`Image alt text violations in ${rel}:\n${violations
				.slice(0, 20)
				.map((v) => `  line ${v.line}: ${v.reason}\n    ${v.snippet}`)
				.join("\n")}${violations.length > 20 ? `\n  ... and ${violations.length - 20} more` : ""}`
		).toHaveLength(0);
	});
});
