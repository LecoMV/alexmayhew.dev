import * as Sentry from "@sentry/nextjs";

// Header names we never want to forward to Sentry (auth, cookies, CSRF)
const SENSITIVE_HEADERS = new Set([
	"authorization",
	"cookie",
	"set-cookie",
	"x-csrf-token",
	"x-xsrf-token",
	"x-api-key",
	"x-auth-token",
]);

// Query parameters that commonly carry tokens/PII
const SENSITIVE_QUERY_KEYS = [
	"token",
	"access_token",
	"refresh_token",
	"api_key",
	"key",
	"email",
	"password",
];

function scrubUrl(url: string | undefined): string | undefined {
	if (!url) return url;
	try {
		const parsed = new URL(url, "http://placeholder.invalid");
		for (const key of SENSITIVE_QUERY_KEYS) {
			if (parsed.searchParams.has(key)) parsed.searchParams.set(key, "[Filtered]");
		}
		// Preserve original absolute/relative shape
		return url.startsWith("http")
			? parsed.toString()
			: `${parsed.pathname}${parsed.search}${parsed.hash}`;
	} catch {
		return url;
	}
}

function scrubHeaders(
	headers: Record<string, string> | undefined
): Record<string, string> | undefined {
	if (!headers) return headers;
	const clean: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers)) {
		clean[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? "[Filtered]" : value;
	}
	return clean;
}

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Do not automatically attach IP / user headers / cookies to events
	sendDefaultPii: false,

	// Performance monitoring - capture Core Web Vitals
	tracesSampleRate: 0.1, // 10% of transactions for performance data

	// Session replay for debugging
	replaysSessionSampleRate: 0.1, // 10% of sessions
	replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

	// Only enable in production
	enabled: process.env.NODE_ENV === "production",

	// Filter out noisy errors
	ignoreErrors: [
		// Network errors users can't control
		"Network request failed",
		"Failed to fetch",
		"NetworkError",
		"Load failed",
		// Browser extensions
		"chrome-extension://",
		"moz-extension://",
		// Resize observer (usually harmless)
		"ResizeObserver loop",
	],

	// Environment tag
	environment: process.env.NODE_ENV,

	// Release tracking (set during build)
	release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

	// Browser tracing stays static (tiny, needed for Core Web Vitals).
	// Replay is lazy-loaded below to keep it out of the initial bundle (~38 KB gzip saved).
	integrations: [
		Sentry.browserTracingIntegration({
			enableInp: true,
		}),
	],

	// Strip PII from breadcrumbs and request data before leaving the browser
	beforeSend(event) {
		if (event.request) {
			event.request.url = scrubUrl(event.request.url);
			event.request.headers = scrubHeaders(event.request.headers);
			if (event.request.cookies) event.request.cookies = { _scrubbed: "[Filtered]" };
			if (event.request.data) event.request.data = "[Filtered]";
			if (event.request.query_string && typeof event.request.query_string === "string") {
				event.request.query_string =
					scrubUrl(`?${event.request.query_string}`)?.replace(/^\?/, "") ?? "";
			}
		}

		if (event.user) {
			// Keep id (hashed/anon) if present; drop ip_address, email, username
			delete event.user.ip_address;
			delete event.user.email;
			delete event.user.username;
		}

		if (event.breadcrumbs) {
			event.breadcrumbs = event.breadcrumbs.map((crumb) => {
				const next = { ...crumb };
				if (next.data) {
					const data = { ...next.data } as Record<string, unknown>;
					if (typeof data.url === "string") data.url = scrubUrl(data.url);
					if (typeof data.to === "string") data.to = scrubUrl(data.to);
					if (typeof data.from === "string") data.from = scrubUrl(data.from);
					if (data.request_headers)
						data.request_headers = scrubHeaders(data.request_headers as Record<string, string>);
					if (data.response_headers)
						data.response_headers = scrubHeaders(data.response_headers as Record<string, string>);
					next.data = data;
				}
				return next;
			});
		}

		return event;
	},
});

// Lazy-load Replay only when actually needed (first session/error). Keeps ~38 KB gzip
// out of the main bundle. PII is masked by default — do not relax without review.
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
	Sentry.lazyLoadIntegration("replayIntegration")
		.then((integration) => {
			Sentry.addIntegration(
				integration({
					maskAllText: true,
					blockAllMedia: true,
				})
			);
		})
		.catch(() => {});
}
