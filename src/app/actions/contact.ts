"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { render } from "@react-email/render";
import { headers } from "next/headers";

import { ContactNotification } from "@/components/emails/contact-notification";
import { getEnv } from "@/lib/cloudflare-env";
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
		signal: AbortSignal.timeout(10_000),
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
};

// Internal method to swap dependencies during tests
export const __setDependencies = async (
	deps: Partial<{
		sendEmail: SendEmailFn;
		verifyTurnstile: typeof verifyTurnstileToken;
	}>
) => {
	dependencies = { ...dependencies, ...deps };
};

// Reset dependencies (for testing cleanup)
export const __resetDependencies = async () => {
	dependencies = {
		sendEmail: sendEmailViaResend,
		verifyTurnstile: verifyTurnstileToken,
	};
};

export interface ContactFormState {
	success: boolean;
	error?: string;
	fieldErrors?: Record<string, string[]>;
}

// useActionState-compatible wrapper: accepts (prevState, FormData)
export async function submitContactAction(
	_prevState: ContactFormState,
	formData: FormData
): Promise<ContactFormState> {
	const raw = {
		name: formData.get("name") as string,
		email: formData.get("email") as string,
		projectType: formData.get("projectType") as string,
		budget: formData.get("budget") as string,
		message: formData.get("message") as string,
		referralSource: (formData.get("referralSource") as string) || undefined,
		turnstileToken: (formData.get("turnstileToken") as string) || undefined,
	};
	return submitContactForm(raw as ContactFormValues);
}

export async function submitContactForm(data: ContactFormValues): Promise<ContactFormState> {
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

	// 2. Rate Limiting (Workers RateLimit binding)
	const headersList = await headers();
	const clientIP =
		headersList.get("cf-connecting-ip") ||
		headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
		"unknown";

	try {
		const { env: cfEnv } = await getCloudflareContext();
		if (cfEnv.RATE_LIMITER_CONTACT) {
			const { success } = await cfEnv.RATE_LIMITER_CONTACT.limit({
				key: `contact:${clientIP}`,
			});
			if (!success) {
				return {
					success: false,
					error: "Too many submissions. Please try again later.",
				};
			}
		}
	} catch {
		// Rate limiting unavailable in local dev — allow request through
	}

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
			return {
				success: false,
				error: "Failed to send message. Please try again or email alex@alexmayhew.dev directly.",
			};
		}

		return { success: true };
	} catch (err) {
		console.error("Contact form error:", err);
		return {
			success: false,
			error: "Failed to send message. Please try again or email alex@alexmayhew.dev directly.",
		};
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
