/**
 * Geo detection utilities using Cloudflare headers
 * https://developers.cloudflare.com/fundamentals/reference/http-request-headers/
 */

export interface GeoData {
	country: string | null;
	countryName: string | null;
	city: string | null;
	region: string | null;
	timezone: string | null;
	isEU: boolean;
}

// EU member states (ISO 3166-1 alpha-2)
const EU_COUNTRIES = new Set([
	"AT", // Austria
	"BE", // Belgium
	"BG", // Bulgaria
	"HR", // Croatia
	"CY", // Cyprus
	"CZ", // Czech Republic
	"DK", // Denmark
	"EE", // Estonia
	"FI", // Finland
	"FR", // France
	"DE", // Germany
	"GR", // Greece
	"HU", // Hungary
	"IE", // Ireland
	"IT", // Italy
	"LV", // Latvia
	"LT", // Lithuania
	"LU", // Luxembourg
	"MT", // Malta
	"NL", // Netherlands
	"PL", // Poland
	"PT", // Portugal
	"RO", // Romania
	"SK", // Slovakia
	"SI", // Slovenia
	"ES", // Spain
	"SE", // Sweden
]);

// EEA countries (EU + Iceland, Liechtenstein, Norway)
const EEA_COUNTRIES = new Set([...EU_COUNTRIES, "IS", "LI", "NO"]);

// GDPR applies to EU, EEA, and UK
const GDPR_COUNTRIES = new Set([...EEA_COUNTRIES, "GB"]);

/**
 * Extract geo data from Cloudflare headers
 */
export function getGeoFromHeaders(headers: Headers): GeoData {
	const country = headers.get("cf-ipcountry");

	return {
		country,
		countryName: null, // Would need a lookup table
		city: headers.get("cf-ipcity"),
		region: headers.get("cf-region"),
		timezone: headers.get("cf-timezone"),
		isEU: country ? EU_COUNTRIES.has(country) : false,
	};
}

/**
 * Check if GDPR applies to this visitor
 */
export function isGDPRCountry(countryCode: string | null): boolean {
	if (!countryCode) return false;
	return GDPR_COUNTRIES.has(countryCode.toUpperCase());
}

/**
 * Check if visitor is from EU
 */
export function isEUCountry(countryCode: string | null): boolean {
	if (!countryCode) return false;
	return EU_COUNTRIES.has(countryCode.toUpperCase());
}

/**
 * Get geo data for client-side use (via API route)
 */
export function getGeoDataForClient(headers: Headers): {
	country: string | null;
	isEU: boolean;
	requiresCookieConsent: boolean;
} {
	const country = headers.get("cf-ipcountry");
	return {
		country,
		isEU: isEUCountry(country),
		requiresCookieConsent: isGDPRCountry(country),
	};
}
