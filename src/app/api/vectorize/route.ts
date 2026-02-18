import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { validateFile, VECTORIZER_CONFIG } from "@/lib/vectorizer";

/**
 * POST /api/vectorize
 * Proxy upload requests to vectorizer API with validation
 */
export async function POST(request: NextRequest) {
	const requestId = crypto.randomUUID();
	const start = Date.now();
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const validation = validateFile(file);
		if (!validation.valid) {
			return NextResponse.json({ error: validation.error }, { status: 400 });
		}

		// Forward to vectorizer API
		const uploadFormData = new FormData();
		uploadFormData.append("file", file);

		const headers: HeadersInit = {};
		if (VECTORIZER_CONFIG.apiKey) {
			headers["X-API-Key"] = VECTORIZER_CONFIG.apiKey;
		}

		const response = await fetch(`${VECTORIZER_CONFIG.apiUrl}/upload`, {
			method: "POST",
			headers,
			body: uploadFormData,
			signal: AbortSignal.timeout(30_000),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Upload failed" }));
			const detail =
				errorData && typeof errorData === "object" && "detail" in errorData
					? String(errorData.detail)
					: "Upload failed";
			return NextResponse.json({ error: detail }, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		logger.error("Upload error", {
			requestId,
			route: "/api/vectorize",
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
