import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Streaming / error-boundary coverage per audit-2026-04-17 (K7.4 & K7.5).
 * App Router streams a `loading.tsx` while an async Server Component
 * resolves, and catches render errors with `error.tsx`. We enforce both
 * at the high-traffic segment roots so failures don't bubble to the
 * app-level boundaries.
 */
const SEGMENTS = ["blog", "services", "technologies", "for", "work"] as const;

describe("route segments have streaming + error boundaries", () => {
	it.each(SEGMENTS)("segment '%s' ships a loading.tsx", (segment) => {
		const path = join(process.cwd(), "src/app", segment, "loading.tsx");
		expect(existsSync(path)).toBe(true);
	});

	it.each(SEGMENTS)("segment '%s' ships an error.tsx", (segment) => {
		const path = join(process.cwd(), "src/app", segment, "error.tsx");
		expect(existsSync(path)).toBe(true);
	});
});
