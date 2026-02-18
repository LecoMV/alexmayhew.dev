import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { filenameSchema, taskIdSchema, VECTORIZER_CONFIG } from "@/lib/vectorizer";

/**
 * GET /api/vectorize/[taskId]/download/[filename]
 * Download processed files with validated parameters
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ taskId: string; filename: string }> }
) {
	const requestId = crypto.randomUUID();
	const start = Date.now();
	try {
		const { taskId, filename } = await params;

		const taskIdResult = taskIdSchema.safeParse(taskId);
		if (!taskIdResult.success) {
			return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
		}

		const filenameResult = filenameSchema.safeParse(filename);
		if (!filenameResult.success) {
			return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
		}

		const headers: HeadersInit = {};
		if (VECTORIZER_CONFIG.apiKey) {
			headers["X-API-Key"] = VECTORIZER_CONFIG.apiKey;
		}

		const response = await fetch(
			`${VECTORIZER_CONFIG.apiUrl}/download/${taskIdResult.data}/${filenameResult.data}`,
			{
				method: "GET",
				headers,
				signal: AbortSignal.timeout(30_000),
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
		logger.error("Download error", {
			requestId,
			route: "/api/vectorize/download",
			method: "GET",
			status: 500,
			durationMs: Date.now() - start,
			error: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, headers: { "x-request-id": requestId } }
		);
	}
}
