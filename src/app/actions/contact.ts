"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { render } from "@react-email/render";
import { headers } from "next/headers";

import { ContactNotification } from "@/components/emails/contact-notification";
import { dependencies } from "@/lib/_contact-deps";
import { getEnv } from "@/lib/cloudflare-env";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas/contact";

// Retry delays in ms: 1s first retry, 3s second retry
const RETRY_DELAYS = [1000, 3000];

// Contact form: 5 submissions per minute per IP.
const CONTACT_LIMIT_PER_MIN = 5;

async function withRetry<T>(
	fn: () => Promise<T>,
	opts: {
		shouldRetry: (error: unknown) => boolean;
		delays: number[];
	}
): Promise<T> {
	let lastError: unknown;
	for (let attempt = 0; attempt <= opts.delays.length; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			if (attempt < opts.delays.length && opts.shouldRetry(error)) {
				logger.warn("contact.sendEmail retry", {
					attempt: attempt + 1,
					totalAttempts: opts.delays.length,
					error: String(error),
				});
				await new Promise((resolve) => setTimeout(resolve, opts.delays[attempt]));
				continue;
			}
			throw error;
		}
	}
	throw lastError;
}

function isRetryableError(error: unknown): boolean {
	// Retry only on Resend 5xx responses (converted to Error in withRetry wrapper)
	// or explicit network/timeout errors. 4xx errors come back as { success: false }
	// and should not be retried.
	if (error instanceof Error) {
		if (/^Resend (5\d\d|network)/i.test(error.message)) return true;
		const status = (error as Error & { status?: number }).status;
		if (typeof status === "number" && status >= 500) return true;
	}
	return false;
}

export interface ContactFormState {
	success: boolean;
	error?: string;
	fieldErrors?: Record<string, string[]>;
}

// useActionState-compatible wrapper: accepts (prevState, FormData).
//
// FormData values are `string | File`; casting each to `string` throws away
// that guarantee. Prefer Object.fromEntries + let the Zod schema inside
// submitContactForm own validation -- we drop an empty string for optional
// fields so the schema can apply its own `.optional()` semantics.
export async function submitContactAction(
	_prevState: ContactFormState,
	formData: FormData
): Promise<ContactFormState> {
	const entries = Object.fromEntries(formData);
	const raw: Record<string, unknown> = { ...entries };
	if (raw.referralSource === "") raw.referralSource = undefined;
	if (raw.turnstileToken === "") raw.turnstileToken = undefined;
	return submitContactForm(raw as unknown as ContactFormValues);
}

async function extractClientIP(): Promise<string> {
	const h = await headers();
	return h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

async function enforceContactRateLimit(clientIP: string): Promise<ContactFormState | null> {
	try {
		const { env: cfEnv } = await getCloudflareContext();
		const { success } = await checkRateLimit({
			kv: cfEnv.RATE_LIMIT_KV ?? null,
			key: `contact:${clientIP}`,
			limit: CONTACT_LIMIT_PER_MIN,
		});
		if (!success) {
			return { success: false, error: "Too many submissions. Please try again later." };
		}
	} catch {
		// Rate limiting unavailable in local dev ... allow request through.
	}
	return null;
}

async function verifyBotCheck(
	turnstileToken: string | undefined,
	env: { NODE_ENV?: string; TURNSTILE_SECRET_KEY?: string }
): Promise<ContactFormState | null> {
	const required = env.NODE_ENV === "production" || !!turnstileToken;
	if (!required) return null;
	if (!turnstileToken) return { success: false, error: "Security check required." };
	const isValid = await dependencies.verifyTurnstile(
		turnstileToken,
		env.TURNSTILE_SECRET_KEY as string
	);
	if (!isValid) return { success: false, error: "Security check failed." };
	return null;
}

interface EmailParams {
	apiKey: string;
	from: string;
	to: string;
	replyTo: string;
	subject: string;
	html: string;
}

async function sendResendEmail(params: EmailParams): Promise<ContactFormState> {
	const result = await withRetry(
		async () => {
			try {
				const res = await dependencies.sendEmail(params);
				if (!res.success && res.error) {
					const statusMatch = res.error.match(/^HTTP (5\d{2})/);
					if (statusMatch) {
						const err = new Error(`Resend ${statusMatch[1]}: ${res.error}`) as Error & {
							status?: number;
						};
						err.status = Number(statusMatch[1]);
						throw err;
					}
				}
				return res;
			} catch (err) {
				if (err instanceof Error && !/^Resend /i.test(err.message)) {
					throw new Error(`Resend network: ${err.message}`);
				}
				throw err;
			}
		},
		{ shouldRetry: isRetryableError, delays: RETRY_DELAYS }
	);
	if (!result.success) {
		logger.error("Resend API error", { route: "contact", error: String(result.error) });
		return {
			success: false,
			error: "Failed to send message. Please try again or email alex@alexmayhew.dev directly.",
		};
	}
	return { success: true };
}

export async function submitContactForm(data: unknown): Promise<ContactFormState> {
	const validation = contactFormSchema.safeParse(data);
	if (!validation.success) {
		const fieldErrors = validation.error.flatten().fieldErrors as Record<string, string[]>;
		const errorMessages = Object.entries(fieldErrors)
			.map(([, errors]) => errors?.[0])
			.filter(Boolean);
		const errorMessage =
			errorMessages.length > 0 ? errorMessages[0] : "Please fill in all required fields";
		return { success: false, error: errorMessage, fieldErrors };
	}

	const { name, email, projectType, budget, message, referralSource, turnstileToken } =
		validation.data;

	const clientIP = await extractClientIP();
	const rateLimited = await enforceContactRateLimit(clientIP);
	if (rateLimited) return rateLimited;

	const env = await getEnv();
	const botCheck = await verifyBotCheck(turnstileToken, env);
	if (botCheck) return botCheck;

	if (!env.RESEND_API_KEY) {
		logger.error("RESEND_API_KEY not configured", { route: "contact" });
		return { success: false, error: "Email service not configured." };
	}

	try {
		const timestamp = new Date().toLocaleString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});
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
		return await sendResendEmail({
			apiKey: env.RESEND_API_KEY,
			from: "alexmayhew.dev <noreply@alexmayhew.dev>",
			to: env.CONTACT_EMAIL || "alex@alexmayhew.dev",
			replyTo: email,
			subject: `[INCOMING_TRANSMISSION] ${name} - ${formatProjectType(projectType)}`,
			html: emailHtml,
		});
	} catch (err) {
		logger.error("Contact form error", { route: "contact", error: String(err) });
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
