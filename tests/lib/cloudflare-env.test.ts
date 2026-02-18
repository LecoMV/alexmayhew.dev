import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the module before importing
const mockGetCloudflareContext = vi.fn();
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: mockGetCloudflareContext,
}));

// Dynamic import to get fresh module per test
async function loadGetEnv() {
	// Reset module registry to get fresh import
	vi.resetModules();
	// Re-apply mock after reset
	vi.doMock("@opennextjs/cloudflare", () => ({
		getCloudflareContext: mockGetCloudflareContext,
	}));
	const mod = await import("@/lib/cloudflare-env");
	return mod.getEnv;
}

describe("cloudflare-env", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		vi.clearAllMocks();
		process.env.RESEND_API_KEY = "env-resend-key";
		process.env.CONTACT_EMAIL = "env@example.com";
		process.env.TURNSTILE_SECRET_KEY = "env-turnstile-key";
		process.env.LISTMONK_API_URL = "http://localhost:9000";
		process.env.LISTMONK_API_USER = "admin";
		process.env.LISTMONK_API_KEY = "env-listmonk-key";
		(process.env as Record<string, string | undefined>).NODE_ENV = "test";
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("should return CF env values when getCloudflareContext succeeds", async () => {
		mockGetCloudflareContext.mockResolvedValue({
			env: {
				RESEND_API_KEY: "cf-resend-key",
				CONTACT_EMAIL: "cf@example.com",
				TURNSTILE_SECRET_KEY: "cf-turnstile-key",
				LISTMONK_API_URL: "https://listmonk.example.com",
				LISTMONK_API_USER: "cf-admin",
				LISTMONK_API_KEY: "cf-listmonk-key",
			},
		});

		const getEnv = await loadGetEnv();
		const env = await getEnv();

		expect(env.RESEND_API_KEY).toBe("cf-resend-key");
		expect(env.CONTACT_EMAIL).toBe("cf@example.com");
		expect(env.TURNSTILE_SECRET_KEY).toBe("cf-turnstile-key");
	});

	it("should fall back to process.env when getCloudflareContext throws", async () => {
		mockGetCloudflareContext.mockRejectedValue(new Error("Not in CF context"));

		const getEnv = await loadGetEnv();
		const env = await getEnv();

		expect(env.RESEND_API_KEY).toBe("env-resend-key");
		expect(env.CONTACT_EMAIL).toBe("env@example.com");
		expect(env.TURNSTILE_SECRET_KEY).toBe("env-turnstile-key");
	});

	it("should return undefined values without crashing when both sources are empty", async () => {
		mockGetCloudflareContext.mockRejectedValue(new Error("Not in CF context"));
		const processEnv = process.env as Record<string, string | undefined>;
		delete processEnv.RESEND_API_KEY;
		delete processEnv.CONTACT_EMAIL;
		delete processEnv.TURNSTILE_SECRET_KEY;
		delete processEnv.LISTMONK_API_URL;
		delete processEnv.LISTMONK_API_USER;
		delete processEnv.LISTMONK_API_KEY;

		const getEnv = await loadGetEnv();
		const env = await getEnv();

		expect(env.RESEND_API_KEY).toBeUndefined();
		expect(env.CONTACT_EMAIL).toBeUndefined();
		expect(env).toBeDefined();
	});

	it("should fill gaps from process.env when CF context provides partial env", async () => {
		mockGetCloudflareContext.mockResolvedValue({
			env: {
				RESEND_API_KEY: "cf-resend-key",
				// Other keys missing from CF
			},
		});

		const getEnv = await loadGetEnv();
		const env = await getEnv();

		expect(env.RESEND_API_KEY).toBe("cf-resend-key");
		expect(env.CONTACT_EMAIL).toBe("env@example.com"); // Fell back to process.env
	});

	it("should always return NODE_ENV from process.env", async () => {
		mockGetCloudflareContext.mockResolvedValue({
			env: { NODE_ENV: "production" },
		});

		const getEnv = await loadGetEnv();
		const env = await getEnv();

		expect(env.NODE_ENV).toBe("test"); // process.env.NODE_ENV, not CF
	});

	it("should handle multiple calls without re-throwing", async () => {
		mockGetCloudflareContext.mockRejectedValue(new Error("Not in CF context"));

		const getEnv = await loadGetEnv();
		const env1 = await getEnv();
		const env2 = await getEnv();

		expect(env1.RESEND_API_KEY).toBe("env-resend-key");
		expect(env2.RESEND_API_KEY).toBe("env-resend-key");
	});
});
