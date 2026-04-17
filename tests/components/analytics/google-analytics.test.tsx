import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
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

/**
 * GoogleAnalytics component reads NEXT_PUBLIC_GA_MEASUREMENT_ID via the typed
 * `publicEnv` module, which parses `process.env` once at import time. Use
 * vi.resetModules() + dynamic import so each test controls the env state.
 */
async function loadGA(envValue: string | undefined) {
	vi.resetModules();
	if (envValue === undefined) {
		(process.env as Record<string, string | undefined>).NEXT_PUBLIC_GA_MEASUREMENT_ID = undefined;
	} else {
		process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = envValue;
	}
	const mod = await import("@/components/analytics/google-analytics");
	return mod.GoogleAnalytics;
}

describe("GoogleAnalytics", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("renders null when no measurement ID", async () => {
		const GoogleAnalytics = await loadGA(undefined);
		const { container } = render(<GoogleAnalytics />);
		expect(container.innerHTML).toBe("");
	});

	it("renders null in test environment (NODE_ENV !== production)", async () => {
		const GoogleAnalytics = await loadGA("G-TEST");
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
