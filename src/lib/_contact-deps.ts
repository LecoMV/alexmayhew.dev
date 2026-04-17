/**
 * Dependency injection container for the contact Server Action.
 *
 * This module intentionally lives OUTSIDE the `"use server"` boundary because
 * any export from a `"use server"` module becomes a callable HTTP endpoint.
 * Keeping the test DI setters here prevents `__setDependencies` /
 * `__resetDependencies` from being exposed as production Server Actions.
 */

import { verifyTurnstileToken } from "@/lib/turnstile";

// Email sending function type for dependency injection
export type SendEmailFn = (params: {
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

export interface ContactDependencies {
	sendEmail: SendEmailFn;
	verifyTurnstile: typeof verifyTurnstileToken;
}

export const dependencies: ContactDependencies = {
	sendEmail: sendEmailViaResend,
	verifyTurnstile: verifyTurnstileToken,
};

// Internal test-only DI setter. NOT a Server Action ... callable only in-process.
export function __setDependencies(deps: Partial<ContactDependencies>): void {
	Object.assign(dependencies, deps);
}

// Reset dependencies (for testing cleanup)
export function __resetDependencies(): void {
	dependencies.sendEmail = sendEmailViaResend;
	dependencies.verifyTurnstile = verifyTurnstileToken;
}
