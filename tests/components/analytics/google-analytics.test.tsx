import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	GoogleAnalytics,
	trackContentEvent,
	trackCTAClick,
	trackEvent,
	trackLeadEvent,
	trackNewsletterEvent,
	trackServiceEvent,
} from "@/components/analytics/google-analytics";

vi.mock("next/script", () => ({
	default: (props: Record<string, unknown>) => <script data-testid="mock-script" {...props} />,
}));

describe("GoogleAnalytics", () => {
	it("renders null when no measurement ID", () => {
		const original = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
		process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
		const { container } = render(<GoogleAnalytics />);
		expect(container.innerHTML).toBe("");
		if (original) process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = original;
	});

	it("renders null in test environment (NODE_ENV !== production)", () => {
		const { container } = render(<GoogleAnalytics />);
		expect(container.innerHTML).toBe("");
	});
});

describe("GA4 tracking functions", () => {
	it("trackLeadEvent calls gtag when available", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackLeadEvent("generate_lead", { lead_source: "test" });
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"generate_lead",
			expect.objectContaining({
				event_category: "lead_generation",
				lead_source: "test",
			})
		);
	});

	it("trackLeadEvent does nothing without gtag", () => {
		Object.defineProperty(window, "gtag", { value: undefined, writable: true, configurable: true });
		expect(() => trackLeadEvent("generate_lead")).not.toThrow();
	});

	it("trackContentEvent calls gtag", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackContentEvent("page_view", { content_type: "blog" });
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				event_category: "content_engagement",
				content_type: "blog",
			})
		);
	});

	it("trackServiceEvent calls gtag", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackServiceEvent("view_item", { item_id: "svc-1" });
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"view_item",
			expect.objectContaining({
				event_category: "service_engagement",
				item_id: "svc-1",
			})
		);
	});

	it("trackNewsletterEvent calls gtag", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackNewsletterEvent("sign_up", { method: "form" });
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"sign_up",
			expect.objectContaining({
				event_category: "newsletter",
				method: "form",
			})
		);
	});

	it("trackEvent calls gtag with custom params", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackEvent("custom_event", { key: "value" });
		expect(mockGtag).toHaveBeenCalledWith("event", "custom_event", { key: "value" });
	});

	it("trackEvent does nothing without gtag", () => {
		Object.defineProperty(window, "gtag", { value: undefined, writable: true, configurable: true });
		expect(() => trackEvent("test")).not.toThrow();
	});

	it("trackCTAClick calls gtag with conversion category", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackCTAClick("Book a Call", { cta_location: "hero" });
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"cta_click",
			expect.objectContaining({
				event_category: "conversion",
				cta_name: "Book a Call",
				cta_location: "hero",
			})
		);
	});

	it("trackCTAClick defaults page_path to window.location.pathname", () => {
		const mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", { value: mockGtag, writable: true, configurable: true });
		trackCTAClick("Contact");
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"cta_click",
			expect.objectContaining({
				page_path: window.location.pathname,
			})
		);
	});
});
