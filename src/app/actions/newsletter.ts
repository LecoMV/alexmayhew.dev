"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

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

	const { email, source } = validation.data;

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

	// 3. Subscribe via Buttondown API
	const apiKey = process.env.BUTTONDOWN_API_KEY;

	if (!apiKey) {
		// In development, log and return success for testing UI
		if (process.env.NODE_ENV === "development") {
			console.log(`[Newsletter] Would subscribe: ${email} (source: ${source})`);
			return { success: true };
		}
		console.error("BUTTONDOWN_API_KEY not configured");
		return { success: false, error: "Newsletter service not configured." };
	}

	try {
		const response = await dependencies.fetch("https://api.buttondown.email/v1/subscribers", {
			method: "POST",
			headers: {
				Authorization: `Token ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email_address: email,
				metadata: {
					source,
					subscribed_at: new Date().toISOString(),
				},
				tags: [source],
			}),
		});

		if (response.ok) {
			return { success: true };
		}

		// Handle specific Buttondown errors
		if (response.status === 409) {
			// Already subscribed - treat as success
			return { success: true };
		}

		const errorData = await response.json().catch(() => ({}));
		console.error("Buttondown API error:", response.status, errorData);

		if (response.status === 400) {
			return { success: false, error: "Invalid email address." };
		}

		return { success: false, error: "Failed to subscribe. Please try again." };
	} catch (err) {
		console.error("Newsletter subscription error:", err);
		return { success: false, error: "An unexpected error occurred." };
	}
}
