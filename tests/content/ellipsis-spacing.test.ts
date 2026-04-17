import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

/**
 * Content ellipsis (...) must have a space before the next word.
 * Correct:   "guidance... not just code"
 * Incorrect: "guidance...not just code"
 *
 * Spread operators (...args, ...props) are excluded -- they are code, not content.
 */
const CONTENT_FILES_WITH_ELLIPSIS = [
	"src/data/pseo/pages.ts",
	"src/data/pseo/technologies.ts",
	"src/data/pseo/migrations.ts",
	"src/data/pseo/comparisons.ts",
	"src/data/pseo/integrations.ts",
	"src/data/roles/pages.ts",
	"src/data/projects.ts",
	"src/components/pages/about-page.tsx",
	"src/app/home-page.tsx",
	"src/app/technologies/technologies-page-content.tsx",
	"src/app/services/services-page-content.tsx",
];

type StringState = { inTemplate: boolean; inDouble: boolean; inSingle: boolean };

function updateStringState(state: StringState, ch: string): void {
	if (ch === "`" && !state.inDouble && !state.inSingle) {
		state.inTemplate = !state.inTemplate;
	} else if (ch === '"' && !state.inTemplate && !state.inSingle) {
		state.inDouble = !state.inDouble;
	} else if (ch === "'" && !state.inTemplate && !state.inDouble) {
		state.inSingle = !state.inSingle;
	}
}

function isEllipsisFollowedByLetter(line: string, i: number): boolean {
	return (
		line[i] === "." &&
		i + 3 < line.length &&
		line[i + 1] === "." &&
		line[i + 2] === "." &&
		/[a-zA-Z]/.test(line[i + 3])
	);
}

function isInJsxText(line: string, i: number): boolean {
	const before = line.slice(0, i);
	const lastGt = before.lastIndexOf(">");
	const lastLt = before.lastIndexOf("<");
	const lastOpenBrace = before.lastIndexOf("{");
	const lastCloseBrace = before.lastIndexOf("}");
	return (
		lastGt > lastLt && lastGt !== -1 && (lastCloseBrace > lastOpenBrace || lastOpenBrace === -1)
	);
}

/**
 * Find instances of ...[letter] inside string literals or JSX text
 * (content ellipsis without spacing). Uses multi-line state tracking
 * to handle template literals that span multiple lines.
 *
 * Ignores spread operators which appear in code context.
 */
function findUnspacedContentEllipsis(filePath: string): string[] {
	const content = readFileSync(filePath, "utf-8");
	const lines = content.split("\n");
	const violations: string[] = [];
	const state: StringState = { inTemplate: false, inDouble: false, inSingle: false };

	for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
		const line = lines[lineIdx];
		let i = 0;

		while (i < line.length) {
			const ch = line[i];

			if (ch === "\\" && i + 1 < line.length) {
				i += 2;
				continue;
			}

			updateStringState(state, ch);

			if (isEllipsisFollowedByLetter(line, i)) {
				const inString = state.inTemplate || state.inDouble || state.inSingle;
				if (inString || isInJsxText(line, i)) {
					violations.push(
						`Line ${lineIdx + 1}: ...${line[i + 3]} in "${line.trim().slice(0, 120)}"`
					);
				}
				i += 4;
				continue;
			}

			i += 1;
		}
	}

	return violations;
}

describe("content ellipsis has proper spacing", () => {
	it.each(CONTENT_FILES_WITH_ELLIPSIS)(
		"%s has no unspaced content ellipsis (...word should be ... word)",
		(filePath) => {
			const violations = findUnspacedContentEllipsis(filePath);
			expect(
				violations,
				`Unspaced ellipsis violations in ${filePath}:\n${violations.slice(0, 10).join("\n")}${violations.length > 10 ? `\n... and ${violations.length - 10} more` : ""}`
			).toHaveLength(0);
		}
	);
});
