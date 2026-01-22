import { NextResponse } from "next/server";

const VECTORIZER_API = process.env.VECTORIZER_API_URL || "http://localhost:8000";

export async function GET() {
	try {
		const response = await fetch(`${VECTORIZER_API}/generators`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (!response.ok) {
			// Return fallback data if API is unavailable
			return NextResponse.json({
				generators: {
					potrace: {
						description: "Classic bitmap tracer with excellent quality",
						color_support: "single-color (uses preprocessing for multi-color)",
						presets: [
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
						],
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
						},
					},
					vtracer: {
						description: "Modern tracer with native color support",
						color_support: "multi-color native",
						presets: ["default", "logo", "logo_smooth", "photo", "line_art", "detailed", "fast"],
						default_preset: "logo",
						preset_descriptions: {
							default: "Balanced default settings",
							logo: "Optimized for logo vectorization",
							logo_smooth: "Smoother curves for logos",
							photo: "Photo vectorization with color",
							line_art: "Binary mode for line art",
							detailed: "Maximum detail preservation",
							fast: "Fast processing, lower quality",
						},
					},
				},
				default_generator: "potrace",
			});
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Generators error:", error);
		// Return fallback data on error
		return NextResponse.json({
			generators: {
				potrace: {
					description: "Classic bitmap tracer with excellent quality",
					presets: ["logo_smooth", "logo", "logo_geometric", "detailed", "line_art"],
					default_preset: "logo_smooth",
				},
				vtracer: {
					description: "Modern tracer with native color support",
					presets: ["logo", "logo_smooth", "detailed", "fast"],
					default_preset: "logo",
				},
			},
			default_generator: "potrace",
		});
	}
}
