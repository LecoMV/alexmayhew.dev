import { NextRequest, NextResponse } from "next/server";

const VECTORIZER_API = process.env.VECTORIZER_API_URL || "http://localhost:8000";
const VECTORIZER_API_KEY = process.env.VECTORIZER_API_KEY || "";

interface ProcessOptions {
	generator?: "potrace" | "vtracer";
	preset?: string;
	remove_background?: boolean;
	calculate_quality?: boolean;
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	try {
		const { taskId } = await params;
		const body: ProcessOptions = await request.json();

		// Validate generator
		const validGenerators = ["potrace", "vtracer"];
		const generator = body.generator || "potrace";
		if (!validGenerators.includes(generator)) {
			return NextResponse.json({ error: "Invalid generator" }, { status: 400 });
		}

		// Validate preset based on generator
		const potracePresets = [
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
		];
		const vtracerPresets = [
			"default",
			"logo",
			"logo_smooth",
			"photo",
			"line_art",
			"detailed",
			"fast",
		];
		const validPresets = generator === "potrace" ? potracePresets : vtracerPresets;
		const preset = body.preset || (generator === "potrace" ? "logo_smooth" : "logo");

		if (!validPresets.includes(preset)) {
			return NextResponse.json({ error: `Invalid preset for ${generator}` }, { status: 400 });
		}

		const response = await fetch(`${VECTORIZER_API}/process/${taskId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": VECTORIZER_API_KEY,
			},
			body: JSON.stringify({
				generator,
				preset,
				remove_background: body.remove_background || false,
				calculate_quality: body.calculate_quality ?? true,
			}),
		});

		if (!response.ok) {
			const errorData = (await response
				.json()
				.catch(() => ({ detail: "Process request failed" }))) as { detail?: string };
			return NextResponse.json(
				{ error: errorData.detail || "Process failed" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Process error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
