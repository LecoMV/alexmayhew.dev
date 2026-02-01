"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { ContactNotification } from "@/components/emails/contact-notification";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas/contact";
import { getEnv } from "@/lib/cloudflare-env";

// Dependency Injection container for testing
let dependencies = {
	resend: null as Resend | null,
	verifyTurnstile: verifyTurnstileToken,
	rateLimit: checkRateLimit,
	getIP: getClientIP,
};

// Lazy init for resend — accepts API key at call time
function getResend(apiKey?: string): Resend {
	if (!dependencies.resend) {
		dependencies.resend = new Resend(apiKey);
	}
	return dependencies.resend;
}

// Internal method to swap dependencies during tests
// Note: Must be async to satisfy Next.js Server Actions requirement
export const __setDependencies = async (
	deps: Partial<{
		resend: Resend;
		verifyTurnstile: typeof verifyTurnstileToken;
		rateLimit: typeof checkRateLimit;
		getIP: typeof getClientIP;
	}>
) => {
	dependencies = { ...dependencies, ...deps };
};

// Reset dependencies (for testing cleanup)
// Note: Must be async to satisfy Next.js Server Actions requirement
export const __resetDependencies = async () => {
	dependencies = {
		resend: null,
		verifyTurnstile: verifyTurnstileToken,
		rateLimit: checkRateLimit,
		getIP: getClientIP,
	};
};

export interface ContactFormResult {
	success: boolean;
	error?: string;
	fieldErrors?: Record<string, string[]>;
}

export async function submitContactForm(data: ContactFormValues): Promise<ContactFormResult> {
	// 1. Zod Validation
	const validation = contactFormSchema.safeParse(data);
	if (!validation.success) {
		const fieldErrors = validation.error.flatten().fieldErrors as Record<string, string[]>;
		// Build a user-friendly error message from field errors
		const errorMessages = Object.entries(fieldErrors)
			.map(([field, errors]) => errors?.[0])
			.filter(Boolean);
		const errorMessage =
			errorMessages.length > 0 ? errorMessages[0] : "Please fill in all required fields";
		return {
			success: false,
			error: errorMessage,
			fieldErrors,
		};
	}

	const { name, email, projectType, budget, message, turnstileToken } = validation.data;

	// 2. Rate Limiting
	const headersList = await headers();
	const clientIP = dependencies.getIP(headersList);
	const limitResult = dependencies.rateLimit(`contact:${clientIP}`, {
		limit: 5,
		windowSeconds: 3600,
	});

	if (!limitResult.success) {
		return {
			success: false,
			error: `Too many submissions. Try again in ${Math.ceil(limitResult.resetIn / 60)} minutes.`,
		};
	}

	// Get environment variables from Cloudflare context
	const env = await getEnv();

	// 3. Security (Turnstile)
	if (env.NODE_ENV === "production" || turnstileToken) {
		if (!turnstileToken) {
			return { success: false, error: "Security check required." };
		}
		const isValid = await dependencies.verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
		if (!isValid) {
			return { success: false, error: "Security check failed." };
		}
	}

	// 4. Send Email
	const timestamp = new Date().toLocaleString("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZoneName: "short",
	});

	try {
		if (!env.RESEND_API_KEY) {
			console.error("RESEND_API_KEY not configured");
			return { success: false, error: "Email service not configured." };
		}

		const resend = getResend(env.RESEND_API_KEY);
		const { error } = await resend.emails.send({
			from: "alexmayhew.dev <noreply@alexmayhew.dev>",
			to: env.CONTACT_EMAIL || "alex@alexmayhew.dev",
			replyTo: email,
			subject: `[INCOMING_TRANSMISSION] ${name} - ${formatProjectType(projectType)}`,
			react: ContactNotification({
				name,
				email,
				projectType,
				budget,
				message,
				timestamp,
			}),
		});

		if (error) {
			console.error("Resend error:", error);
			return { success: false, error: `Failed to send: ${error.message}` };
		}

		return { success: true };
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "Unknown error";
		console.error("Contact form error:", err);
		return { success: false, error: `Send failed: ${errorMessage}` };
	}
}

function formatProjectType(type: string): string {
	const types: Record<string, string> = {
		"web-app": "Web Application",
		saas: "SaaS Platform",
		ecommerce: "E-Commerce",
		consulting: "Technical Consulting",
		other: "Other",
	};
	return types[type] || type;
}
