/**
 * TraceForge Vectorizer Module
 * Centralized exports for configuration and validation
 *
 * Note: sanitize.ts is NOT exported here because isomorphic-dompurify
 * requires DOM APIs not available in Cloudflare Workers. Import it
 * directly only in client components: import { sanitizeSvg } from "@/lib/vectorizer/sanitize"
 */

export * from "./config";
export * from "./validation";
