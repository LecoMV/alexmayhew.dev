import { z } from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
	email: z.string().email("Please enter a valid email address").max(254, "Email is too long"),
	projectType: z.enum(["web-app", "saas", "ecommerce", "consulting", "other"], {
		message: "Please select a valid project type",
	}),
	budget: z.enum(["5k-10k", "10k-25k", "25k-50k", "50k+"], {
		message: "Please select a valid budget range",
	}),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(5000, "Message is too long"),
	referralSource: z
		.enum(["google", "blog", "linkedin", "x-twitter", "referral", "devto", "other"], {
			message: "Please select how you heard about us",
		})
		.optional(),
	turnstileToken: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
