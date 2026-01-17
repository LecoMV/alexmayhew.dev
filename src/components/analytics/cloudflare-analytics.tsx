import Script from "next/script";

/**
 * Cloudflare Web Analytics
 *
 * Privacy-friendly, free analytics from Cloudflare.
 * Get your beacon token from the Cloudflare dashboard:
 * 1. Go to Analytics & Logs > Web Analytics
 * 2. Add your site and copy the beacon token
 * 3. Set NEXT_PUBLIC_CF_BEACON_TOKEN in your environment
 *
 * @see https://developers.cloudflare.com/analytics/web-analytics/
 */
export function CloudflareAnalytics() {
	const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

	// Don't render if no token is configured
	if (!beaconToken) {
		return null;
	}

	return (
		<Script
			src="https://static.cloudflareinsights.com/beacon.min.js"
			data-cf-beacon={`{"token": "${beaconToken}"}`}
			strategy="afterInteractive"
			defer
		/>
	);
}
