/**
 * Server-side Turnstile token verification
 */

interface TurnstileVerifyResponse {
	success: boolean;
	"error-codes"?: string[];
	challenge_ts?: string;
	hostname?: string;
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
	const secretKey = process.env.TURNSTILE_SECRET_KEY;

	if (!secretKey) {
		// In development without key, allow through
		if (process.env.NODE_ENV === "development") {
			console.warn("[Turnstile] No secret key configured, skipping verification");
			return true;
		}
		console.error("[Turnstile] TURNSTILE_SECRET_KEY is not configured");
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
		});

		const data: TurnstileVerifyResponse = await response.json();

		if (!data.success) {
			console.error("[Turnstile] Verification failed:", data["error-codes"]);
		}

		return data.success;
	} catch (error) {
		console.error("[Turnstile] Verification error:", error);
		return false;
	}
}
