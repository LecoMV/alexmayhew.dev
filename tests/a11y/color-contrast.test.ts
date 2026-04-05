import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

/**
 * WCAG AA color contrast rule:
 * When bg-cyber-lime (any opacity >= /10) is used as a visible background,
 * text on it MUST use text-void-navy (#0B0E14) for 12.8:1 contrast ratio.
 *
 * Forbidden text colors on cyber-lime backgrounds:
 * - text-slate-text (#94A3B8) -- 2.03:1 ratio (FAIL)
 * - text-mist-white (#E2E8F0) -- 1.43:1 ratio (FAIL)
 *
 * Low-opacity variants (bg-cyber-lime/5) are exempt because the effective
 * background is still dark (void-navy).
 */

const SRC_DIR = path.resolve(__dirname, "../../src");

/**
 * Matches bg-cyber-lime with opacity >= 10, or no opacity (full).
 * Captures: bg-cyber-lime, bg-cyber-lime/10, bg-cyber-lime/20, ..., bg-cyber-lime/100
 * Does NOT match: bg-cyber-lime/5, bg-cyber-lime/[5px] (arbitrary), hover:bg-cyber-lime/10
 */
function hasCyberLimeBg(className: string): boolean {
	// Match bg-cyber-lime with no opacity suffix (full opacity)
	if (/(?:^|\s)bg-cyber-lime(?:\s|"|$)/.test(className)) return true;
	const match = className.match(/bg-cyber-lime\/(\d+)/);
	if (match) {
		const opacity = parseInt(match[1], 10);
		return opacity >= 10;
	}
	return false;
}

/** Forbidden text classes on cyber-lime backgrounds */
const FORBIDDEN_TEXT_ON_LIME = ["text-slate-text", "text-mist-white"];

/**
 * Scan a source file for className strings containing bg-cyber-lime
 * at high opacity with forbidden text colors in the same className.
 */
function findContrastViolationsInFile(
	filePath: string
): Array<{ line: number; className: string; violation: string }> {
	const content = fs.readFileSync(filePath, "utf-8");
	const lines = content.split("\n");
	const violations: Array<{ line: number; className: string; violation: string }> = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Find className strings (both static and cn() calls)
		// Match className="..." patterns
		const classNameMatches = line.matchAll(/className="([^"]+)"/g);
		for (const match of classNameMatches) {
			const classValue = match[1];
			if (hasCyberLimeBg(classValue)) {
				for (const forbidden of FORBIDDEN_TEXT_ON_LIME) {
					if (classValue.includes(forbidden)) {
						violations.push({
							line: i + 1,
							className: classValue,
							violation: `${forbidden} on cyber-lime background`,
						});
					}
				}
			}
		}

		// Match string literals inside cn(), template literals, or ternaries
		const stringLiteralMatches = line.matchAll(/"([^"]*bg-cyber-lime[^"]*)"/g);
		for (const match of stringLiteralMatches) {
			const classValue = match[1];
			// Skip if already caught by className= pattern
			if (line.includes(`className="${classValue}"`)) continue;

			if (hasCyberLimeBg(classValue)) {
				for (const forbidden of FORBIDDEN_TEXT_ON_LIME) {
					if (classValue.includes(forbidden)) {
						violations.push({
							line: i + 1,
							className: classValue,
							violation: `${forbidden} on cyber-lime background`,
						});
					}
				}
			}
		}
	}

	return violations;
}

/**
 * Recursively find all .tsx files in a directory
 */
function findTsxFiles(dir: string): string[] {
	const files: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
			files.push(...findTsxFiles(fullPath));
		} else if (entry.name.endsWith(".tsx")) {
			files.push(fullPath);
		}
	}

	return files;
}

