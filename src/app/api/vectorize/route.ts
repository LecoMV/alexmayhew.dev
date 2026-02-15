import { NextRequest, NextResponse } from "next/server";

import { validateFile, VECTORIZER_CONFIG } from "@/lib/vectorizer";

/**
 * POST /api/vectorize
 * Proxy upload requests to vectorizer API with validation
 */
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Validate file type and size
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
		// Log error securely without exposing details to client
		console.error(
			"[TraceForge] Upload error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
