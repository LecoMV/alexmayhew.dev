import { NextRequest, NextResponse } from "next/server";

const VECTORIZER_API = process.env.VECTORIZER_API_URL || "http://localhost:8000";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	try {
		const { taskId } = await params;

		const response = await fetch(`${VECTORIZER_API}/status/${taskId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = (await response
				.json()
				.catch(() => ({ detail: "Status check failed" }))) as { detail?: string };
			return NextResponse.json(
				{ error: errorData.detail || "Status check failed" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Status error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
