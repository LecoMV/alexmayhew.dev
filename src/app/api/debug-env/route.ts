import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * TEMPORARY debug endpoint to verify Cloudflare Worker secret access.
 * DELETE after debugging newsletter signup issue.
 */
export async function GET() {
	const results: Record<string, unknown> = {
		timestamp: new Date().toISOString(),
		method: "unknown",
	};

	// Test 1: getCloudflareContext()
	try {
		const { env } = await getCloudflareContext();
		const allKeys = Object.keys(env).filter((k) => !k.startsWith("_"));
		results.method = "getCloudflareContext";
		results.cfContextAvailable = true;
		results.cfEnvKeys = allKeys;
		results.hasButtondownKey = !!env.BUTTONDOWN_API_KEY;
		results.buttondownKeyLength = env.BUTTONDOWN_API_KEY?.length ?? 0;
		results.hasResendKey = !!env.RESEND_API_KEY;
		results.hasContactEmail = !!env.CONTACT_EMAIL;
		results.hasTurnstileKey = !!env.TURNSTILE_SECRET_KEY;
	} catch (e) {
		results.cfContextAvailable = false;
		results.cfContextError = String(e);
	}

	// Test 2: process.env fallback
	results.processEnv = {
		hasButtondownKey: !!process.env.BUTTONDOWN_API_KEY,
		hasResendKey: !!process.env.RESEND_API_KEY,
		hasContactEmail: !!process.env.CONTACT_EMAIL,
		hasTurnstileKey: !!process.env.TURNSTILE_SECRET_KEY,
		nodeEnv: process.env.NODE_ENV,
	};

	// Test 3: Quick Buttondown API test (just check auth)
	try {
		const { env } = await getCloudflareContext();
		const apiKey = env.BUTTONDOWN_API_KEY;
		if (apiKey) {
			const resp = await fetch("https://api.buttondown.email/v1/subscribers?page_size=1", {
				headers: {
					Authorization: `Token ${apiKey}`,
				},
			});
			results.buttondownApiTest = {
				status: resp.status,
				ok: resp.ok,
			};
		} else {
			results.buttondownApiTest = { error: "no API key available" };
		}
	} catch (e) {
		results.buttondownApiTest = { error: String(e) };
	}

	return NextResponse.json(results, {
		headers: { "Cache-Control": "no-store" },
	});
}
