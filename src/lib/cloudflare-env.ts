/**
 * Cloudflare Worker environment access
 *
 * On Cloudflare Workers, secrets are NOT available via process.env.
 * They must be accessed through getCloudflareContext().
 * In local dev (next dev), process.env works as usual.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

interface CloudflareSecrets {
	// Newsletter (Beehiiv, migrated from Listmonk 2026-04-19)
	BEEHIIV_API_KEY?: string;
	BEEHIIV_PUBLICATION_ID?: string;
	// Legacy Listmonk bindings kept for safe rollback; can be removed once
	// the Beehiiv migration has run for ~2 weeks without issues.
	LISTMONK_API_URL?: string;
	LISTMONK_API_USER?: string;
	LISTMONK_API_KEY?: string;
	// Transactional email (Resend) — contact form + newsletter-signup alerts
	RESEND_API_KEY?: string;
	CONTACT_EMAIL?: string;
	TURNSTILE_SECRET_KEY?: string;
	NODE_ENV?: string;
}

/**
 * Get environment variable from Cloudflare Worker context,
 * falling back to process.env for local development.
 */
export async function getEnv(): Promise<CloudflareSecrets> {
	try {
		const { env } = await getCloudflareContext();
		return {
			BEEHIIV_API_KEY: env.BEEHIIV_API_KEY || process.env.BEEHIIV_API_KEY,
			BEEHIIV_PUBLICATION_ID: env.BEEHIIV_PUBLICATION_ID || process.env.BEEHIIV_PUBLICATION_ID,
			LISTMONK_API_URL: env.LISTMONK_API_URL || process.env.LISTMONK_API_URL,
			LISTMONK_API_USER: env.LISTMONK_API_USER || process.env.LISTMONK_API_USER,
			LISTMONK_API_KEY: env.LISTMONK_API_KEY || process.env.LISTMONK_API_KEY,
			RESEND_API_KEY: env.RESEND_API_KEY || process.env.RESEND_API_KEY,
			CONTACT_EMAIL: env.CONTACT_EMAIL || process.env.CONTACT_EMAIL,
			TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY,
			NODE_ENV: process.env.NODE_ENV,
		};
	} catch {
		// getCloudflareContext() throws in local dev (next dev without wrangler)
		return {
			BEEHIIV_API_KEY: process.env.BEEHIIV_API_KEY,
			BEEHIIV_PUBLICATION_ID: process.env.BEEHIIV_PUBLICATION_ID,
			LISTMONK_API_URL: process.env.LISTMONK_API_URL,
			LISTMONK_API_USER: process.env.LISTMONK_API_USER,
			LISTMONK_API_KEY: process.env.LISTMONK_API_KEY,
			RESEND_API_KEY: process.env.RESEND_API_KEY,
			CONTACT_EMAIL: process.env.CONTACT_EMAIL,
			TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
			NODE_ENV: process.env.NODE_ENV,
		};
	}
}
