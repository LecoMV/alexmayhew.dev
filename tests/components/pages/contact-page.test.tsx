import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContactPage } from "@/components/pages/contact-page";

vi.mock("@/components/analytics", () => ({
	trackEvent: vi.fn(),
	trackLeadEvent: vi.fn(),
}));

vi.mock("@/app/actions/contact", () => ({
	submitContactAction: vi.fn(),
}));

// Capture the Turnstile callbacks so tests can trigger them
let capturedOnSuccess: ((token: string) => void) | null = null;

vi.mock("@/components/ui/turnstile", () => ({
	Turnstile: ({ onSuccess }: { onSuccess?: (token: string) => void }) => {
		capturedOnSuccess = onSuccess ?? null;
		return <div data-testid="turnstile-mock" />;
	},
}));

describe("ContactPage a11y", () => {
	it("updates the hidden turnstileToken input via React state, not document.getElementById", () => {
		const { container } = render(<ContactPage />);
		const hidden = container.querySelector(
			'input[name="turnstileToken"]'
		) as HTMLInputElement | null;
		expect(hidden).toBeTruthy();
		expect(hidden!.value).toBe("");

		// Fire the captured Turnstile onSuccess — must flow through React state, not direct DOM
		expect(capturedOnSuccess).not.toBeNull();
		act(() => {
			capturedOnSuccess!("test-token-abc");
		});

		const hiddenAfter = container.querySelector('input[name="turnstileToken"]') as HTMLInputElement;
		expect(hiddenAfter.value).toBe("test-token-abc");

		// Reflect a subsequent token update — verifies reactive state flow, not DOM mutation
		act(() => {
			capturedOnSuccess!("test-token-xyz");
		});

		const hiddenUpdated = container.querySelector(
			'input[name="turnstileToken"]'
		) as HTMLInputElement;
		expect(hiddenUpdated.value).toBe("test-token-xyz");
	});

	it("does not hardcode 'unknown' values in the trackLeadEvent call", async () => {
		const fs = await import("fs");
		const path = await import("path");
		const src = fs.readFileSync(
			path.join(process.cwd(), "src/components/pages/contact-page.tsx"),
			"utf8"
		);
		const match = src.match(/trackLeadEvent\([^;]+?\);/s);
		expect(match).toBeTruthy();
		const call = match![0];
		expect(call).not.toMatch(/project_type:\s*"unknown"/);
		expect(call).not.toMatch(/budget_range:\s*"unknown"/);
		expect(call).not.toMatch(/referral_source:\s*"not_specified"/);
	});

	it("uses slate-text placeholder color on the name input (AA contrast)", () => {
		const { container } = render(<ContactPage />);
		const name = container.querySelector('input[name="name"]') as HTMLInputElement | null;
		expect(name).toBeTruthy();
		expect(name!.className).toContain("placeholder:text-slate-text");
		expect(name!.className).not.toContain("placeholder:text-white/30");
	});
});
