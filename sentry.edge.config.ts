import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Performance monitoring (lower rate for edge)
	tracesSampleRate: 0.05, // 5% of transactions

	// Only enable in production
	enabled: process.env.NODE_ENV === "production",

	// Environment tag
	environment: process.env.NODE_ENV,

	// Release tracking (prefer commit SHA for correlation with deployment logs)
	release: process.env.NEXT_PUBLIC_GIT_SHA || process.env.NEXT_PUBLIC_SENTRY_RELEASE,

	sendDefaultPii: false,

	beforeSend(event) {
		if (event.request?.headers) {
			delete event.request.headers.authorization;
			delete event.request.headers.cookie;
		}
		if (event.request?.data && typeof event.request.data === "string") {
			event.request.data = event.request.data.replace(
				/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
				"[REDACTED]"
			);
		}
		return event;
	},
});
