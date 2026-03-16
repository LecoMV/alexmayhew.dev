/**
 * Submit sitemap to Google Search Console after deploy.
 * Uses service account auth via GSC_SERVICE_ACCOUNT_JSON (base64-encoded).
 */

import { google } from "googleapis";

// Domain property format — must match GSC property type
const SITE_URL = "sc-domain:alexmayhew.dev";
const SITEMAP_URL = "https://alexmayhew.dev/sitemap.xml";

const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!raw) {
	console.error("GSC_SERVICE_ACCOUNT_JSON not set");
	process.exit(0); // Non-fatal
}

const credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));

const auth = new google.auth.JWT({
	email: credentials.client_email,
	key: credentials.private_key,
	scopes: ["https://www.googleapis.com/auth/webmasters"],
});

const webmasters = google.webmasters({ version: "v3", auth });

try {
	await webmasters.sitemaps.submit({
		siteUrl: SITE_URL,
		feedpath: SITEMAP_URL,
	});
	console.log(`Sitemap submitted to GSC: ${SITEMAP_URL}`);
} catch (err) {
	console.error(`GSC sitemap submission failed: ${err.message}`);
	process.exit(0); // Non-fatal
}
