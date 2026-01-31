import { NextRequest, NextResponse } from "next/server";
import { proxyFetch, taskIdSchema } from "@/lib/vectorizer";

/**
 * Status response from vectorizer API
 */
interface StatusResponse {
	task_id: string;
	status: "pending" | "processing" | "completed" | "failed";
	progress?: number;
	error?: string;
	files?: string[];
	quality_score?: number;
}

/**
 * GET /api/vectorize/[taskId]/status
 * Check processing status with validated task ID
 *
 * Implements BFF pattern with automatic auth handling
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

		const result = await proxyFetch<StatusResponse>(`/status/${taskIdResult.data}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		if (result.ok) {
			return NextResponse.json(result.data);
		}

		return NextResponse.json({ error: result.error }, { status: result.status });
	} catch (error) {
		console.error(
			"[TraceForge] Status error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