describe("WCAG AA: Color contrast on cyber-lime backgrounds", () => {
	it("should not use text-slate-text or text-mist-white on bg-cyber-lime (opacity >= 10)", () => {
		const tsxFiles = findTsxFiles(SRC_DIR);
		const allViolations: Array<{
			file: string;
			line: number;
			className: string;
			violation: string;
		}> = [];

		for (const file of tsxFiles) {
			const violations = findContrastViolationsInFile(file);
			for (const v of violations) {
				allViolations.push({
					file: path.relative(SRC_DIR, file),
					...v,
				});
			}
		}

		if (allViolations.length > 0) {
			const report = allViolations
				.map((v) => `  ${v.file}:${v.line} -- ${v.violation}\n    class: "${v.className}"`)
				.join("\n");

			expect.fail(
				`Found ${allViolations.length} WCAG AA color contrast violation(s):\n${report}\n\n` +
					`Rule: Text on bg-cyber-lime must use text-void-navy (#0B0E14), not text-slate-text or text-mist-white.`
			);
		}
	});

	it("should use text-void-navy on full bg-cyber-lime backgrounds", () => {
		const tsxFiles = findTsxFiles(SRC_DIR);
		const elementsWithFullBg: Array<{
			file: string;
			line: number;
			className: string;
			hasVoidNavy: boolean;
			hasText: boolean;
		}> = [];

		for (const file of tsxFiles) {
			const content = fs.readFileSync(file, "utf-8");
			const lines = content.split("\n");

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const classMatches = line.matchAll(/className="([^"]+)"/g);

				for (const match of classMatches) {
					const classValue = match[1];
					// Full bg-cyber-lime (no opacity)
					if (/(?:^|\s)bg-cyber-lime(?:\s|"|$)/.test(classValue)) {
						const hasTextIndicator =
							/text-(?!void-navy)/.test(classValue) ||
							/font-/.test(classValue) ||
							/tracking-/.test(classValue);
						const hasVoidNavy = classValue.includes("text-void-navy");

						if (hasTextIndicator && !hasVoidNavy) {
							elementsWithFullBg.push({
								file: path.relative(SRC_DIR, file),
								line: i + 1,
								className: classValue,
								hasVoidNavy,
								hasText: true,
							});
						}
					}
				}
			}
		}

		if (elementsWithFullBg.length > 0) {
			const report = elementsWithFullBg
				.map((v) => `  ${v.file}:${v.line}\n    class: "${v.className}"`)
				.join("\n");

			expect.fail(
				`Found ${elementsWithFullBg.length} element(s) with text on full bg-cyber-lime missing text-void-navy:\n${report}`
			);
		}
	});

	it("should ensure Button cyber variant pairs bg-cyber-lime with text-void-navy", () => {
		const buttonPath = path.join(SRC_DIR, "components/ui/button.tsx");
		const content = fs.readFileSync(buttonPath, "utf-8");

		// The cyber variant must use text-void-navy
		expect(content).toContain("bg-cyber-lime");
		expect(content).toContain('cyber: "bg-cyber-lime text-void-navy');
	});

	it("should ensure cookie consent accept button uses text-void-navy on bg-cyber-lime", () => {
		const cookiePath = path.join(SRC_DIR, "components/ui/cookie-consent.tsx");
		const content = fs.readFileSync(cookiePath, "utf-8");

		// Find the accept button className
		const acceptButtonMatch = content.match(/bg-cyber-lime[^"]*text-void-navy/);
		expect(acceptButtonMatch).not.toBeNull();
	});

	it("should ensure navigation CTA uses text-void-navy on bg-cyber-lime", () => {
		const navPath = path.join(SRC_DIR, "components/ui/navigation.tsx");
		const content = fs.readFileSync(navPath, "utf-8");

		// The "Book a Call" CTA and skip link must use text-void-navy
		const cyberLimeBgLines = content.split("\n").filter((line) => {
			// Full bg-cyber-lime with text content (not decorative dots/bars)
			return (
				/bg-cyber-lime(?:\s|")/.test(line) &&
				(line.includes("font-") || line.includes("tracking-") || line.includes("text-"))
			);
		});

		for (const line of cyberLimeBgLines) {
			// Skip decorative elements (h-px, h-2 w-2, no text classes)
			if (/h-px|h-2 w-2|ml-auto/.test(line) && !line.includes("font-")) continue;

			if (line.includes("font-") || line.includes("tracking-")) {
				expect(line).toContain("text-void-navy");
			}
		}
	});

	it("should ensure globals.css selection uses text-void-navy on bg-cyber-lime", () => {
		const globalsPath = path.join(SRC_DIR, "app/globals.css");
		const content = fs.readFileSync(globalsPath, "utf-8");

		expect(content).toContain("selection:bg-cyber-lime");
		expect(content).toContain("selection:text-void-navy");
	});

	describe("hasCyberLimeBg helper", () => {
		it("detects full bg-cyber-lime", () => {
			expect(hasCyberLimeBg("bg-cyber-lime ")).toBe(true);
			expect(hasCyberLimeBg('bg-cyber-lime"')).toBe(true);
		});

		it("detects high opacity bg-cyber-lime", () => {
			expect(hasCyberLimeBg("bg-cyber-lime/10")).toBe(true);
			expect(hasCyberLimeBg("bg-cyber-lime/20")).toBe(true);
			expect(hasCyberLimeBg("bg-cyber-lime/50")).toBe(true);
			expect(hasCyberLimeBg("bg-cyber-lime/90")).toBe(true);
			expect(hasCyberLimeBg("bg-cyber-lime/100")).toBe(true);
		});

		it("allows low opacity bg-cyber-lime", () => {
			expect(hasCyberLimeBg("bg-cyber-lime/5")).toBe(false);
		});

		it("does not match border-cyber-lime", () => {
			expect(hasCyberLimeBg("border-cyber-lime")).toBe(false);
		});
	});
});
