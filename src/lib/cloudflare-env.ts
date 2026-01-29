/**
 * Cloudflare Worker environment access
 *
 * On Cloudflare Workers, secrets are NOT available via process.env.
 * They must be accessed through getCloudflareContext().
 * In local dev (next dev), process.env works as usual.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

interface CloudflareSecrets {
	BUTTONDOWN_API_KEY?: string;
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
		const keys = Object.keys(env).filter((k) => !k.startsWith("_"));
		console.log("[getEnv] Cloudflare context available. Env keys:", keys.join(", "));
		return {
			BUTTONDOWN_API_KEY: env.BUTTONDOWN_API_KEY || process.env.BUTTONDOWN_API_KEY,
			RESEND_API_KEY: env.RESEND_API_KEY || process.env.RESEND_API_KEY,
			CONTACT_EMAIL: env.CONTACT_EMAIL || process.env.CONTACT_EMAIL,
			TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY,
			NODE_ENV: process.env.NODE_ENV,
		};
	} catch (e) {
		// getCloudflareContext() throws in local dev (next dev without wrangler)
		console.log(
			"[getEnv] Cloudflare context NOT available, falling back to process.env. Error:",
			String(e)
		);
		return {
			BUTTONDOWN_API_KEY: process.env.BUTTONDOWN_API_KEY,
			RESEND_API_KEY: process.env.RESEND_API_KEY,
			CONTACT_EMAIL: process.env.CONTACT_EMAIL,
			TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
			NODE_ENV: process.env.NODE_ENV,
		};
	}
}
