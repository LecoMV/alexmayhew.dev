import { NextRequest, NextResponse } from "next/server";
import {
	VECTORIZER_CONFIG,
	createAuthHeaders,
	taskIdSchema,
	filenameSchema,
} from "@/lib/vectorizer";

/**
 * GET /api/vectorize/[taskId]/download/[filename]
 * Download processed files with validated parameters
 *
 * Note: Uses createAuthHeaders() instead of proxyFetch() because
 * we need to return raw binary data, not JSON
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ taskId: string; filename: string }> }
) {
	try {
		const { taskId, filename } = await params;

		// Validate taskId format (prevents path traversal and injection)
		const taskIdResult = taskIdSchema.safeParse(taskId);
		if (!taskIdResult.success) {
			return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
		}

		// Validate filename (prevents path traversal and header injection)
		const filenameResult = filenameSchema.safeParse(filename);
		if (!filenameResult.success) {
			return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
		}

		const response = await fetch(
			`${VECTORIZER_CONFIG.apiUrl}/download/${taskIdResult.data}/${filenameResult.data}`,
			{
				method: "GET",
				headers: createAuthHeaders(),
			}
		);

		if (!response.ok) {
			return NextResponse.json({ error: "File not found" }, { status: response.status });
		}

		const contentType = response.headers.get("content-type") || "application/octet-stream";
		const buffer = await response.arrayBuffer();

		// Sanitize filename for Content-Disposition header
		// Only allow alphanumeric, dash, underscore, and dot
		const safeFilename = filenameResult.data.replace(/[^a-zA-Z0-9._-]/g, "_");

		return new NextResponse(buffer, {
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": `attachment; filename="${safeFilename}"`,
				"Cache-Control": "public, max-age=3600",
				// Security headers
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error(
			"[TraceForge] Download error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
