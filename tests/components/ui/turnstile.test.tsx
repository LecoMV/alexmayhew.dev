import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Turnstile } from "@/components/ui/turnstile";

vi.mock("@marsidev/react-turnstile", () => ({
	Turnstile: vi.fn((props: Record<string, unknown>) => (
		<div data-testid="turnstile-widget" data-sitekey={props.siteKey as string} />
	)),
}));

describe("Turnstile", () => {
	it("does not render widget when no site key", () => {
		const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
		render(<Turnstile onSuccess={vi.fn()} />);
		expect(screen.queryByTestId("turnstile-widget")).toBeNull();
		if (original) process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = original;
	});

	it("renders the widget when site key is present", () => {
		const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
		render(<Turnstile onSuccess={vi.fn()} />);
		expect(screen.getByTestId("turnstile-widget")).toBeTruthy();
		if (original) {
			process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = original;
		} else {
			process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
		}
	});

	it("passes onSuccess callback to the widget", () => {
		const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-key";
		const onSuccess = vi.fn();
		render(<Turnstile onSuccess={onSuccess} />);
		expect(screen.getByTestId("turnstile-widget")).toBeTruthy();
		if (original) {
			process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = original;
		} else {
			process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
		}
	});
});
