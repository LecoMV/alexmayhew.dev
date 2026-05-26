import { describe, expect, it, vi } from "vitest";

import { submitStageFitLead } from "@/app/actions/stagefit-lead";

vi.mock("next/headers", () => ({
	headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn().mockResolvedValue({
		env: { RATE_LIMIT_KV: null },
	}),
}));

vi.mock("@/lib/cloudflare-env", () => ({
	getEnv: vi.fn().mockResolvedValue({
		KIT_API_KEY: "kit-test-key",
	}),
}));

const { mockFetch } = vi.hoisted(() => ({
	mockFetch: vi.fn().mockResolvedValue({
		ok: true,
		json: () => Promise.resolve({}),
	}),
}));

vi.mock("@/lib/_newsletter-deps", () => ({
	dependencies: { fetch: mockFetch, verifyTurnstile: vi.fn().mockResolvedValue(true) },
	__setDependencies: vi.fn(),
	__resetDependencies: vi.fn(),
}));

describe("submitStageFitLead", () => {
	it("recomputes result server-side and subscribes with customFields", async () => {
		const result = await submitStageFitLead({
			email: "test@example.com",
			answers: {
				persona: "cto",
				customerType: "b2b-smb",
				revenueStage: 0,
				triggerEvent: "none",
				compliance: ["none"],
				teamSize: 1,
				techAnswers: {
					architecture: 4,
					database: 4,
					cicd: 4,
					observability: 4,
					security: 4,
					team: 4,
					performance: 4,
					data: 4,
				},
			},
		});

		expect(result.success).toBe(true);
		expect(mockFetch).toHaveBeenCalled();
		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
		const body = JSON.parse(options.body as string) as Record<string, unknown>;
		const fields = body.fields as Record<string, string>;
		expect(fields.stagefit_zone).toBe("over-built");
	});
});
