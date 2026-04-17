import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const trackCTAClickMock = vi.fn();
vi.mock("@/components/analytics", () => ({
	trackCTAClick: (...args: unknown[]) => trackCTAClickMock(...args),
}));

vi.mock("@/components/newsletter/newsletter-signup", () => ({
	NewsletterSignup: ({ variant }: { variant?: string }) => (
		<div data-testid="newsletter-signup" data-variant={variant} />
	),
}));

import { CtaSection } from "@/components/pseo/cta-section";

describe("CtaSection", () => {
	it("renders the title and description", () => {
		render(
			<CtaSection
				title="Ready to migrate?"
				description="Let us help you move off legacy tech."
				ctaLabel="AUDIT_SYSTEM()"
				ctaEventName="audit_system"
				ctaLocation="migration_bottom_cta"
			/>
		);
		expect(screen.getByText("Ready to migrate?")).toBeDefined();
		expect(screen.getByText(/Let us help you move off legacy tech\./)).toBeDefined();
	});

	it("links to /contact with the provided CTA label", () => {
		render(
			<CtaSection
				title="t"
				description="d"
				ctaLabel="SCOPE_INTEGRATION()"
				ctaEventName="scope_integration"
				ctaLocation="integration_bottom_cta"
			/>
		);
		const link = screen.getByRole("link");
		expect(link.getAttribute("href")).toBe("/contact");
		expect(link.textContent).toContain("SCOPE_INTEGRATION()");
	});

	it("fires trackCTAClick with eventName and cta_location on click", () => {
		trackCTAClickMock.mockClear();
		render(
			<CtaSection
				title="t"
				description="d"
				ctaLabel="GO()"
				ctaEventName="schedule_consultation"
				ctaLocation="comparison_bottom_cta"
			/>
		);
		fireEvent.click(screen.getByRole("link"));
		expect(trackCTAClickMock).toHaveBeenCalledWith("schedule_consultation", {
			cta_location: "comparison_bottom_cta",
		});
	});

	it("renders footnote when provided and newsletter signup in minimal variant", () => {
		render(
			<CtaSection
				title="t"
				description="d"
				ctaLabel="L"
				ctaEventName="e"
				ctaLocation="loc"
				footnote="Free 30-minute call"
			/>
		);
		expect(screen.getByText("Free 30-minute call")).toBeDefined();
		const signup = screen.getByTestId("newsletter-signup");
		expect(signup.getAttribute("data-variant")).toBe("minimal");
	});
});
