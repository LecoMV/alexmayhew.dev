/**
 * Simple in-memory rate limiter for edge functions
 * For production at scale, use Cloudflare Rate Limiting or KV
 */

const MAX_ENTRIES = 10_000;
const MAX_IP_LENGTH = 45; // Max IPv6 string length

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
export function cleanupRateLimits() {
	const now = Date.now();
	for (const [key, entry] of rateLimitMap.entries()) {
		if (now > entry.resetTime) {
			rateLimitMap.delete(key);
		}
	}
}

setInterval(cleanupRateLimits, 60000); // Clean every minute

export interface RateLimitConfig {
	/** Maximum requests allowed in the window */
	limit: number;
	/** Time window in seconds */
	windowSeconds: number;
}

export interface RateLimitResult {
	success: boolean;
	remaining: number;
	resetIn: number;
}

export function checkRateLimit(
	identifier: string,
	config: RateLimitConfig = { limit: 5, windowSeconds: 60 }
): RateLimitResult {
	const now = Date.now();
	const windowMs = config.windowSeconds * 1000;
	const key = identifier;

	// Prevent unbounded map growth from unique identifiers
	if (rateLimitMap.size >= MAX_ENTRIES) {
		cleanupRateLimits();
		if (rateLimitMap.size >= MAX_ENTRIES) {
			let oldestKey = "";
			let oldestTime = Infinity;
			for (const [k, e] of rateLimitMap) {
				if (e.resetTime < oldestTime) {
					oldestTime = e.resetTime;
					oldestKey = k;
				}
			}
			if (oldestKey) rateLimitMap.delete(oldestKey);
		}
	}

	let entry = rateLimitMap.get(key);

	// If no entry or window expired, create new entry
	if (!entry || now > entry.resetTime) {
		entry = {
			count: 1,
			resetTime: now + windowMs,
		};
		rateLimitMap.set(key, entry);
		return {
			success: true,
			remaining: config.limit - 1,
			resetIn: config.windowSeconds,
		};
	}

	// Increment count
	entry.count++;

	if (entry.count > config.limit) {
		return {
			success: false,
			remaining: 0,
			resetIn: Math.ceil((entry.resetTime - now) / 1000),
		};
	}

	return {
		success: true,
		remaining: config.limit - entry.count,
		resetIn: Math.ceil((entry.resetTime - now) / 1000),
	};
}

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

/** Test-only accessor for map size */
export function getRateLimitMapSize(): number {
	return rateLimitMap.size;
}
