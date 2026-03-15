const MAX_IP_LENGTH = 45;

/**
 * Get client IP from request headers
 * Cloudflare provides the real IP in CF-Connecting-IP
 */
export function getClientIP(headers: Headers): string {
	const ip =
		headers.get("cf-connecting-ip") ||
		headers.get("x-forwarded-for")?.split(",")[0].trim() ||
		headers.get("x-real-ip") ||
		"unknown";
	return ip.length <= MAX_IP_LENGTH ? ip : ip.slice(0, MAX_IP_LENGTH);
}
