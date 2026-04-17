import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitContactForm } from "@/app/actions/contact";
import { __resetDependencies, __setDependencies } from "@/lib/_contact-deps";
import { getEnv } from "@/lib/cloudflare-env";

// Mock next/headers
vi.mock("next/headers", () => ({
	headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock cloudflare-env to return test values
vi.mock("@/lib/cloudflare-env", () => ({
	getEnv: vi.fn().mockResolvedValue({
		RESEND_API_KEY: "test-resend-key",
		CONTACT_EMAIL: "test@example.com",
		TURNSTILE_SECRET_KEY: "test-turnstile-key",
		NODE_ENV: "test",
	}),
}));

// Mock @react-email/render
vi.mock("@react-email/render", () => ({
	render: vi.fn().mockResolvedValue("<html>Mocked Email</html>"),
}));

const { mockRateLimitFn } = vi.hoisted(() => ({
	mockRateLimitFn: vi.fn().mockResolvedValue({ success: true }),
}));
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn().mockResolvedValue({
		env: {
			RATE_LIMITER_CONTACT: {
				limit: mockRateLimitFn,
			},
		},
	}),
}));

const mockGetEnv = vi.mocked(getEnv);

// Mock Data
const validData = {
	name: "Test User",
	email: "test@example.com",
	projectType: "web-app" as const,
	budget: "10k-25k" as const,
	referralSource: "" as const,
	message: "This is a valid message for testing purposes.",
	turnstileToken: "valid-token",
};

