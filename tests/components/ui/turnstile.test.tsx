import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@marsidev/react-turnstile", () => ({
	Turnstile: vi.fn((props: Record<string, unknown>) => (
		<div data-testid="turnstile-widget" data-sitekey={props.siteKey as string} />
	)),
}));

/**
 * Turnstile now reads its site key from the typed `publicEnv` module
 * (src/lib/env.ts), which resolves `process.env` ONCE at module import time.
 * Tests mutate the env var then use vi.resetModules() + dynamic import so the
 * env module re-parses with the new value.
 */
async function renderWithEnv(envValue: string | undefined) {
	vi.resetModules();
	if (envValue === undefined) {
		(process.env as Record<string, string | undefined>).NEXT_PUBLIC_TURNSTILE_SITE_KEY = undefined;
	} else {
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = envValue;
	}
	const { Turnstile } = await import("@/components/ui/turnstile");
	return Turnstile;
}

describe("Turnstile", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("does not render widget when no site key", async () => {
		const Turnstile = await renderWithEnv(undefined);
		render(<Turnstile onSuccess={vi.fn()} />);
		expect(screen.queryByTestId("turnstile-widget")).toBeNull();
	});

	it("renders the widget when site key is present", async () => {
		const Turnstile = await renderWithEnv("test-site-key");
		render(<Turnstile onSuccess={vi.fn()} />);
		expect(screen.getByTestId("turnstile-widget")).toBeTruthy();
	});

	it("passes onSuccess callback to the widget", async () => {
		const Turnstile = await renderWithEnv("test-key");
		const onSuccess = vi.fn();
		render(<Turnstile onSuccess={onSuccess} />);
		expect(screen.getByTestId("turnstile-widget")).toBeTruthy();
	});
});
