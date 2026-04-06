import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

/**
 * DRY enforcement: all corner bracket PAIRS must use
 * <CornerBrackets /> from @/components/ui/corner-brackets
 * instead of inline div pairs. Single brackets are allowed.
 */
describe("CornerBrackets DRY enforcement", () => {
	it("no source files contain inline border-cyber-lime corner bracket div pairs", () => {
		const srcDir = path.join(process.cwd(), "src");
		const topRightPattern =
			/className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r/;
		const bottomLeftPattern =
			/className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l/;
		const violations: string[] = [];

		function scanDir(dir: string) {
			for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					scanDir(fullPath);
				} else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
					if (entry.name === "corner-brackets.tsx") continue;
					const content = fs.readFileSync(fullPath, "utf-8");
					// Only flag if BOTH top-right AND bottom-left patterns exist (a pair)
					if (topRightPattern.test(content) && bottomLeftPattern.test(content)) {
						violations.push(path.relative(srcDir, fullPath));
					}
				}
			}
		}

		scanDir(srcDir);
		expect(violations).toEqual([]);
	});
});
