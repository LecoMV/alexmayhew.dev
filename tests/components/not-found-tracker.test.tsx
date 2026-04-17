import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NotFoundTracker } from "@/app/not-found-client";

vi.mock("@/components/analytics/google-analytics", () => ({
	trackEvent: vi.fn(),
}));

describe("NotFoundTracker", () => {
	it("fires a page_not_found GA4 event on mount", async () => {
		const { trackEvent } = await import("@/components/analytics/google-analytics");
		const spy = trackEvent as ReturnType<typeof vi.fn>;
		render(<NotFoundTracker />);
		expect(spy).toHaveBeenCalledWith(
			"page_not_found",
			expect.objectContaining({ page_path: expect.any(String) })
		);
	});
});
