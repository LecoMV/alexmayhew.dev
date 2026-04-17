const MAX_IP_LENGTH = 45;

const WINDOW_MS = 60_000;
const KV_TTL_SECONDS = 120;

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

export type CheckRateLimitOptions = {
	kv: KVNamespace | null | undefined;
	key: string;
	limit: number;
};

export type RateLimitResult = { success: boolean };

/**
 * KV-backed fixed-window rate limiter.
 *
 * Fails open: if KV is unavailable or throws, the request is allowed through.
 * A portfolio contact form prefers letting a legitimate message through over
 * silently dropping it during a KV incident. Under concurrent bursts the
 * counter may slightly overshoot the limit (non-atomic GET+PUT), which is
 * acceptable for our traffic profile. Migrate to Durable Objects or the
 * native `ratelimit` binding once Wrangler ships a stable schema.
 */
export async function checkRateLimit(options: CheckRateLimitOptions): Promise<RateLimitResult> {
	const { kv, key, limit } = options;
	if (!kv) return { success: true };

	const bucket = Math.floor(Date.now() / WINDOW_MS);
	const storageKey = `ratelimit:${key}:${bucket}`;

	try {
		const raw = await kv.get(storageKey);
		const count = raw ? Number.parseInt(raw, 10) : 0;
		if (count >= limit) return { success: false };
		await kv.put(storageKey, String(count + 1), { expirationTtl: KV_TTL_SECONDS });
		return { success: true };
	} catch {
		return { success: true };
	}
}
