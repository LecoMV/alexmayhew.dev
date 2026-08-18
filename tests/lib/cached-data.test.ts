import { describe, expect, it } from "vitest";

import { getWorkBySlug } from "@/lib/cached-data";

/**
 * React.cache() wraps a function and returns a new function. We can't assert
 * "is cached" from userland (cache() returns an ordinary function), so we
 * smoke-test that the fetcher returns the same reference for the same slug.
 *
 * Only getWorkBySlug survives the 2026-08 reposition: the pSEO and /for-role
 * fetchers were removed with the programmatic pages and the role funnel.
 */
describe("cached-data fetchers", () => {
	describe("getWorkBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getWorkBySlug("nonexistent-work-xyz");
			const second = getWorkBySlug("nonexistent-work-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});

		it("is a function", () => {
			expect(typeof getWorkBySlug).toBe("function");
		});
	});
});
