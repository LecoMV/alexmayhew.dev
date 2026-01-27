export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		// Sentry config is at project root, relative to src/
		const { init } = await import("@sentry/nextjs");
		init({
			dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
			tracesSampleRate: 0.1,
			enabled: process.env.NODE_ENV === "production",
			environment: process.env.NODE_ENV,
			release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
			ignoreErrors: ["NEXT_NOT_FOUND", "NEXT_REDIRECT"],
		});
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		const { init } = await import("@sentry/nextjs");
		init({
			dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
			tracesSampleRate: 0.05,
			enabled: process.env.NODE_ENV === "production",
			environment: process.env.NODE_ENV,
			release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
		});
	}
}

export const onRequestError = async (
	err: Error,
	request: { path: string; method: string; headers: Record<string, string> },
	context: { routerKind: string; routePath: string; routeType: string; renderSource: string }
) => {
	const Sentry = await import("@sentry/nextjs");
	Sentry.captureException(err, {
		extra: {
			request: {
				path: request.path,
				method: request.method,
			},
			context,
		},
	});
};
