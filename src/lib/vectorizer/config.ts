/**
 * TraceForge Vectorizer Configuration
 * Centralized configuration to eliminate duplication across API routes
 */

export const VECTORIZER_CONFIG = {
	apiUrl: process.env.VECTORIZER_API_URL || "https://api.alexmayhew.dev",
	apiKey: process.env.VECTORIZER_API_KEY,
} as const;

// API key is optional - only needed if backend has auth enabled
// Log for debugging but don't treat as critical error
if (!VECTORIZER_CONFIG.apiKey && process.env.NODE_ENV === "development") {
	console.info("[TraceForge] Note: VECTORIZER_API_KEY not set. Backend auth must be disabled.");
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
