/**
 * TraceForge Vectorizer Module
 *
 * Centralized exports for configuration, validation, and utilities.
 * Implements BFF (Backend-for-Frontend) pattern per Next.js 2026 best practices.
 *
 * @example
 * import { proxyFetch, validateFile, taskIdSchema } from "@/lib/vectorizer";
 *
 * // Use proxyFetch for JSON API calls (auto-handles auth)
 * const result = await proxyFetch<ResponseType>("/endpoint", { method: "POST", body });
 *
 * // Use createAuthHeaders for non-JSON responses (downloads)
 * const headers = createAuthHeaders();
 */

export * from "./config";
export * from "./validation";
export * from "./sanitize";
