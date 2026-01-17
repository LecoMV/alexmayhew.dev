import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Performance monitoring
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

	integrations: [
		Sentry.replayIntegration({
			// Mask all text for privacy
			maskAllText: false,
			// Block all media for privacy
			blockAllMedia: false,
		}),
	],
});
