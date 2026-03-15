import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	__resetDependencies,
	__setDependencies,
	subscribeNewsletterAction,
	subscribeToNewsletter,
} from "@/app/actions/newsletter";
import { getEnv } from "@/lib/cloudflare-env";

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
			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
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
			await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: expect.stringContaining('"email":"user@example.com"'),
				})
			);
		});
	});

	describe("subscribeNewsletterAction (FormData wrapper)", () => {
		it("should extract email from FormData and call through correctly", async () => {
			const formData = new FormData();
			formData.set("email", "form@example.com");

			const result = await subscribeNewsletterAction({ success: false }, formData);
			expect(result.success).toBe(true);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: expect.stringContaining("form@example.com"),
				})
			);
		});

		it("should pass source from FormData", async () => {
			const formData = new FormData();
			formData.set("email", "form@example.com");
			formData.set("source", "blog-sidebar");

			const result = await subscribeNewsletterAction({ success: false }, formData);
			expect(result.success).toBe(true);
		});

		it("should default source to 'website' when missing from FormData", async () => {
			const formData = new FormData();
			formData.set("email", "form@example.com");

			const result = await subscribeNewsletterAction({ success: false }, formData);
			expect(result.success).toBe(true);
		});
	});

	describe("Rate limiting", () => {
		it("should allow when rate limit succeeds", async () => {
			mockRateLimitFn.mockResolvedValue({ success: true });
			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(true);
		});

		it("should block when rate limit binding returns failure", async () => {
			mockRateLimitFn.mockResolvedValue({ success: false });
			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toContain("Too many attempts");
		});

		it("should pass client IP key to rate limiter", async () => {
			await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(mockRateLimitFn).toHaveBeenCalledWith({
				key: expect.stringContaining("newsletter:"),
			});
		});
	});

	describe("Missing LISTMONK_API_URL", () => {
		it("should return unavailable message when API URL is not configured", async () => {
			mockGetEnv.mockResolvedValueOnce({
				LISTMONK_API_URL: undefined,
			});

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
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

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(true);
		});

		it("should return email validation error on 400 with 'email' in message", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "Invalid email address provided" }),
			});

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Please enter a valid email address.");
		});

		it("should return email validation error on 400 with 'valid' in message", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "Not a valid format" }),
			});

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Please enter a valid email address.");
		});

		it("should return generic 400 error for other bad request messages", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.resolve({ message: "List not found" }),
			});

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Unable to subscribe. Please try again.");
		});

		it("should return failure message on 500 response", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				json: () => Promise.resolve({ message: "Internal server error" }),
			});

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Failed to subscribe. Please try again.");
		});

		it("should handle response.json() throwing", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				json: () => Promise.reject(new Error("Invalid JSON")),
			});

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Unable to subscribe. Please try again.");
		});
	});

	describe("Network/timeout errors", () => {
		it("should return unexpected error when fetch throws", async () => {
			mockFetch.mockRejectedValue(new Error("Network timeout"));

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
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

			const result = await subscribeToNewsletter({ email: "user@example.com", source: "website" });
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
