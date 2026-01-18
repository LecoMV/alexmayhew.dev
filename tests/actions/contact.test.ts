import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitContactForm, __setDependencies, __resetDependencies } from "@/app/actions/contact";

// Mock next/headers
vi.mock("next/headers", () => ({
	headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock Data
const validData = {
	name: "Test User",
	email: "test@example.com",
	projectType: "web-app" as const,
	budget: "10k-25k" as const,
	message: "This is a valid message for testing purposes.",
	turnstileToken: "valid-token",
};

describe("submitContactForm", () => {
	// We mock the module to intercept the constructor for coverage of the lazy init
	vi.mock("resend", () => {
		return {
			Resend: vi.fn(function () {
				return {
					emails: { send: vi.fn().mockResolvedValue({ error: null }) },
				};
			}),
		};
	});

	const mockResend = { emails: { send: vi.fn() } };
	const mockVerify = vi.fn();
	const mockRateLimit = vi.fn();

	beforeEach(async () => {
		vi.clearAllMocks();
		// Reset default mocks
		mockResend.emails.send.mockResolvedValue({ error: null });
		mockVerify.mockResolvedValue(true);
		mockRateLimit.mockReturnValue({ success: true, resetIn: 0 });

		await __setDependencies({
			resend: mockResend as unknown as import("resend").Resend,
			verifyTurnstile: mockVerify,
			rateLimit: mockRateLimit,
			getIP: () => "127.0.0.1",
		});
	});

	afterEach(async () => {
		await __resetDependencies();
	});

	describe("Zod validation", () => {
		it("should succeed with valid data", async () => {
			const result = await submitContactForm(validData);
			expect(result.success).toBe(true);
			expect(mockResend.emails.send).toHaveBeenCalled();
		});

		it("should fail validation with short name", async () => {
			const result = await submitContactForm({ ...validData, name: "A" });
			expect(result.success).toBe(false);
			expect(result.error).toBe("Validation failed");
			expect(result.fieldErrors?.name).toBeDefined();
			expect(mockResend.emails.send).not.toHaveBeenCalled();
		});

		it("should fail validation with invalid email", async () => {
			const result = await submitContactForm({ ...validData, email: "invalid" });
			expect(result.success).toBe(false);
			expect(result.fieldErrors?.email).toBeDefined();
			expect(mockResend.emails.send).not.toHaveBeenCalled();
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
		it("should allow request when rate limit is not exceeded", async () => {
			const result = await submitContactForm(validData);
			expect(result.success).toBe(true);
		});

		it("should block when rate limit is exceeded", async () => {
			mockRateLimit.mockReturnValue({ success: false, resetIn: 60 });
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("Too many submissions");
		});

		it("should show reset time in error message", async () => {
			mockRateLimit.mockReturnValue({ success: false, resetIn: 120 });
			const result = await submitContactForm(validData);
			expect(result.error).toContain("2 minutes");
		});
	});

	describe("Turnstile verification", () => {
		it("should pass with valid token", async () => {
			const result = await submitContactForm(validData);
			expect(mockVerify).toHaveBeenCalledWith("valid-token");
			expect(result.success).toBe(true);
		});

		it("should fail with invalid token", async () => {
			mockVerify.mockResolvedValue(false);
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("Security check failed");
		});

		it("should require token in production", async () => {
			vi.stubEnv("NODE_ENV", "production");

			const result = await submitContactForm({
				...validData,
				turnstileToken: undefined,
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain("Security check required");

			vi.unstubAllEnvs();
		});

		it("should skip verification when no token in development", async () => {
			vi.stubEnv("NODE_ENV", "development");

			const result = await submitContactForm({
				...validData,
				turnstileToken: undefined,
			});
			expect(result.success).toBe(true);
			expect(mockVerify).not.toHaveBeenCalled();

			vi.unstubAllEnvs();
		});
	});

	describe("Email sending", () => {
		it("should call Resend with correct parameters", async () => {
			await submitContactForm(validData);

			expect(mockResend.emails.send).toHaveBeenCalledWith(
				expect.objectContaining({
					from: "alexmayhew.dev <noreply@alexmayhew.dev>",
					replyTo: validData.email,
					subject: expect.stringContaining(validData.name),
				})
			);
		});

		const projectTypes = ["web-app", "saas", "ecommerce", "consulting", "other"] as const;
		projectTypes.forEach((type) => {
			it(`should format subject correctly for project type: ${type}`, async () => {
				await submitContactForm({ ...validData, projectType: type });

				// Verify the subject formatting logic in the action
				let expectedLabel: string = type;
				if (type === "web-app") expectedLabel = "Web Application";
				if (type === "saas") expectedLabel = "SaaS Platform";
				if (type === "ecommerce") expectedLabel = "E-Commerce";
				if (type === "consulting") expectedLabel = "Technical Consulting";
				if (type === "other") expectedLabel = "Other";

				expect(mockResend.emails.send).toHaveBeenCalledWith(
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
				// Implicitly covers the formatBudget helper in the email component
				// since the component is rendered (executed) by the action.
			});
		});

		it("should handle Resend API errors", async () => {
			mockResend.emails.send.mockResolvedValue({
				error: { message: "API Error" },
			});
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("Failed to send message");
		});

		it("should handle network errors", async () => {
			mockResend.emails.send.mockRejectedValue(new Error("Network error"));
			const result = await submitContactForm(validData);
			expect(result.success).toBe(false);
			expect(result.error).toContain("unexpected error");
		});

		it("should use default Resend instance if dependency not injected", async () => {
			// Clear dependencies to force lazy init path (line 21 coverage)
			await __resetDependencies();

			// We rely on the module mock above to handle the 'new Resend()' call
			// so it doesn't actually try to make a network request
			// and we verify that the instance created by the mock works (returns success)

			const result = await submitContactForm({
				...validData,
				turnstileToken: undefined,
			});
			expect(result.success).toBe(true);
		});
	});
});
