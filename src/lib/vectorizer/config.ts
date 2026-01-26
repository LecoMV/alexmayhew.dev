/**
 * TraceForge Vectorizer Configuration
 * Centralized configuration to eliminate duplication across API routes
 */

export const VECTORIZER_CONFIG = {
	apiUrl: process.env.VECTORIZER_API_URL || "https://api.alexmayhew.dev",
	apiKey: process.env.VECTORIZER_API_KEY,
} as const;

// Validate API key is configured (warn in development, error in production)
if (!VECTORIZER_CONFIG.apiKey) {
	const message = "VECTORIZER_API_KEY environment variable is not set";
	if (process.env.NODE_ENV === "production") {
		console.error(`[TraceForge] CRITICAL: ${message}`);
	} else {
		console.warn(`[TraceForge] Warning: ${message}`);
	}
}

export const ALLOWED_IMAGE_TYPES = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/webp",
	"image/gif",
	"image/bmp",
] as const;

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const POTRACE_PRESETS = [
	"logo_smooth",
	"logo",
	"logo_geometric",
	"color_logo",
	"photo",
	"illustration",
	"detailed",
	"smooth",
	"line_art",
	"highres",
	"icon",
] as const;

export const VTRACER_PRESETS = [
	"default",
	"logo",
	"logo_smooth",
	"photo",
	"line_art",
	"detailed",
	"fast",
	"icon",
] as const;

export type PotracePreset = (typeof POTRACE_PRESETS)[number];
export type VtracerPreset = (typeof VTRACER_PRESETS)[number];
export type Generator = "potrace" | "vtracer";