describe("submitContactForm", () => {
	const mockSendEmail = vi.fn();
	const mockVerify = vi.fn();

	beforeEach(async () => {
		vi.clearAllMocks();
		// Reset default mocks
		mockSendEmail.mockResolvedValue({ success: true });
		mockVerify.mockResolvedValue(true);
		mockRateLimitFn.mockResolvedValue({ success: true });

		await __setDependencies({
			sendEmail: mockSendEmail,
			verifyTurnstile: mockVerify,
		});
	});

	afterEach(async () => {
		await __resetDependencies();
	});

	describe("Zod validation", () => {
		it("should succeed with valid data", async () => {
			const result = await submitContactForm(validData);
			expect(result.success).toBe(true);
			expect(mockSendEmail).toHaveBeenCalled();
		});

		it("should fail validation with short name", async () => {
			const result = await submitContactForm({ ...validData, name: "A" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Name must be at least 2 characters");
			expect(result.fieldErrors?.name).toBeDefined();
			expect(mockSendEmail).not.toHaveBeenCalled();
		});

		it("should fail validation with invalid email", async () => {
			const result = await submitContactForm({ ...validData, email: "invalid" });
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.email).toBeDefined();
			expect(mockSendEmail).not.toHaveBeenCalled();
		});

		it("should fail validation with long email", async () => {
			const longEmail = "a".repeat(250) + "@test.com";
			const result = await submitContactForm({ ...validData, email: longEmail });
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.email).toBeDefined();
		});

		it("should fail validation with invalid project type", async () => {
			const result = await submitContactForm({
				...validData,
				// @ts-expect-error - testing invalid type
				projectType: "invalid",
			});
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.projectType).toBeDefined();
		});

		it("should fail validation with invalid budget", async () => {
			const result = await submitContactForm({
				...validData,
				// @ts-expect-error - testing invalid budget
				budget: "1k",
			});
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.budget).toBeDefined();
		});

		it("should fail validation with short message", async () => {
			const result = await submitContactForm({ ...validData, message: "Hi" });
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.message).toBeDefined();
		});

		it("should fail validation with long message", async () => {
			const result = await submitContactForm({
				...validData,
				message: "a".repeat(5001),
			});
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.message).toBeDefined();
		});
	});

	describe("Rate limiting", () => {
		it("should allow request when rate limit succeeds", async () => {
			const result = await submitContactForm(validData);
			expect(result.success).toBe(true);
		});

		it("should block when rate limit binding returns failure", async () => {
			mockRateLimitFn.mockResolvedValue({ success: false });
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("Too many submissions");
		});

		it("should pass client IP key to rate limiter", async () => {
			await submitContactForm(validData);
			expect(mockRateLimitFn).toHaveBeenCalledWith({
				key: expect.stringContaining("contact:"),
			});
		});
	});

	describe("Turnstile verification", () => {
		it("should pass with valid token", async () => {
			const result = await submitContactForm(validData);
			expect(mockVerify).toHaveBeenCalledWith("valid-token", "test-turnstile-key");
			expect(result.success).toBe(true);
		});

		it("should fail with invalid token", async () => {
			mockVerify.mockResolvedValue(false);
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("Security check failed");
		});

		it("should require token in production", async () => {
			mockGetEnv.mockResolvedValueOnce({
				RESEND_API_KEY: "test-resend-key",
				CONTACT_EMAIL: "test@example.com",
				TURNSTILE_SECRET_KEY: "test-turnstile-key",
				NODE_ENV: "production",
			});

			const result = await submitContactForm({
				...validData,
				turnstileToken: undefined,
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain("Security check required");
		});

		it("should skip verification when no token in development", async () => {
			mockGetEnv.mockResolvedValueOnce({
				RESEND_API_KEY: "test-resend-key",
				CONTACT_EMAIL: "test@example.com",
				TURNSTILE_SECRET_KEY: "test-turnstile-key",
				NODE_ENV: "development",
			});

			const result = await submitContactForm({
				...validData,
				turnstileToken: undefined,
			});
			expect(result.success).toBe(true);
			expect(mockVerify).not.toHaveBeenCalled();
		});
	});

	describe("Email sending", () => {
		it("should call sendEmail with correct parameters", async () => {
			await submitContactForm(validData);

			expect(mockSendEmail).toHaveBeenCalledWith(
				expect.objectContaining({
					apiKey: "test-resend-key",
					from: "alexmayhew.dev <noreply@alexmayhew.dev>",
					to: "test@example.com",
					replyTo: validData.email,
					subject: expect.stringContaining(validData.name),
					html: expect.any(String),
				})
			);
		});

		const projectTypes = ["web-app", "saas", "ecommerce", "consulting", "other"] as const;
		projectTypes.forEach((type) => {
			it(`should format subject correctly for project type: ${type}`, async () => {
				await submitContactForm({ ...validData, projectType: type });

				let expectedLabel: string = type;
				if (type === "web-app") expectedLabel = "Web Application";
				if (type === "saas") expectedLabel = "SaaS Platform";
				if (type === "ecommerce") expectedLabel = "E-Commerce";
				if (type === "consulting") expectedLabel = "Technical Consulting";
				if (type === "other") expectedLabel = "Other";

				expect(mockSendEmail).toHaveBeenCalledWith(
					expect.objectContaining({
						subject: expect.stringContaining(expectedLabel),
					})
				);
			});
		});

		const budgets = ["5k-10k", "10k-25k", "25k-50k", "50k+"] as const;
		budgets.forEach((budget) => {
			it(`should accept budget: ${budget}`, async () => {
				const result = await submitContactForm({ ...validData, budget });
				expect(result.success).toBe(true);
			});
		});

		it("should handle API errors with generic message", async () => {
			mockSendEmail.mockResolvedValue({
				success: false,
				error: "Resend internal: rate limit exceeded",
			});
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).not.toContain("Resend");
			expect(result.error).not.toContain("rate limit");
			expect(result.error).toContain("Failed to send message");
		});

		it("should handle network errors with generic message", async () => {
			mockSendEmail.mockRejectedValue(new Error("fetch failed: ECONNREFUSED"));
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).not.toContain("ECONNREFUSED");
			expect(result.error).toContain("Failed to send message");
		});

		it("should fail when RESEND_API_KEY is not configured", async () => {
			mockGetEnv.mockResolvedValueOnce({
				RESEND_API_KEY: undefined,
				CONTACT_EMAIL: "test@example.com",
				TURNSTILE_SECRET_KEY: "test-turnstile-key",
				NODE_ENV: "test",
			});

			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toBe("Email service not configured.");
		});

		it("should retry on network error and succeed on second attempt", async () => {
			mockSendEmail
				.mockRejectedValueOnce(new Error("fetch failed: ECONNREFUSED"))
				.mockResolvedValueOnce({ success: true });
			const result = await submitContactForm(validData);
			expect(result.success).toBe(true);
			expect(mockSendEmail).toHaveBeenCalledTimes(2);
		});

		it("should retry on 5xx response and succeed on second attempt", async () => {
			mockSendEmail
				.mockResolvedValueOnce({ success: false, error: "HTTP 503" })
				.mockResolvedValueOnce({ success: true });
			const result = await submitContactForm(validData);
			expect(result.success).toBe(true);
			expect(mockSendEmail).toHaveBeenCalledTimes(2);
		});

		it("should NOT retry on 4xx response", async () => {
			mockSendEmail.mockResolvedValueOnce({
				success: false,
				error: "HTTP 422 Unprocessable Entity",
			});
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(mockSendEmail).toHaveBeenCalledTimes(1);
		});

		it("should exhaust all 3 attempts on persistent network failure", async () => {
			mockSendEmail
				.mockRejectedValueOnce(new Error("ECONNREFUSED"))
				.mockRejectedValueOnce(new Error("ECONNREFUSED"))
				.mockRejectedValueOnce(new Error("ECONNREFUSED"));
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("Failed to send message");
			expect(mockSendEmail).toHaveBeenCalledTimes(3);
		});

		it("should use default sendEmail function if dependency not injected", async () => {
			// Reset to defaults
			await __resetDependencies();

			// Mock global fetch for the direct API call
			const originalFetch = global.fetch;
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ id: "test-id" }),
			});

			const result = await submitContactForm({
				...validData,
				turnstileToken: undefined,
			});

			expect(result.success).toBe(true);
			expect(global.fetch).toHaveBeenCalledWith(
				"https://api.resend.com/emails",
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						"Content-Type": "application/json",
						Authorization: "Bearer test-resend-key",
					}),
				})
			);

			global.fetch = originalFetch;
		});
	});
});
