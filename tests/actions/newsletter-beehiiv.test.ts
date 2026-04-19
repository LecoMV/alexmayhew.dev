import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { __resetDependencies, __setDependencies } from "@/lib/_newsletter-deps";
import { getEnv } from "@/lib/cloudflare-env";

vi.mock("next/headers", () => ({
	headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("@/lib/cloudflare-env", () => ({
	getEnv: vi.fn().mockResolvedValue({
		BEEHIIV_API_KEY: "beehiiv-test-key",
		BEEHIIV_PUBLICATION_ID: "pub_test",
	}),
}));

vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn().mockResolvedValue({
		env: {
			RATE_LIMITER_NEWSLETTER: { limit: vi.fn().mockResolvedValue({ success: true }) },
		},
	}),
}));

const mockGetEnv = vi.mocked(getEnv);

describe("Beehiiv subscribe migration", () => {
	const mockFetch = vi.fn();

	beforeEach(async () => {
		vi.clearAllMocks();
		mockGetEnv.mockResolvedValue({
			BEEHIIV_API_KEY: "beehiiv-test-key",
			BEEHIIV_PUBLICATION_ID: "pub_test",
		} as never);
		mockFetch.mockResolvedValue({
			ok: true,
			status: 201,
			json: () => Promise.resolve({ data: { id: "sub_123", email: "u@example.com" } }),
		});
		await __setDependencies({ fetch: mockFetch });
	});

	afterEach(async () => {
		await __resetDependencies();
	});

	it("POSTs to Beehiiv subscriptions endpoint with Bearer auth and publication ID in the URL", async () => {
		await subscribeToNewsletter({ email: "u@example.com", source: "homepage" });

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.beehiiv.com/v2/publications/pub_test/subscriptions",
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({
					Authorization: "Bearer beehiiv-test-key",
					"Content-Type": "application/json",
				}),
			})
		);
	});
});
