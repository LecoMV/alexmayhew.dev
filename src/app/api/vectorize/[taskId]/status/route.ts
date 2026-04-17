import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { VectorizerStatusResponseSchema } from "@/lib/schemas/external-responses";
import { taskIdSchema, VECTORIZER_CONFIG } from "@/lib/vectorizer";

/**
 * GET /api/vectorize/[taskId]/status
 * Check processing status with validated task ID
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	const requestId = crypto.randomUUID();
	const start = Date.now();
	try {
		const { taskId } = await params;

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
			signal: AbortSignal.timeout(5_000),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Status check failed" }));
			const detail =
				errorData && typeof errorData === "object" && "detail" in errorData
					? String(errorData.detail)
					: "Status check failed";
			return NextResponse.json({ error: detail }, { status: response.status });
		}

		const parsed = VectorizerStatusResponseSchema.safeParse(await response.json());
		if (!parsed.success) {
			logger.error("Vectorizer status response failed validation", {
				requestId,
				route: "/api/vectorize/status",
				method: "GET",
				status: 502,
				durationMs: Date.now() - start,
				error: parsed.error.message,
			});
			return NextResponse.json(
				{ error: "Upstream validation failed", upstream: "vectorizer" },
				{ status: 502, headers: { "x-request-id": requestId } }
			);
		}
		return NextResponse.json(parsed.data);
	} catch (error) {
		logger.error("Status check error", {
			requestId,
			route: "/api/vectorize/status",
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
