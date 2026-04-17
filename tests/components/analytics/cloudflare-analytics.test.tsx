import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/script", () => ({
	default: (props: Record<string, unknown>) => <script data-testid="cf-script" {...props} />,
}));

/**
 * CloudflareAnalytics reads beacon token from the typed `publicEnv` module,
 * which parses `process.env` once at import time. Tests use vi.resetModules()
 * + dynamic import so the env module re-parses with the desired value.
 */
async function loadComponent(envValue: string | undefined) {
	vi.resetModules();
	if (envValue === undefined) {
		(process.env as Record<string, string | undefined>).NEXT_PUBLIC_CF_BEACON_TOKEN = undefined;
	} else {
		process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = envValue;
	}
	const { CloudflareAnalytics } = await import("@/components/analytics/cloudflare-analytics");
	return CloudflareAnalytics;
}

describe("CloudflareAnalytics", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("renders null when no beacon token", async () => {
		const CloudflareAnalytics = await loadComponent(undefined);
		const { container } = render(<CloudflareAnalytics />);
		expect(container.innerHTML).toBe("");
	});

	it("renders script when beacon token is set", async () => {
		const CloudflareAnalytics = await loadComponent("test-token-123");
		const { container } = render(<CloudflareAnalytics />);
		const script = container.querySelector("[data-testid='cf-script']");
		expect(script).toBeTruthy();
	});
});
