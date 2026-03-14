import { afterEach, describe, expect, it, vi } from "vitest";

describe("showAdminUI", () => {
	const originalEnv = process.env.NODE_ENV;

	afterEach(() => {
		process.env.NODE_ENV = originalEnv;
		vi.resetModules();
	});

	it("should be true in development", async () => {
		process.env.NODE_ENV = "development";
		const { showAdminUI } = await import("../keystatic.config");
		expect(showAdminUI).toBe(true);
	});

	it("should be false in production", async () => {
		process.env.NODE_ENV = "production";
		const { showAdminUI } = await import("../keystatic.config");
		expect(showAdminUI).toBe(false);
	});
});
