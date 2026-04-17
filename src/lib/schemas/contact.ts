import { z } from "zod";

// Helper: optional field that accepts empty string or undefined,
// collapses both to "" so downstream consumers keep a stable `string` type.
const optionalString = z
	.string()
	.optional()
	.transform((v) => v ?? "");

// Helper: optional enum that additionally accepts empty string.
// Output type is `string` so downstream code does not need to branch on undefined.
// Uses preprocess so custom enum errors propagate (z.union would swallow them).
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
	z
		.preprocess(
			(v) => (v === "" || v === undefined ? undefined : v),
			z.enum(values, { message }).optional()
		)
		.transform((v) => v ?? "");

export const contactFormSchema = z.object({
	name: optionalString.pipe(
		z
			.string()
			.max(100, "Name is too long")
			.refine((v) => v === "" || v.length >= 2, "Name must be at least 2 characters")
	),
	email: z.string().email("Please enter a valid email address").max(254, "Email is too long"),
	projectType: optionalEnum(
		["web-app", "saas", "ecommerce", "consulting", "other"] as const,
		"Please select a valid project type"
	),
	budget: optionalEnum(
		["5k-10k", "10k-25k", "25k-50k", "50k+", "not-sure"] as const,
		"Please select a valid budget range"
	),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(5000, "Message is too long"),
	referralSource: optionalEnum(
		["google", "blog", "linkedin", "x-twitter", "referral", "devto", "other"] as const,
		"Please select how you heard about us"
	),
	turnstileToken: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
