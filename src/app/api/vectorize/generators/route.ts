import { NextResponse } from "next/server";
import { VECTORIZER_CONFIG, POTRACE_PRESETS, VTRACER_PRESETS } from "@/lib/vectorizer";

/**
 * GET /api/vectorize/generators
 * Fetch available generators and presets with fallback data
 */
export async function GET() {
	try {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};
		if (VECTORIZER_CONFIG.apiKey) {
			headers["X-API-Key"] = VECTORIZER_CONFIG.apiKey;
		}

		const response = await fetch(`${VECTORIZER_CONFIG.apiUrl}/generators`, {
			method: "GET",
			headers,
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (!response.ok) {
			// Return fallback data if API is unavailable
			return NextResponse.json(getFallbackData());
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("[TraceForge] Generators error:", error);
		// Return fallback data on error
		return NextResponse.json(getFallbackData());
	}
}

/**
 * Fallback data when API is unavailable
 */
function getFallbackData() {
	return {
		generators: {
			potrace: {
				description: "Classic bitmap tracer with excellent quality",
				color_support: "single-color (uses preprocessing for multi-color)",
				presets: [...POTRACE_PRESETS],
				default_preset: "logo_smooth",
				preset_descriptions: {
					logo_smooth: "Maximum curve smoothness - best for most logos",
					logo: "Balanced curves for general logos",
					logo_geometric: "Sharp corners for geometric designs",
					color_logo: "Optimized for multi-color logos",
					photo: "Edge tracing for photographs",
					illustration: "General illustration vectorization",
					detailed: "Preserve fine details",
					smooth: "Maximum artistic smoothing",
					line_art: "Optimized for line art and sketches",
					highres: "Scaled for 600+ DPI input",
					icon: "Optimized for app icons and small graphics",
				},
			},
			vtracer: {
				description: "Modern tracer with native color support",
				color_support: "multi-color native",
				presets: [...VTRACER_PRESETS],
				default_preset: "logo",
				preset_descriptions: {
					default: "Balanced default settings",
					logo: "Optimized for logo vectorization",
					logo_smooth: "Smoother curves for logos",
					photo: "Photo vectorization with color",
					line_art: "Binary mode for line art",
					detailed: "Maximum detail preservation",
					fast: "Fast processing, lower quality",
					icon: "Optimized for app icons with smooth curves",
				},
			},
		},
		default_generator: "potrace",
	};
}
