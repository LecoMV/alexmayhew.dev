import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * TDD gate: page-content files for /tools should be a Server Component
 * (no top-level "use client"). Client interactivity lives in a sibling
 * *-page-client.tsx island.
 *
 * Why: shipping static JSX as JS balloons First Load bundles on routes
 * that are otherwise mostly static marketing content.
 *
 * TODO(perf): extend to about-page.tsx and work-page.tsx. Deferred because:
 *  - about-page uses many heterogeneous motion variants (whileInView + delays)
 *    per section, making the Server/Client split a larger refactor.
 *  - work-page uses useState for a category filter and AnimatePresence layout
 *    across the grid — most of the page is legitimately interactive, so the
 *    bundle-size win is smaller than the refactor risk.
 */
const SERVER_ONLY_FILES = ["src/components/pages/tools-page.tsx"];

function readFile(relPath: string): string {
	return readFileSync(resolve(process.cwd(), relPath), "utf8");
}

describe("Server/Client component split for tools page", () => {
	it.each(SERVER_ONLY_FILES)(
		"%s must NOT be marked 'use client' (should be a Server Component)",
		(relPath) => {
			const source = readFile(relPath);
			const firstNonBlank = source
				.split("\n")
				.map((l) => l.trim())
				.find((l) => l.length > 0 && !l.startsWith("//") && !l.startsWith("/*"));
			expect(firstNonBlank).toBeDefined();
			expect(firstNonBlank).not.toMatch(/^["']use client["']/);
		}
	);
});
