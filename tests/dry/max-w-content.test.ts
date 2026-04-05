import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

describe("max-w-content design token", () => {
	it("globals.css defines --max-content-width in the @theme block", () => {
		const cssPath = path.resolve(__dirname, "../../src/app/globals.css");
		const content = fs.readFileSync(cssPath, "utf-8");
		expect(content).toMatch(/--max-width-content:\s*1400px/);
	});

	it("no TSX/TS source files use the arbitrary max-w-[1400px] class", () => {
		const srcDir = path.resolve(__dirname, "../../src");
		const violations: string[] = [];

		function walk(dir: string) {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const full = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					walk(full);
				} else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith(".css")) {
					const content = fs.readFileSync(full, "utf-8");
					if (content.includes("max-w-[1400px]")) {
						violations.push(path.relative(srcDir, full));
					}
				}
			}
		}

		walk(srcDir);
		expect(violations).toEqual([]);
	});
});
