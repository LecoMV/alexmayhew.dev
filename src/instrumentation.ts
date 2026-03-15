// Server-side Sentry is disabled: @sentry/nextjs uses AsyncLocalStorage
// bound functions that are incompatible with Cloudflare Workers runtime.
// Error: "Cannot call this AsyncLocalStorage bound function outside of the request"
// Client-side Sentry (sentry.client.config.ts) handles browser errors.
// See docs/DEFERRED_AUDIT_ITEMS.md for re-enablement plan (@sentry/cloudflare).
export async function register() {}
