import { NextResponse } from "next/server";
import { proxyFetch, POTRACE_PRESETS, VTRACER_PRESETS } from "@/lib/vectorizer";

/**
 * Generator info response type
 */
interface GeneratorsResponse {
	generators: {
		potrace: {
			description: string;
			color_support: string;
			presets: string[];
			default_preset: string;
			preset_descriptions: Record<string, string>;
		};
		vtracer: {
			description: string;
			color_support: string;
			presets: string[];
			default_preset: string;
			preset_descriptions: Record<string, string>;
		};
	};
	default_generator: string;
}

/**
 * Fallback data when API is unavailable
 * Uses local preset constants to stay in sync
 */
const FALLBACK_DATA: GeneratorsResponse = {
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

/**
 * GET /api/vectorize/generators
 * Fetch available generators and presets
 *
 * Returns cached response for 1 hour, with fallback data if API unavailable
 */
export async function GET() {
	const result = await proxyFetch<GeneratorsResponse>("/generators", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// Note: Next.js fetch caching handled via route segment config
	});

	if (result.ok) {
		return NextResponse.json(result.data);
	}

	// Return fallback data if API is unavailable
	console.warn("[TraceForge] Generators API unavailable, using fallback data");
	return NextResponse.json(FALLBACK_DATA);
}

/**
 * Route segment config for caching
 * Revalidate every hour since generator info rarely changes
 */
export const revalidate = 3600;
