import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Performance monitoring
	tracesSampleRate: 0.1, // 10% of transactions

	// Only enable in production
	enabled: process.env.NODE_ENV === "production",

	// Environment tag
	environment: process.env.NODE_ENV,

	// Release tracking
	release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

	// Filter out noisy errors
	ignoreErrors: ["NEXT_NOT_FOUND", "NEXT_REDIRECT"],
});
