/**
 * TraceForge Vectorizer Configuration
 *
 * Centralized configuration following 2026 best practices:
 * - Explicit auth mode detection (auth-enabled vs auth-disabled)
 * - Helper functions for DRY authenticated requests
 * - Edge-compatible (no heavy dependencies at module init)
 *
 * @see https://nextjs.org/docs/app/getting-started/proxy
 */

/**
 * Immutable configuration object
 * Uses simple fallbacks for edge runtime compatibility
 */
export const VECTORIZER_CONFIG = {
	/** Backend API URL */
	apiUrl: process.env.VECTORIZER_API_URL || "https://api.alexmayhew.dev",
	/** API key (undefined if auth disabled on backend) */
	apiKey: process.env.VECTORIZER_API_KEY || undefined,
	/** Whether authentication is enabled (API key is configured) */
	get authEnabled(): boolean {
		return Boolean(this.apiKey);
	},
} as const;

/**
 * Type for the vectorizer configuration
 */
export type VectorizerConfig = typeof VECTORIZER_CONFIG;

/**
 * Create authentication headers for API requests
 * Returns empty object if auth is disabled
 *
 * @example
 * const headers = createAuthHeaders();
 * fetch(url, { headers: { ...headers, "Content-Type": "application/json" } });
 */
export function createAuthHeaders(): HeadersInit {
	if (!VECTORIZER_CONFIG.authEnabled || !VECTORIZER_CONFIG.apiKey) {
		return {};
	}
	return { "X-API-Key": VECTORIZER_CONFIG.apiKey };
}

/**
 * Result type for proxy fetch operations
 */
export type ProxyResult<T> =
	| { ok: true; data: T; status: number }
	| { ok: false; error: string; status: number };

/**
 * Proxy fetch wrapper with automatic auth header injection
 * Implements BFF (Backend-for-Frontend) pattern per Next.js 2026 guidelines
 *
 * @param path - API path (appended to apiUrl)
 * @param options - Fetch options (headers are merged with auth headers)
 * @returns Typed result with success/error state
 *
 * @example
 * const result = await proxyFetch<UploadResponse>("/upload", {
 *   method: "POST",
 *   body: formData,
 * });
 * if (result.ok) {
 *   return NextResponse.json(result.data);
 * }
 * return NextResponse.json({ error: result.error }, { status: result.status });
 */
export async function proxyFetch<T>(
	path: string,
	options: RequestInit = {}
): Promise<ProxyResult<T>> {
	const url = `${VECTORIZER_CONFIG.apiUrl}${path}`;
	const authHeaders = createAuthHeaders();

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				...authHeaders,
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Request failed" }));
			const detail =
				errorData && typeof errorData === "object" && "detail" in errorData
					? String(errorData.detail)
					: "Request failed";
			return { ok: false, error: detail, status: response.status };
		}

		const data = (await response.json()) as T;
		return { ok: true, data, status: response.status };
	} catch (error) {
		console.error(
			"[TraceForge] Proxy fetch error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return { ok: false, error: "Service temporarily unavailable", status: 503 };
	}
}

export const ALLOWED_IMAGE_TYPES = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/webp",
	"image/gif",
	"image/bmp",
] as const;

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const POTRACE_PRESETS = [
	"logo_smooth",
	"logo",
	"logo_geometric",
	"color_logo",
	"photo",
	"illustration",
	"detailed",
	"smooth",
	"line_art",
	"highres",
	"icon",
] as const;

export const VTRACER_PRESETS = [
	"default",
	"logo",
	"logo_smooth",
	"photo",
	"line_art",
	"detailed",
	"fast",
	"icon",
] as const;

export type PotracePreset = (typeof POTRACE_PRESETS)[number];
export type VtracerPreset = (typeof VTRACER_PRESETS)[number];
export type Generator = "potrace" | "vtracer";
