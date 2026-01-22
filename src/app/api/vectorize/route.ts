import { NextRequest, NextResponse } from "next/server";

const VECTORIZER_API = process.env.VECTORIZER_API_URL || "http://localhost:8000";
const VECTORIZER_API_KEY = process.env.VECTORIZER_API_KEY || "";

// Proxy upload requests to vectorizer API
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Validate file type
		const allowedTypes = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/webp",
			"image/gif",
			"image/bmp",
		];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: "Invalid file type. Allowed: PNG, JPG, WebP, GIF, BMP" },
				{ status: 400 }
			);
		}

		// Validate file size (20MB max)
		if (file.size > 20 * 1024 * 1024) {
			return NextResponse.json({ error: "File too large. Maximum size is 20MB" }, { status: 413 });
		}

		// Forward to vectorizer API
		const uploadFormData = new FormData();
		uploadFormData.append("file", file);

		const response = await fetch(`${VECTORIZER_API}/upload`, {
			method: "POST",
			headers: {
				"X-API-Key": VECTORIZER_API_KEY,
			},
			body: uploadFormData,
		});

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({ detail: "Upload failed" }))) as {
				detail?: string;
			};
			return NextResponse.json(
				{ error: errorData.detail || "Upload failed" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
