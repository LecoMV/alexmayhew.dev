/**
 * Submit sitemap to Google Search Console after deploy.
 * Uses service account auth via GSC_SERVICE_ACCOUNT_JSON (base64-encoded).
 */

import { google } from "googleapis";

const SITE_URL = "https://alexmayhew.dev/";
const SITEMAP_URL = "https://alexmayhew.dev/sitemap.xml";

const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!raw) {
	console.error("GSC_SERVICE_ACCOUNT_JSON not set");
	process.exit(0); // Non-fatal
}

const credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));

const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, [
	"https://www.googleapis.com/auth/webmasters",
]);

const searchConsole = google.webmasters({ version: "v3", auth });

try {
	await searchConsole.sitemaps.submit({
		siteUrl: SITE_URL,
		feedpath: SITEMAP_URL,
	});
	console.log(`Sitemap submitted to GSC: ${SITEMAP_URL}`);
} catch (err) {
	console.error(`GSC sitemap submission failed: ${err.message}`);
	process.exit(0); // Non-fatal
}
