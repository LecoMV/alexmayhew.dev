import { NextRequest, NextResponse } from "next/server";

const VECTORIZER_API = process.env.VECTORIZER_API_URL || "https://api.alexmayhew.dev";
const VECTORIZER_API_KEY = process.env.VECTORIZER_API_KEY || "";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ taskId: string; filename: string }> }
) {
	try {
		const { taskId, filename } = await params;

		// Validate filename to prevent path traversal
		if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
			return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
		}

		const response = await fetch(`${VECTORIZER_API}/download/${taskId}/${filename}`, {
			method: "GET",
			headers: {
				"X-API-Key": VECTORIZER_API_KEY,
			},
		});

		if (!response.ok) {
			return NextResponse.json({ error: "File not found" }, { status: response.status });
		}

		const contentType = response.headers.get("content-type") || "application/octet-stream";
		const buffer = await response.arrayBuffer();

		return new NextResponse(buffer, {
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": `attachment; filename="${filename}"`,
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch (error) {
		console.error("Download error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
