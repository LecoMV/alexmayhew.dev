import { NextRequest, NextResponse } from "next/server";
import { proxyFetch, validateFile } from "@/lib/vectorizer";

/**
 * Upload response from vectorizer API
 */
interface UploadResponse {
	task_id: string;
	filename: string;
	status: string;
}

/**
 * POST /api/vectorize
 * Proxy upload requests to vectorizer API with validation
 *
 * Implements BFF (Backend-for-Frontend) pattern:
 * - Validates file before forwarding
 * - Handles auth automatically via proxyFetch
 * - Returns typed response
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

		const result = await proxyFetch<UploadResponse>("/upload", {
			method: "POST",
			body: uploadFormData,
		});

		if (result.ok) {
			return NextResponse.json(result.data);
		}

		return NextResponse.json({ error: result.error }, { status: result.status });
	} catch (error) {
		// Log error securely without exposing details to client
		console.error(
			"[TraceForge] Upload error:",
			error instanceof Error ? error.message : "Unknown error"
		);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
