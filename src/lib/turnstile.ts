/**
 * Server-side Turnstile token verification
 */

interface TurnstileVerifyResponse {
	success: boolean;
	"error-codes"?: string[];
	challenge_ts?: string;
	hostname?: string;
}

export async function verifyTurnstileToken(token: string, secretKey?: string): Promise<boolean> {
	if (!secretKey) {
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
