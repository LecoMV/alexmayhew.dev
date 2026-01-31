import { NextRequest, NextResponse } from "next/server";
import { VECTORIZER_CONFIG, taskIdSchema } from "@/lib/vectorizer";

/**
 * GET /api/vectorize/[taskId]/status
 * Check processing status with validated task ID
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	try {
		const { taskId } = await params;

		// Validate taskId format (prevents path traversal and injection)
		const taskIdResult = taskIdSchema.safeParse(taskId);
		if (!taskIdResult.success) {
			return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
		}

		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};
		if (VECTORIZER_CONFIG.apiKey) {
			headers["X-API-Key"] = VECTORIZER_CONFIG.apiKey;
		}

		const response = await fetch(`${VECTORIZER_CONFIG.apiUrl}/status/${taskIdResult.data}`, {
			method: "GET",
			headers,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Status check failed" }));
			const detail =
				errorData && typeof errorData === "object" && "detail" in errorData
					? String(errorData.detail)
					: "Status check failed";
			return NextResponse.json({ error: detail }, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(
			"[TraceForge] Status error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
