import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { VectorizerProcessResponseSchema } from "@/lib/schemas/external-responses";
import {
	formatZodError,
	processOptionsSchema,
	taskIdSchema,
	VECTORIZER_CONFIG,
} from "@/lib/vectorizer";

/**
 * POST /api/vectorize/[taskId]/process
 * Start vectorization processing with validated options
 */
export async function POST(
	request: NextRequest,
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

		const body = await request.json();
		const optionsResult = processOptionsSchema.safeParse(body);

		if (!optionsResult.success) {
			return NextResponse.json({ error: formatZodError(optionsResult.error) }, { status: 400 });
		}

		const options = optionsResult.data;

		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};
		if (VECTORIZER_CONFIG.apiKey) {
			headers["X-API-Key"] = VECTORIZER_CONFIG.apiKey;
		}

		const response = await fetch(`${VECTORIZER_CONFIG.apiUrl}/process/${taskIdResult.data}`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				generator: options.generator,
				preset: options.preset,
				remove_background: options.remove_background,
				calculate_quality: options.calculate_quality,
			}),
			signal: AbortSignal.timeout(10_000),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Process request failed" }));
			const detail =
				errorData && typeof errorData === "object" && "detail" in errorData
					? String(errorData.detail)
					: "Process failed";
			return NextResponse.json({ error: detail }, { status: response.status });
		}

		const parsed = VectorizerProcessResponseSchema.safeParse(await response.json());
		if (!parsed.success) {
			logger.error("Vectorizer process response failed validation", {
				requestId,
				route: "/api/vectorize/process",
				method: "POST",
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
		logger.error("Process error", {
			requestId,
			route: "/api/vectorize/process",
			method: "POST",
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
