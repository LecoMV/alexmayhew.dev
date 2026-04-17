import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadEnvModule() {
	vi.resetModules();
	return import("@/lib/env");
}

describe("env module — publicEnv", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("applies defaults when NEXT_PUBLIC_GIT_SHA and NEXT_PUBLIC_SITE_VERSION are missing", async () => {
		const processEnv = process.env as Record<string, string | undefined>;
		delete processEnv.NEXT_PUBLIC_GIT_SHA;
		delete processEnv.NEXT_PUBLIC_SITE_VERSION;

		const { publicEnv } = await loadEnvModule();

		expect(publicEnv.NEXT_PUBLIC_GIT_SHA).toBe("development");
		expect(publicEnv.NEXT_PUBLIC_SITE_VERSION).toBe("0.0.0");
	});

	it("reads provided NEXT_PUBLIC_* values from process.env", async () => {
		process.env.NEXT_PUBLIC_GIT_SHA = "abc1234";
		process.env.NEXT_PUBLIC_SITE_VERSION = "1.2.3";
		process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-K4TLSRKMCV";
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "0x4AAA";

		const { publicEnv } = await loadEnvModule();

		expect(publicEnv.NEXT_PUBLIC_GIT_SHA).toBe("abc1234");
		expect(publicEnv.NEXT_PUBLIC_SITE_VERSION).toBe("1.2.3");
		expect(publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID).toBe("G-K4TLSRKMCV");
		expect(publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY).toBe("0x4AAA");
	});

	it("exposes isDevelopment / isProduction / isTest derived flags", async () => {
		(process.env as Record<string, string | undefined>).NODE_ENV = "production";

		const { isProduction, isDevelopment, isTest } = await loadEnvModule();

		expect(isProduction).toBe(true);
		expect(isDevelopment).toBe(false);
		expect(isTest).toBe(false);
	});
});

describe("env module — parsePublicEnv (schema)", () => {
	it("throws on invalid NODE_ENV value", async () => {
		const { parsePublicEnv } = await loadEnvModule();

		expect(() => parsePublicEnv({ NODE_ENV: "staging" })).toThrow();
	});
});
