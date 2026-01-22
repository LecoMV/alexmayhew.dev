import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyTurnstileToken } from "@/lib/turnstile";

describe("verifyTurnstileToken", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	describe("without secret key", () => {
		it("should return true in development without key", async () => {
			vi.stubEnv("NODE_ENV", "development");
			vi.stubEnv("TURNSTILE_SECRET_KEY", "");

			const result = await verifyTurnstileToken("test-token");

			expect(result).toBe(true);
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should return false in production without key", async () => {
			vi.stubEnv("NODE_ENV", "production");
			vi.stubEnv("TURNSTILE_SECRET_KEY", "");

			const result = await verifyTurnstileToken("test-token");

			expect(result).toBe(false);
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should return false in test without key (non-development)", async () => {
			vi.stubEnv("NODE_ENV", "test");
			vi.stubEnv("TURNSTILE_SECRET_KEY", "");

			const result = await verifyTurnstileToken("test-token");

			expect(result).toBe(false);
			expect(mockFetch).not.toHaveBeenCalled();
		});
	});

	describe("with secret key", () => {
		beforeEach(() => {
			vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret-key");
		});

		it("should return true for valid token", async () => {
			mockFetch.mockResolvedValue({
				json: () => Promise.resolve({ success: true }),
			});

			const result = await verifyTurnstileToken("valid-token");

			expect(result).toBe(true);
			expect(mockFetch).toHaveBeenCalledWith(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				expect.objectContaining({
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				})
			);
		});

		it("should return false for invalid token", async () => {
			mockFetch.mockResolvedValue({
				json: () =>
					Promise.resolve({
						success: false,
						"error-codes": ["invalid-input-response"],
					}),
			});

			const result = await verifyTurnstileToken("invalid-token");

			expect(result).toBe(false);
		});

		it("should send correct request body", async () => {
			mockFetch.mockResolvedValue({
				json: () => Promise.resolve({ success: true }),
			});

			await verifyTurnstileToken("my-test-token");

			const callArgs = mockFetch.mock.calls[0];
			const body = callArgs[1].body;

			expect(body.get("secret")).toBe("test-secret-key");
			expect(body.get("response")).toBe("my-test-token");
		});

		it("should use correct Cloudflare endpoint", async () => {
			mockFetch.mockResolvedValue({
				json: () => Promise.resolve({ success: true }),
			});

			await verifyTurnstileToken("token");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				expect.anything()
			);
		});
	});

	describe("error handling", () => {
		beforeEach(() => {
			vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret-key");
		});

		it("should return false on network error", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const result = await verifyTurnstileToken("token");

			expect(result).toBe(false);
		});

		it("should return false on JSON parse error", async () => {
			mockFetch.mockResolvedValue({
				json: () => Promise.reject(new Error("Invalid JSON")),
			});

			const result = await verifyTurnstileToken("token");

			expect(result).toBe(false);
		});

		it("should return false on fetch timeout", async () => {
			mockFetch.mockRejectedValue(new Error("Timeout"));

			const result = await verifyTurnstileToken("token");

			expect(result).toBe(false);
		});
	});
});
