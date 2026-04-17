// Next.js instrumentation entrypoint for Sentry.
// Loads runtime-specific config at server startup.
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("../sentry.server.config");
	}
	if (process.env.NEXT_RUNTIME === "edge") {
		await import("../sentry.edge.config");
	}
}

// Next.js instrumentation contract requires an export named `onRequestError`.
// @sentry/nextjs exports this same function under the name `captureRequestError`.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
