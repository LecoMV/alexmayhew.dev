import { describe, expect, it } from "vitest";

import {
	getComparisonBySlug,
	getIntegrationBySlug,
	getMigrationBySlug,
	getPseoPageBySlug,
	getRoleBySlug,
	getTechnologyBySlug,
	getWorkBySlug,
} from "@/lib/cached-data";

/**
 * React.cache() wraps a function and returns a new function. The wrapped
 * function must still be callable and return consistent results for the
 * same input within a single render. We cannot directly assert "is cached"
 * from userland (cache() returns an ordinary function), so we smoke-test
 * that each fetcher returns the same reference for the same slug.
 */

describe("cached-data fetchers", () => {
	describe("getPseoPageBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getPseoPageBySlug("nonexistent-test-slug-xyz");
			const second = getPseoPageBySlug("nonexistent-test-slug-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});

		it("is a function", () => {
			expect(typeof getPseoPageBySlug).toBe("function");
		});
	});

	describe("getComparisonBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getComparisonBySlug("nonexistent-comparison-xyz");
			const second = getComparisonBySlug("nonexistent-comparison-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});
	});

	describe("getIntegrationBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getIntegrationBySlug("nonexistent-integration-xyz");
			const second = getIntegrationBySlug("nonexistent-integration-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});
	});

	describe("getMigrationBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getMigrationBySlug("nonexistent-migration-xyz");
			const second = getMigrationBySlug("nonexistent-migration-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});
	});

	describe("getTechnologyBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getTechnologyBySlug("nonexistent-tech-xyz");
			const second = getTechnologyBySlug("nonexistent-tech-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});
	});

	describe("getRoleBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getRoleBySlug("nonexistent-role-xyz");
			const second = getRoleBySlug("nonexistent-role-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});
	});

	describe("getWorkBySlug", () => {
		it("returns the same reference across calls with the same slug", () => {
			const first = getWorkBySlug("nonexistent-work-xyz");
			const second = getWorkBySlug("nonexistent-work-xyz");
			expect(first).toBe(second);
			expect(first).toBeNull();
		});
	});
});
