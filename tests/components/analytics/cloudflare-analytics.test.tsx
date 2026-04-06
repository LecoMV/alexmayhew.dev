import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CloudflareAnalytics } from "@/components/analytics/cloudflare-analytics";

vi.mock("next/script", () => ({
	default: (props: Record<string, unknown>) => <script data-testid="cf-script" {...props} />,
}));

describe("CloudflareAnalytics", () => {
	it("renders null when no beacon token", () => {
		const original = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
		process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = "";
		const { container } = render(<CloudflareAnalytics />);
		expect(container.innerHTML).toBe("");
		if (original) process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = original;
	});

	it("renders script when beacon token is set", () => {
		const original = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
		process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = "test-token-123";
		const { container } = render(<CloudflareAnalytics />);
		const script = container.querySelector("[data-testid='cf-script']");
		expect(script).toBeTruthy();
		if (original) {
			process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = original;
		} else {
			process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = "";
		}
	});
});
