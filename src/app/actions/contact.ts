"use server";

import { Resend } from "resend";
import { ContactNotification } from "@/components/emails/contact-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
	name: string;
	email: string;
	projectType: string;
	budget: string;
	message: string;
}

export interface ContactFormResult {
	success: boolean;
	error?: string;
}

export async function submitContactForm(formData: ContactFormData): Promise<ContactFormResult> {
	const { name, email, projectType, budget, message } = formData;

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
