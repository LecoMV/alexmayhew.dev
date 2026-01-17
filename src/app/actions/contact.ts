"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { ContactNotification } from "@/components/emails/contact-notification";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
	name: string;
	email: string;
	projectType: string;
	budget: string;
	message: string;
	turnstileToken?: string;
}

export interface ContactFormResult {
	success: boolean;
	error?: string;
}

export async function submitContactForm(formData: ContactFormData): Promise<ContactFormResult> {
	const { name, email, projectType, budget, message, turnstileToken } = formData;

	// Get client IP for rate limiting
	const headersList = await headers();
	const clientIP = getClientIP(headersList);

	// Rate limiting: 5 submissions per hour per IP
	const rateLimitResult = checkRateLimit(`contact:${clientIP}`, {
		limit: 5,
		windowSeconds: 3600,
	});

	if (!rateLimitResult.success) {
		return {
			success: false,
			error: `Too many submissions. Please try again in ${Math.ceil(rateLimitResult.resetIn / 60)} minutes.`,
		};
	}

	// Verify Turnstile token
	if (turnstileToken) {
		const isValidToken = await verifyTurnstileToken(turnstileToken);
		if (!isValidToken) {
			return {
				success: false,
				error: "Security verification failed. Please try again.",
			};
		}
	} else if (process.env.NODE_ENV === "production") {
		// In production, require Turnstile token
		return {
			success: false,
			error: "Security verification required.",
		};
	}

	// Validate required fields
	if (!name || !email || !projectType || !budget || !message) {
		return {
			success: false,
			error: "All fields are required",
		};
	}

	// Basic email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return {
			success: false,
			error: "Invalid email address",
		};
	}

	// Honeypot check - if this field exists, it's a bot
	// (Add a hidden field in form if needed)

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
		const { error } = await resend.emails.send({
			from: "alexmayhew.dev <noreply@alexmayhew.dev>",
			to: process.env.CONTACT_EMAIL || "alex@alexmayhew.dev",
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
			return {
				success: false,
				error: "Failed to send message. Please try again.",
			};
		}

		return { success: true };
	} catch (err) {
		console.error("Contact form error:", err);
		return {
			success: false,
			error: "An unexpected error occurred. Please try again.",
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
