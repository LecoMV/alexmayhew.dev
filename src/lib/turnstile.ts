/**
 * Server-side Turnstile token verification
 */

import { logger } from "@/lib/logger";

interface TurnstileVerifyResponse {
	success: boolean;
	"error-codes"?: string[];
	challenge_ts?: string;
	hostname?: string;
}

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

		const data: TurnstileVerifyResponse = await response.json();

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
