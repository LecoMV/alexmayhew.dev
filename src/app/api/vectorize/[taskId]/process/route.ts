import { NextRequest, NextResponse } from "next/server";
import { proxyFetch, taskIdSchema, processOptionsSchema, formatZodError } from "@/lib/vectorizer";

/**
 * Process response from vectorizer API
 */
interface ProcessResponse {
	task_id: string;
	status: string;
	message?: string;
}

/**
 * POST /api/vectorize/[taskId]/process
 * Start vectorization processing with validated options
 *
 * Implements BFF (Backend-for-Frontend) pattern:
 * - Validates taskId format (prevents path traversal)
 * - Validates process options with Zod schema
 * - Handles auth automatically via proxyFetch
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	try {
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

		const result = await proxyFetch<ProcessResponse>(`/process/${taskIdResult.data}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				generator: options.generator,
				preset: options.preset,
				remove_background: options.remove_background,
				calculate_quality: options.calculate_quality,
			}),
		});

		if (result.ok) {
			return NextResponse.json(result.data);
		}

		return NextResponse.json({ error: result.error }, { status: result.status });
	} catch (error) {
		console.error(
			"[TraceForge] Process error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
