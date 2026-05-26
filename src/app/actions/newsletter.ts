"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { z } from "zod";

import { dependencies } from "@/lib/_newsletter-deps";
import { getEnv } from "@/lib/cloudflare-env";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

const NEWSLETTER_LIMIT_PER_MIN = 3;

const ALLOWED_CUSTOM_FIELDS = new Set([
	"stagefit_zone",
	"stagefit_severity",
	"stagefit_delta",
	"velocity_drag_band",
	"reversibility_risk_count",
	"top_misaligned_1",
	"top_misaligned_2",
	"top_misaligned_3",
	"persona",
	"customer_type",
	"revenue_stage",
	"trigger_event",
]);

const ARCHITECT_BRIEF_TAG_ID = 19804765;

const SOURCE_TAG_MAP: Record<string, string> = {
	footer: "source-footer",
	"blog-sidebar": "source-blog",
	"stage-fit-quiz-v2": "source-stagefit-quiz",
};

const newsletterSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	source: z.string().optional().default("website"),
	turnstileToken: z.string().optional(),
	customFields: z
		.record(z.string(), z.string().max(200))
		.refine((obj) => Object.keys(obj).every((k) => ALLOWED_CUSTOM_FIELDS.has(k)), {
			message: "Unknown custom field key",
		})
		.optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export interface NewsletterFormState {
	success: boolean;
	error?: string;
	existingSubscriber?: boolean;
}

export async function subscribeNewsletterAction(
	_prevState: NewsletterFormState,
	formData: FormData
): Promise<NewsletterFormState> {
	const raw = Object.fromEntries(formData) as Record<string, unknown>;
	if (raw.turnstileToken === "") raw.turnstileToken = undefined;
	return subscribeToNewsletter(raw as unknown as NewsletterFormValues);
}

export async function subscribeToNewsletter(data: unknown): Promise<NewsletterFormState> {
	const validation = newsletterSchema.safeParse(data);
	if (!validation.success) {
		return {
			success: false,
			error: validation.error.issues[0]?.message || "Invalid email address",
		};
	}

	const { email, source, turnstileToken, customFields } = validation.data;

	const headersList = await headers();
	const clientIP =
		headersList.get("cf-connecting-ip") ||
		headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
		"unknown";

	try {
		const { env: cfEnv } = await getCloudflareContext();
		const { success } = await checkRateLimit({
			kv: cfEnv.RATE_LIMIT_KV ?? null,
			key: `newsletter:${clientIP}`,
			limit: NEWSLETTER_LIMIT_PER_MIN,
		});
		if (!success) {
			return {
				success: false,
				error: "Too many attempts. Please try again later.",
			};
		}
	} catch {
		// Rate limiting unavailable in local dev
	}

	const env = await getEnv();

	if (env.NODE_ENV === "production" || turnstileToken) {
		if (!turnstileToken) {
			return { success: false, error: "Bot check required. Please try again." };
		}
		const isValid = await dependencies.verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
		if (!isValid) {
			return { success: false, error: "Bot check failed. Please try again." };
		}
	}

	const apiKey = env.KIT_API_KEY;

	if (!apiKey) {
		logger.error("Kit API key not configured", { route: "newsletter" });
		return { success: false, error: "Newsletter signup is temporarily unavailable." };
	}

	const tagNames = ["architect-brief"];
	const sourceTag = SOURCE_TAG_MAP[source];
	if (sourceTag) tagNames.push(sourceTag);
	if (customFields?.stagefit_zone) tagNames.push("stagefit-lead");

	try {
		const response = await dependencies.fetch("https://api.kit.com/v4/subscribers", {
			method: "POST",
			headers: {
				"X-Kit-Api-Key": apiKey,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				email_address: email,
				...(customFields && { fields: customFields }),
			}),
			signal: AbortSignal.timeout(8_000),
		});

		if (response.ok) {
			const resData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
			const subscriber = resData.subscriber as Record<string, unknown> | undefined;
			const isExisting = subscriber?.created_at !== subscriber?.updated_at;

			await dependencies
				.fetch(`https://api.kit.com/v4/tags/${ARCHITECT_BRIEF_TAG_ID}/subscribers`, {
					method: "POST",
					headers: { "X-Kit-Api-Key": apiKey, "Content-Type": "application/json" },
					body: JSON.stringify({ email_address: email }),
				})
				.catch(() => {});

			return { success: true, existingSubscriber: isExisting };
		}

		const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
		logger.error("Kit API error", {
			route: "newsletter",
			status: response.status,
			error: JSON.stringify(errorData),
		});

		if (response.status === 400 || response.status === 422) {
			const msg = String(
				(errorData?.errors as string[] | undefined)?.[0] ?? errorData?.message ?? ""
			);
			if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("valid")) {
				return { success: false, error: "Please enter a valid email address." };
			}
			return { success: false, error: "Unable to subscribe. Please try again." };
		}

		return { success: false, error: "Failed to subscribe. Please try again." };
	} catch (err) {
		logger.error("Newsletter subscription error", { route: "newsletter", error: String(err) });
		return { success: false, error: "An unexpected error occurred." };
	}
}
