"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getEnv } from "@/lib/cloudflare-env";

// Validation schema
const newsletterSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	source: z.string().optional().default("website"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export interface NewsletterResult {
	success: boolean;
	error?: string;
}

// Dependency injection for testing
let dependencies = {
	rateLimit: checkRateLimit,
	getIP: getClientIP,
	fetch: globalThis.fetch,
};

export const __setDependencies = async (
	deps: Partial<{
		rateLimit: typeof checkRateLimit;
		getIP: typeof getClientIP;
		fetch: typeof globalThis.fetch;
	}>
) => {
	dependencies = { ...dependencies, ...deps };
};

export const __resetDependencies = async () => {
	dependencies = {
		rateLimit: checkRateLimit,
		getIP: getClientIP,
		fetch: globalThis.fetch,
	};
};

export async function subscribeToNewsletter(data: NewsletterFormValues): Promise<NewsletterResult> {
	// 1. Validate input
	const validation = newsletterSchema.safeParse(data);
	if (!validation.success) {
		return {
			success: false,
			error: validation.error.issues[0]?.message || "Invalid email address",
		};
	}

	const { email } = validation.data;

	// 2. Rate limiting - 3 attempts per hour per IP
	const headersList = await headers();
	const clientIP = dependencies.getIP(headersList);
	const limitResult = dependencies.rateLimit(`newsletter:${clientIP}`, {
		limit: 3,
		windowSeconds: 3600,
	});

	if (!limitResult.success) {
		return {
			success: false,
			error: `Too many attempts. Try again in ${Math.ceil(limitResult.resetIn / 60)} minutes.`,
		};
	}

	// 3. Subscribe via Listmonk public subscription API
	const env = await getEnv();
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
