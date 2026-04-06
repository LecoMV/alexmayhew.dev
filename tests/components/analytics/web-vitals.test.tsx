import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/web-vitals", () => ({
	reportWebVitals: vi.fn(),
}));

import { WebVitalsReporter } from "@/components/analytics/web-vitals";

describe("WebVitalsReporter", () => {
	it("renders null (no visible output)", () => {
		const { container } = render(<WebVitalsReporter />);
		expect(container.innerHTML).toBe("");
	});

	it("calls reportWebVitals on mount", async () => {
		const { reportWebVitals } = await import("@/lib/web-vitals");
		render(<WebVitalsReporter />);
		expect(reportWebVitals).toHaveBeenCalled();
	});
});
