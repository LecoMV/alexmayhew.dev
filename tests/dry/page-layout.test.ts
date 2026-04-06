import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

import { describe, expect, it } from "vitest";

const INLINE_PATTERN = "flex-1 px-6 pt-44 pb-24 sm:px-12 md:px-24";

function findTsxFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			files.push(...findTsxFiles(full));
		} else if (full.endsWith(".tsx") || full.endsWith(".ts")) {
			files.push(full);
		}
	}
	return files;
}

describe("page-layout utility class", () => {
	it("globals.css should define page-layout utility class", () => {
		const content = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf-8");
		expect(content).toContain("page-layout");
	});

	it("no source files should contain the inline page layout pattern", () => {
		const srcDir = join(process.cwd(), "src");
		const files = findTsxFiles(srcDir);
		const violators: string[] = [];
		for (const file of files) {
			const content = readFileSync(file, "utf-8");
			if (content.includes(INLINE_PATTERN)) {
				violators.push(file.replace(process.cwd() + "/", ""));
			}
		}
		expect(violators).toEqual([]);
	});
});
