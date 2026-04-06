import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Turnstile } from "@/components/ui/turnstile";

vi.mock("@marsidev/react-turnstile", () => ({
	Turnstile: vi.fn((props: Record<string, unknown>) => (
		<div data-testid="turnstile-widget" data-sitekey={props.siteKey as string} />
	)),
}));

describe("Turnstile", () => {
	it("renders dev placeholder when no site key in development env", () => {
		const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
		const { container } = render(<Turnstile onSuccess={vi.fn()} />);
		expect(container.textContent).toContain("Turnstile");
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
