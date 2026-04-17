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
		LISTMONK_API_URL: "http://localhost:9000",
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
			json: () => Promise.resolve({}),
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

		it("should default source to 'website' when not provided", async () => {
			await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: expect.stringContaining(`"email":"${TEST_EMAIL}"`),
				})
			);
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

		it("should default source to 'website' when missing from FormData", async () => {
			const formData = new FormData();
			formData.set("email", FORM_EMAIL);

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

	describe("Missing LISTMONK_API_URL", () => {
		it("should return unavailable message when API URL is not configured", async () => {
			mockGetEnv.mockResolvedValueOnce({
				LISTMONK_API_URL: undefined,
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Newsletter signup is temporarily unavailable.");
		});
	});

	describe("Listmonk API responses", () => {
		it("should return success on 200 response", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({}),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(true);
		});

		it("should return email validation error on 400 with 'email' in message", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "Invalid email address provided" }),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Please enter a valid email address.");
		});

		it("should return email validation error on 400 with 'valid' in message", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "Not a valid format" }),
			});

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Please enter a valid email address.");
		});

		it("should return generic 400 error for other bad request messages", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "List not found" }),
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

	describe("Duplicate email handling", () => {
		it("should return generic failure on 409 Conflict (duplicate subscriber)", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 409,
				json: () => Promise.resolve({ message: "Subscriber already exists" }),
			});

			const result = await subscribeToNewsletter({
				email: "existing@example.com",
				source: "website",
			});
			expect(result.success).toBe(false);
			expect(result.error).toBe("Failed to subscribe. Please try again.");
		});
	});

	describe("Request payload structure", () => {
		it("should send correct list UUID and email to Listmonk", async () => {
			await subscribeToNewsletter({ email: "payload@example.com", source: "website" });

			expect(mockFetch).toHaveBeenCalledTimes(1);
			const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
			expect(url).toBe("http://localhost:9000/api/public/subscription");
			expect(options.method).toBe("POST");

			const body = JSON.parse(options.body as string) as Record<string, unknown>;
			expect(body.email).toBe("payload@example.com");
			expect(body.name).toBe("");
			expect(body.list_uuids).toEqual(["41e24d1e-f13b-45b5-8a73-483ffe85def2"]);
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

		it("should return unexpected error when AbortError is NOT thrown (non-abort error)", async () => {
			mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

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
				json: () => Promise.resolve({}),
			});
			globalThis.fetch = mockGlobalFetch;

			// Reset deps so fetch defaults to the current globalThis.fetch
			await __resetDependencies();

			const result = await subscribeToNewsletter({ email: TEST_EMAIL, source: "website" });
			expect(result.success).toBe(true);
			expect(mockGlobalFetch).toHaveBeenCalledWith(
				"http://localhost:9000/api/public/subscription",
				expect.objectContaining({
					method: "POST",
					headers: { "Content-Type": "application/json" },
				})
			);

			globalThis.fetch = originalFetch;
		});
	});
});
