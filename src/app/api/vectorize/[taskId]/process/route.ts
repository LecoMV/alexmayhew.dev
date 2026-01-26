import { NextRequest, NextResponse } from "next/server";
import {
	VECTORIZER_CONFIG,
	taskIdSchema,
	processOptionsSchema,
	formatZodError,
} from "@/lib/vectorizer";

/**
 * POST /api/vectorize/[taskId]/process
 * Start vectorization processing with validated options
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	try {
		// Validate API key is configured
		if (!VECTORIZER_CONFIG.apiKey) {
			console.error("[TraceForge] API key not configured");
			return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
		}

		const { taskId } = await params;

		// Validate taskId format (prevents path traversal and injection)
		const taskIdResult = taskIdSchema.safeParse(taskId);
		if (!taskIdResult.success) {
			return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
		}

		// Parse and validate request body
		const body = await request.json();
		const optionsResult = processOptionsSchema.safeParse(body);

		if (!optionsResult.success) {
			return NextResponse.json({ error: formatZodError(optionsResult.error) }, { status: 400 });
		}

		const options = optionsResult.data;

		const response = await fetch(`${VECTORIZER_CONFIG.apiUrl}/process/${taskIdResult.data}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": VECTORIZER_CONFIG.apiKey,
			},
			body: JSON.stringify({
				generator: options.generator,
				preset: options.preset,
				remove_background: options.remove_background,
				calculate_quality: options.calculate_quality,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Process request failed" }));
			const detail =
				errorData && typeof errorData === "object" && "detail" in errorData
					? String(errorData.detail)
					: "Process failed";
			return NextResponse.json({ error: detail }, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(
			"[TraceForge] Process error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
