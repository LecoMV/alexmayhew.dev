/**
 * Typed, Zod-validated environment module.
 *
 * WHY this module exists:
 * - Next.js inlines NEXT_PUBLIC_* vars at build time. We want a single typed
 *   surface (instead of scattered `process.env.NEXT_PUBLIC_X` reads that are
 *   typed `string | undefined` everywhere).
 * - Fail-fast at import time if public env is malformed (invalid NODE_ENV, etc.).
 *
 * WHAT this module does NOT cover:
 * - Server-only secrets (RESEND_API_KEY, LISTMONK_*, TURNSTILE_SECRET_KEY,
 *   CONTACT_EMAIL). On Cloudflare Workers those arrive via bindings, not
 *   process.env — see `src/lib/cloudflare-env.ts` + `getCloudflareContext()`.
 *
 * TODO(followup): migrate individual consumers (sitemap.ts, footer.tsx,
 * analytics components, turnstile.tsx, web-vitals.ts) to read from
 * `publicEnv` instead of `process.env` directly. Kept as a followup to
 * avoid touching many files in this change.
 */

import { z } from "zod";

const publicEnvSchema = z.object({
	// Node runtime mode — always present in practice, but defaulted for safety.
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

	// Build metadata — injected by CI at build time.
	NEXT_PUBLIC_GIT_SHA: z.string().default("development"),
	NEXT_PUBLIC_SITE_VERSION: z.string().default("0.0.0"),
	NEXT_PUBLIC_BUILD_TIME: z.string().optional(),

	// Analytics / observability beacons (all optional — absence disables the feature).
	NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
	NEXT_PUBLIC_CF_BEACON_TOKEN: z.string().optional(),
	NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

	// Turnstile (bot protection) — public site key; secret lives in Worker bindings.
	NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Parse an arbitrary input object against the public env schema.
 * Exported for test use and for scenarios where a caller needs to validate
 * a custom source (e.g. a fixture) rather than `process.env`.
 */
export function parsePublicEnv(input: Record<string, string | undefined>): PublicEnv {
	return publicEnvSchema.parse(input);
}

/**
 * Fail-fast validation of the NEXT_PUBLIC_* surface at module import time.
 * If any schema check fails, the app will crash with a clear error — which
 * is preferable to silent undefined propagation.
 *
 * CRITICAL: Next.js inlines `process.env.NEXT_PUBLIC_*` via literal string
 * replacement at build time. We MUST reference each key as a direct static
 * property read — `process.env as Record<...>` defeats the inlining and
 * produces an empty object at Cloudflare Workers runtime (no process.env).
 */
const rawEnv = {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_GIT_SHA: process.env.NEXT_PUBLIC_GIT_SHA,
	NEXT_PUBLIC_SITE_VERSION: process.env.NEXT_PUBLIC_SITE_VERSION,
	NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
	NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
	NEXT_PUBLIC_CF_BEACON_TOKEN: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN,
	NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
	NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
};

export const publicEnv: PublicEnv = parsePublicEnv(rawEnv);

// Environment-flag helpers derived from the validated NODE_ENV.
// Consumers should prefer these over `process.env.NODE_ENV === "..."`.
export const isDevelopment = publicEnv.NODE_ENV === "development";
export const isProduction = publicEnv.NODE_ENV === "production";
export const isTest = publicEnv.NODE_ENV === "test";
