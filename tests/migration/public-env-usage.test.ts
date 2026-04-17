import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * TDD migration gate: ensures all consumers have moved off direct
 * `process.env.NEXT_PUBLIC_*` reads and onto the typed `publicEnv` module
 * (src/lib/env.ts). The one legitimate occurrence lives inside env.ts itself,
 * which parses process.env once at import time -- so we exclude it.
 *
 * WHY: repeated direct reads scattered across the codebase bypass the Zod
 * narrowing and make it impossible to reason about default values from a
 * single location.
 */

const SRC_ROOT = resolve(__dirname, "..", "..", "src");
const ALLOWLIST = new Set([resolve(SRC_ROOT, "lib", "env.ts")]);
const PATTERN = /process\.env\.NEXT_PUBLIC_/;

function walk(dir: string): string[] {
	const entries = readdirSync(dir);
	const files: string[] = [];
	for (const entry of entries) {
		const abs = join(dir, entry);
		const stat = statSync(abs);
		if (stat.isDirectory()) {
			files.push(...walk(abs));
		} else if (stat.isFile() && (abs.endsWith(".ts") || abs.endsWith(".tsx"))) {
			files.push(abs);
		}
	}
	return files;
}

describe("public env migration gate", () => {
	it("no src/ file (outside src/lib/env.ts) references process.env.NEXT_PUBLIC_*", () => {
		const files = walk(SRC_ROOT).filter((f) => !ALLOWLIST.has(f));
		const offenders: string[] = [];

		for (const file of files) {
			const contents = readFileSync(file, "utf8");
			if (PATTERN.test(contents)) {
				const lines = contents.split("\n");
				lines.forEach((line, idx) => {
					if (PATTERN.test(line)) {
						offenders.push(`${relative(SRC_ROOT, file)}:${idx + 1}: ${line.trim()}`);
					}
				});
			}
		}

		expect(
			offenders,
			`Found direct process.env.NEXT_PUBLIC_* reads outside src/lib/env.ts:\n${offenders.join("\n")}\nMigrate these to import { publicEnv } from "@/lib/env".`
		).toEqual([]);
	});
});
