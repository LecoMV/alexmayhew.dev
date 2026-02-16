// Server-side Sentry is disabled: @sentry/nextjs uses AsyncLocalStorage
// bound functions that are incompatible with Cloudflare Workers runtime.
// Client-side Sentry (sentry.client.config.ts) handles browser errors.
// If migrating to Node.js runtime, re-enable the server/edge imports below.
export async function register() {
	// if (process.env.NEXT_RUNTIME === "nodejs") {
	// 	await import("../sentry.server.config");
	// }
	// if (process.env.NEXT_RUNTIME === "edge") {
	// 	await import("../sentry.edge.config");
	// }
}
