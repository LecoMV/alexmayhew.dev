import { NextRequest, NextResponse } from "next/server";
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

/**
 * POST: Test actual Buttondown subscription from the Worker.
 * Body: { "email": "test@example.com" }
 * DELETE after debugging.
 */
export async function POST(request: NextRequest) {
	const results: Record<string, unknown> = {
		timestamp: new Date().toISOString(),
	};

	try {
		const body = (await request.json()) as { email?: string };
		const email = body.email;
		if (!email) {
			return NextResponse.json({ error: "email required" }, { status: 400 });
		}

		const { env } = await getCloudflareContext();
		const apiKey = env.BUTTONDOWN_API_KEY;

		results.hasApiKey = !!apiKey;
		results.apiKeyLength = apiKey?.length ?? 0;

		if (!apiKey) {
			return NextResponse.json({ ...results, error: "no API key" }, { status: 500 });
		}

		const response = await fetch("https://api.buttondown.email/v1/subscribers", {
			method: "POST",
			headers: {
				Authorization: `Token ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email_address: email,
				metadata: {
					source: "debug-test",
					subscribed_at: new Date().toISOString(),
				},
				tags: ["debug-test"],
			}),
		});

		results.responseStatus = response.status;
		results.responseOk = response.ok;

		const responseBody = await response.text();
		try {
			results.responseBody = JSON.parse(responseBody);
		} catch {
			results.responseBody = responseBody;
		}

		return NextResponse.json(results, {
			headers: { "Cache-Control": "no-store" },
		});
	} catch (e) {
		results.error = String(e);
		return NextResponse.json(results, { status: 500 });
	}
}
