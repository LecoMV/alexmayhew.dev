// Next.js instrumentation entrypoint.
//
// On OpenNext-Cloudflare, the Worker runtime wraps the entire handler via
// custom-worker.ts (which uses @sentry/cloudflare — the Workers-native SDK).
// @sentry/nextjs is a Node.js-targeted package and its captureRequestError
// export pulls in Node-only primitives that throw at module load under the
// Workers runtime, causing every request to 500. So instrumentation.ts MUST
// remain a no-op on this deploy target; all server-side Sentry capture is
// handled in custom-worker.ts at the Worker boundary.
//
// If/when OpenNext gains native `@sentry/nextjs` edge support, wire it here.
export function register(): void {}
