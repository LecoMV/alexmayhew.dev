import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { subscribeNewsletterAction, subscribeToNewsletter } from "@/app/actions/newsletter";
import { __resetDependencies, __setDependencies } from "@/lib/_newsletter-deps";
import { getEnv } from "@/lib/cloudflare-env";

const TEST_EMAIL = "user@example.com";
const FORM_EMAIL = "form@example.com";

vi.mock("next/headers", () => ({
	headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("@/lib/cloudflare-env", () => ({
	getEnv: vi.fn().mockResolvedValue({
		KIT_API_KEY: "kit-test-key",
	}),
}));

const { mockRateLimitFn } = vi.hoisted(() => ({
	mockRateLimitFn: vi.fn().mockResolvedValue({ success: true }),
}));
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn().mockResolvedValue({
		env: {
			RATE_LIMITER_NEWSLETTER: {
				limit: mockRateLimitFn,
			},
		},
	}),
}));

const mockGetEnv = vi.mocked(getEnv);

describe("subscribeToNewsletter", () => {
	const mockFetch = vi.fn();

	beforeEach(async () => {
		vi.clearAllMocks();
		mockRateLimitFn.mockResolvedValue({ success: true });
		mockFetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					subscriber: { id: 1, created_at: "2026-01-01", updated_at: "2026-01-01" },
				}),
		});

		await __setDependencies({
			fetch: mockFetch,
		});
	});

	afterEach(async () => {
		await __resetDependencies();
	});

	describe("newsletterSchema validation", () => {
		it("should succeed with a valid email", async () => {
			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(true);
		});

		it("should fail with an invalid email", async () => {
			const result = await subscribeToNewsletter({ email: "not-an-email", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Please enter a valid email address");
		});

		it("should fail with an empty email", async () => {
			const result = await subscribeToNewsletter({ email: "", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});
	});

	describe("subscribeNewsletterAction (FormData wrapper)", () => {
		it("should extract email from FormData and call through correctly", async () => {
			const formData = new FormData();
			formData.set("email", FORM_EMAIL);

			const result = await subscribeNewsletterAction({ success: false }, formData);
			expect(result.success).toBe(true);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: expect.stringContaining(FORM_EMAIL),
				})
			);
		});

		it("should pass source from FormData", async () => {
			const formData = new FormData();
			formData.set("email", FORM_EMAIL);
			formData.set("source", "blog-sidebar");

			const result = await subscribeNewsletterAction({ success: false }, formData);
			expect(result.success).toBe(true);
		});
	});

	describe("Rate limiting", () => {
		it("should block when RATE_LIMIT_KV reports over limit", async () => {
			const { getCloudflareContext } = await import("@opennextjs/cloudflare");
			(
				getCloudflareContext as unknown as { mockResolvedValueOnce: (v: unknown) => void }
			).mockResolvedValueOnce({
				env: {
					RATE_LIMIT_KV: {
						get: vi.fn().mockResolvedValue("999"),
						put: vi.fn().mockResolvedValue(undefined),
					},
				},
			});
			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toContain("Too many attempts");
		});
	});

	describe("Missing Kit credentials", () => {
		it("should return unavailable message when API key is not configured", async () => {
			mockGetEnv.mockResolvedValueOnce({ KIT_API_KEY: undefined });

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Newsletter signup is temporarily unavailable.");
		});
	});

	describe("Kit API responses", () => {
		it("should return success on 200 response", async () => {
			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(true);
		});

		it("should return email validation error on 422 with email in message", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 422,
				json: () => Promise.resolve({ errors: ["Email address is invalid"] }),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Please enter a valid email address.");
		});

		it("should return generic 400 error for other bad request messages", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "Bad request" }),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Unable to subscribe. Please try again.");
		});

		it("should return failure message on 500 response", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				json: () => Promise.resolve({ message: "Internal server error" }),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Failed to subscribe. Please try again.");
		});

		it("should handle response.json() throwing", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.reject(new Error("Invalid JSON")),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Unable to subscribe. Please try again.");
		});
	});

	describe("customFields pass-through", () => {
		it("rejects unknown customField keys", async () => {
			const result = await subscribeToNewsletter({
				email: TEST_EMAIL,
				source: "website",
				customFields: { malicious_field: "attack" },
			});
			expect(result.success).toBe(false);
		});

		it("passes customFields to Kit as fields object", async () => {
			const result = await subscribeToNewsletter({
				email: TEST_EMAIL,
				source: "stage-fit-quiz-v2",
				customFields: { stagefit_zone: "over-built", stagefit_severity: "acute" },
			});
			expect(result.success).toBe(true);
			const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
			const body = JSON.parse(options.body as string) as Record<string, unknown>;
			expect(body.fields).toEqual({
				stagefit_zone: "over-built",
				stagefit_severity: "acute",
			});
		});
	});

	describe("Request payload structure", () => {
		it("should send correct Kit payload", async () => {
			await subscribeToNewsletter({ email: "payload@example.com", source: "footer" });

			expect(mockFetch).toHaveBeenCalledTimes(1);
			const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
			expect(url).toBe("https://api.kit.com/v4/subscribers");
			expect(options.method).toBe("POST");
			expect((options.headers as Record<string, string>)["X-Kit-Api-Key"]).toBe("kit-test-key");

			const body = JSON.parse(options.body as string) as Record<string, unknown>;
			expect(body.email_address).toBe("payload@example.com");
			expect(body.tag_names).toContain("architect-brief");
			expect(body.tag_names).toContain("source-footer");
		});

		it("should include AbortSignal with 8-second timeout", async () => {
			await subscribeToNewsletter({ email: "timeout@example.com", source: "website" });

			const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
			expect(options.signal).toBeDefined();
		});
	});

	describe("Network/timeout errors", () => {
		it("should return unexpected error when fetch throws", async () => {
			mockFetch.mockRejectedValue(new Error("Network timeout"));

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("An unexpected error occurred.");
		});
	});

	describe("Default fetch", () => {
		it("should use globalThis.fetch when dependency not injected", async () => {
			const originalFetch = globalThis.fetch;
			const mockGlobalFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						subscriber: { id: 1, created_at: "2026-01-01", updated_at: "2026-01-01" },
					}),
			});
			globalThis.fetch = mockGlobalFetch;

			await __resetDependencies();

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(true);
			expect(mockGlobalFetch).toHaveBeenCalledWith(
				"https://api.kit.com/v4/subscribers",
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						"X-Kit-Api-Key": "kit-test-key",
					}),
				})
			);

			globalThis.fetch = originalFetch;
		});
	});
});
