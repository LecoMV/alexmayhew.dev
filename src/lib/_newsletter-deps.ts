/**
 * Dependency injection container for the newsletter Server Action.
 *
 * This module intentionally lives OUTSIDE the `"use server"` boundary because
 * any export from a `"use server"` module becomes a callable HTTP endpoint.
 * Keeping the test DI setters here prevents `__setDependencies` /
 * `__resetDependencies` from being exposed as production Server Actions.
 */

import { verifyTurnstileToken } from "@/lib/turnstile";

export interface NewsletterDependencies {
	fetch: typeof globalThis.fetch;
	verifyTurnstile: typeof verifyTurnstileToken;
}

export const dependencies: NewsletterDependencies = {
	fetch: globalThis.fetch,
	verifyTurnstile: verifyTurnstileToken,
};

// Internal test-only DI setter. NOT a Server Action ... callable only in-process.
export function __setDependencies(deps: Partial<NewsletterDependencies>): void {
	Object.assign(dependencies, deps);
}

// Reset dependencies (for testing cleanup)
export function __resetDependencies(): void {
	dependencies.fetch = globalThis.fetch;
	dependencies.verifyTurnstile = verifyTurnstileToken;
}
