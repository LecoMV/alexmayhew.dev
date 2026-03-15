export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("../sentry.server.config");
	}
	// Error: "Cannot call this AsyncLocalStorage bound function outside of the request"
}
