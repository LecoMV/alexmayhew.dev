"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { z } from "zod";

import { dependencies } from "@/lib/_newsletter-deps";
import { getEnv } from "@/lib/cloudflare-env";

// Validation schema
const newsletterSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	source: z.string().optional().default("website"),
	turnstileToken: z.string().optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export interface NewsletterFormState {
	success: boolean;
	error?: string;
}

// useActionState-compatible wrapper: accepts (prevState, FormData)
export async function subscribeNewsletterAction(
	_prevState: NewsletterFormState,
	formData: FormData
): Promise<NewsletterFormState> {
	const raw = {
		email: formData.get("email") as string,
		source: (formData.get("source") as string) || "website",
		turnstileToken: (formData.get("turnstileToken") as string) || undefined,
	};
	return subscribeToNewsletter(raw);
}

export async function subscribeToNewsletter(
	data: NewsletterFormValues
): Promise<NewsletterFormState> {
	// 1. Validate input
	const validation = newsletterSchema.safeParse(data);
	if (!validation.success) {
		return {
			success: false,
			error: validation.error.issues[0]?.message || "Invalid email address",
		};
	}

	const { email, turnstileToken } = validation.data;

	// 2. Rate limiting (Workers RateLimit binding)
	const headersList = await headers();
	const clientIP =
		headersList.get("cf-connecting-ip") ||
		headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
		"unknown";

	try {
		const { env: cfEnv } = await getCloudflareContext();
		if (cfEnv.RATE_LIMITER_NEWSLETTER) {
			const { success } = await cfEnv.RATE_LIMITER_NEWSLETTER.limit({
				key: `newsletter:${clientIP}`,
			});
			if (!success) {
				return {
					success: false,
					error: "Too many attempts. Please try again later.",
				};
			}
		}
	} catch {
		// Rate limiting unavailable in local dev ... allow request through
	}

	const env = await getEnv();

	// 3. Security (Turnstile) ... mirrors the contact form pattern so the bot-check
	// surface stays consistent. Enforced in production; optional in dev/tests
	// unless a token is explicitly provided.
	if (env.NODE_ENV === "production" || turnstileToken) {
		if (!turnstileToken) {
			return { success: false, error: "Bot check required. Please try again." };
		}
		const isValid = await dependencies.verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
		if (!isValid) {
			return { success: false, error: "Bot check failed. Please try again." };
		}
	}

	// 4. Subscribe via Listmonk public subscription API
	const apiUrl = env.LISTMONK_API_URL;

	if (!apiUrl) {
		console.error("[Newsletter] LISTMONK_API_URL not configured");
		return { success: false, error: "Newsletter signup is temporarily unavailable." };
	}

	// "The Architects Brief" mailing list UUID (public, double opt-in)
	const listUuid = "41e24d1e-f13b-45b5-8a73-483ffe85def2";

	try {
		const response = await dependencies.fetch(`${apiUrl}/api/public/subscription`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				name: "",
				list_uuids: [listUuid],
			}),
			signal: AbortSignal.timeout(8_000),
		});

		if (response.ok) {
			return { success: true };
		}

		const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
		const errorMessage = String(errorData?.message ?? "");
		console.error("Listmonk API error:", response.status, JSON.stringify(errorData));

		if (response.status === 400) {
			if (
				errorMessage.toLowerCase().includes("email") ||
				errorMessage.toLowerCase().includes("valid")
			) {
				return { success: false, error: "Please enter a valid email address." };
			}
			return { success: false, error: "Unable to subscribe. Please try again." };
		}

		return { success: false, error: "Failed to subscribe. Please try again." };
	} catch (err) {
		console.error("Newsletter subscription error:", err);
		return { success: false, error: "An unexpected error occurred." };
	}
}
