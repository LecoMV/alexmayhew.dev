import { describe, expect, it, vi } from "vitest";

describe("showAdminUI", () => {
	it("should be true in development", async () => {
		vi.stubEnv("NODE_ENV", "development");
		vi.resetModules();
		const { showAdminUI } = await import("../keystatic.config");
		expect(showAdminUI).toBe(true);
		vi.unstubAllEnvs();
	});

	it("should be false in production", async () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.resetModules();
		const { showAdminUI } = await import("../keystatic.config");
		expect(showAdminUI).toBe(false);
		vi.unstubAllEnvs();
	});
});
