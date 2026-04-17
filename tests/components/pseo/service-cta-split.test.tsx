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

import { ServiceCtaSplit } from "@/components/pseo/service-cta-split";

describe("ServiceCtaSplit", () => {
	it("renders the title and description", () => {
		render(
			<ServiceCtaSplit
				title="Ready to discuss your project?"
				description="Let us talk about how I can help."
				ctaLabel="Talk through your project"
				ctaEventName="start_conversation"
				ctaLocation="service_bottom_cta"
			/>
		);
		expect(screen.getByText("Ready to discuss your project?")).toBeDefined();
		expect(screen.getByText(/Let us talk about how I can help\./)).toBeDefined();
	});

	it("links to /contact with the provided CTA label", () => {
		render(
			<ServiceCtaSplit
				title="t"
				description="d"
				ctaLabel="Talk through your project"
				ctaEventName="start_conversation"
				ctaLocation="service_bottom_cta"
			/>
		);
		const link = screen.getByRole("link");
		expect(link.getAttribute("href")).toBe("/contact");
		expect(link.textContent).toContain("Talk through your project");
	});

	it("fires trackCTAClick with eventName and cta_location on click", () => {
		trackCTAClickMock.mockClear();
		render(
			<ServiceCtaSplit
				title="t"
				description="d"
				ctaLabel="L"
				ctaEventName="start_conversation"
				ctaLocation="service_bottom_cta"
			/>
		);
		fireEvent.click(screen.getByRole("link"));
		expect(trackCTAClickMock).toHaveBeenCalledWith("start_conversation", {
			cta_location: "service_bottom_cta",
		});
	});

	it("renders the minimal newsletter signup below the split layout", () => {
		render(
			<ServiceCtaSplit title="t" description="d" ctaLabel="L" ctaEventName="e" ctaLocation="loc" />
		);
		const signup = screen.getByTestId("newsletter-signup");
		expect(signup.getAttribute("data-variant")).toBe("minimal");
	});

	it("exposes the CTA title as an <h2> heading (distinct layout from centered CtaSection)", () => {
		render(
			<ServiceCtaSplit
				title="Ready to discuss your project?"
				description="d"
				ctaLabel="L"
				ctaEventName="e"
				ctaLocation="loc"
			/>
		);
		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading.textContent).toBe("Ready to discuss your project?");
	});
});
