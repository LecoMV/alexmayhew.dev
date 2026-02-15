"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";

import { ContactNotification } from "@/components/emails/contact-notification";
import { getEnv } from "@/lib/cloudflare-env";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas/contact";
import { verifyTurnstileToken } from "@/lib/turnstile";

// Email sending function type for dependency injection
type SendEmailFn = (params: {
	apiKey: string;
	from: string;
	to: string;
	replyTo: string;
	subject: string;
	html: string;
}) => Promise<{ success: boolean; error?: string }>;

// Direct fetch to Resend API (avoids SDK bundling issues on Cloudflare Workers)
async function sendEmailViaResend(params: {
	apiKey: string;
	from: string;
	to: string;
	replyTo: string;
	subject: string;
	html: string;
}): Promise<{ success: boolean; error?: string }> {
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${params.apiKey}`,
		},
		body: JSON.stringify({
			from: params.from,
			to: params.to,
			reply_to: params.replyTo,
			subject: params.subject,
			html: params.html,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = (errorData as { message?: string }).message || `HTTP ${response.status}`;
		return { success: false, error: errorMessage };
	}

	return { success: true };
}

// Dependency Injection container for testing
let dependencies = {
	sendEmail: sendEmailViaResend as SendEmailFn,
	verifyTurnstile: verifyTurnstileToken,
	rateLimit: checkRateLimit,
	getIP: getClientIP,
};

// Internal method to swap dependencies during tests
export const __setDependencies = async (
	deps: Partial<{
		sendEmail: SendEmailFn;
		verifyTurnstile: typeof verifyTurnstileToken;
		rateLimit: typeof checkRateLimit;
		getIP: typeof getClientIP;
	}>
) => {
	dependencies = { ...dependencies, ...deps };
};

// Reset dependencies (for testing cleanup)
export const __resetDependencies = async () => {
	dependencies = {
		sendEmail: sendEmailViaResend,
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
		const errorMessages = Object.entries(fieldErrors)
			.map(([, errors]) => errors?.[0])
			.filter(Boolean);
		const errorMessage =
			errorMessages.length > 0 ? errorMessages[0] : "Please fill in all required fields";
		return {
			success: false,
			error: errorMessage,
			fieldErrors,
		};
	}

	const { name, email, projectType, budget, message, referralSource, turnstileToken } =
		validation.data;

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

		// Render React email to HTML string
		const emailHtml = await render(
			ContactNotification({
				name,
				email,
				projectType,
				budget,
				message,
				referralSource,
				timestamp,
			})
		);

		// Send via direct API call (avoids SDK bundling issues on Cloudflare Workers)
		const result = await dependencies.sendEmail({
			apiKey: env.RESEND_API_KEY,
			from: "alexmayhew.dev <noreply@alexmayhew.dev>",
			to: env.CONTACT_EMAIL || "alex@alexmayhew.dev",
			replyTo: email,
			subject: `[INCOMING_TRANSMISSION] ${name} - ${formatProjectType(projectType)}`,
			html: emailHtml,
		});

		if (!result.success) {
			console.error("Resend API error:", result.error);
			return { success: false, error: `Failed to send: ${result.error}` };
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
