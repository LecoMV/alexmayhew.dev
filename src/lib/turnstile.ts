/**
 * Server-side Turnstile token verification.
 *
 * The Cloudflare response is validated with Zod to defend against malformed
 * or adversarial payloads (e.g. injected `success: "true"` string coerced via
 * structural typing). Any schema violation is treated as a verification
 * failure.
 */

import { z } from "zod";

import { logger } from "@/lib/logger";

const TurnstileResponseSchema = z.object({
	success: z.boolean(),
	"error-codes": z.array(z.string()).optional(),
	challenge_ts: z.string().optional(),
	hostname: z.string().optional(),
});

export async function verifyTurnstileToken(token: string, secretKey?: string): Promise<boolean> {
	if (!secretKey) {
		logger.error("Turnstile secret key not configured");
		return false;
	}

	try {
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				secret: secretKey,
				response: token,
			}),
			signal: AbortSignal.timeout(5_000),
		});

		const raw = await response.json();
		const parsed = TurnstileResponseSchema.safeParse(raw);

		if (!parsed.success) {
			logger.error("Turnstile response schema validation failed", {
				errors: ["invalid_response"],
			});
			return false;
		}

		const data = parsed.data;

		if (!data.success) {
			logger.error("Turnstile verification failed", {
				errorCodes: data["error-codes"],
			});
		}

		return data.success;
	} catch (error) {
		logger.error("Turnstile verification error", {
			error: error instanceof Error ? error.message : String(error),
		});
		return false;
	}
}
